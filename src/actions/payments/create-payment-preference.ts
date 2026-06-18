'use server';

import { Preference } from 'mercadopago';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { mpClient, getAppUrl, isLocalUrl } from '@/lib/mercadopago';

/**
 * Crea una preferencia de Mercado Pago para una orden.
 * Se usa para habilitar el botón "Mercado Pago" (billetera) dentro del Payment Brick.
 * El cobro con tarjeta se procesa aparte en `processPayment`.
 */
export const createPaymentPreference = async (orderId: string) => {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: 'Debe iniciar sesión' };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: { select: { email: true, name: true } } },
  });

  if (!order) {
    return { ok: false, message: 'La orden no existe' };
  }

  // Un usuario normal solo puede pagar sus propias órdenes.
  if (session.user.role === 'user' && order.userId !== session.user.id) {
    return { ok: false, message: 'Esta orden no es tuya' };
  }

  if (order.isPaid) {
    return { ok: false, message: 'La orden ya fue pagada' };
  }

  const appUrl = getAppUrl();
  const local = isLocalUrl(appUrl);

  try {
    const preference = new Preference(mpClient);
    const result = await preference.create({
      body: {
        items: [
          {
            id: order.id,
            title: `Pedido #${order.id.split('-').at(-1)}`,
            quantity: 1,
            unit_price: Math.round(order.total),
            currency_id: 'COP',
          },
        ],
        external_reference: order.id,
        payer: {
          email: order.user.email ?? undefined,
          name: order.user.name ?? undefined,
        },
        // back_urls / auto_return / notification_url solo en producción
        // (Mercado Pago rechaza URLs localhost).
        ...(!local && {
          back_urls: {
            success: `${appUrl}/orders/${order.id}`,
            failure: `${appUrl}/orders/${order.id}`,
            pending: `${appUrl}/orders/${order.id}`,
          },
          auto_return: 'approved',
          notification_url: `${appUrl}/api/payments/mercadopago`,
        }),
      },
    });

    return { ok: true, preferenceId: result.id };
  } catch (error) {
    console.error('createPaymentPreference', error);
    return { ok: false, message: 'No se pudo iniciar el pago con Mercado Pago' };
  }
};
