'use server';

import { randomUUID } from 'crypto';
import { Payment } from 'mercadopago';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { mpClient, getAppUrl, isLocalUrl } from '@/lib/mercadopago';
import { markOrderPaid } from '@/lib/mark-order-paid';

// Datos que entrega el Payment Brick en su callback onSubmit (formData).
interface BrickFormData {
  token?: string;
  issuer_id?: string;
  payment_method_id: string;
  transaction_amount: number;
  installments?: number;
  payer: {
    email: string;
    identification?: { type?: string; number?: string };
  };
}

/**
 * Procesa el cobro con tarjeta de crédito/débito que tokeniza el Payment Brick.
 * Devuelve el estado del pago para que el Brick muestre la pantalla de resultado.
 */
export const processPayment = async (orderId: string, formData: BrickFormData) => {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, status: 'rejected', message: 'Debe iniciar sesión' };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, total: true, isPaid: true, userId: true },
  });

  if (!order) {
    return { ok: false, status: 'rejected', message: 'La orden no existe' };
  }

  if (session.user.role === 'user' && order.userId !== session.user.id) {
    return { ok: false, status: 'rejected', message: 'Esta orden no es tuya' };
  }

  if (order.isPaid) {
    return { ok: true, status: 'approved', message: 'La orden ya estaba pagada' };
  }

  const appUrl = getAppUrl();
  const local = isLocalUrl(appUrl);

  try {
    const payment = new Payment(mpClient);
    const result = await payment.create({
      body: {
        token: formData.token,
        issuer_id: formData.issuer_id ? Number(formData.issuer_id) : undefined,
        payment_method_id: formData.payment_method_id,
        // Usamos el total de la orden de la BD, no el del cliente, por seguridad.
        transaction_amount: Math.round(order.total),
        installments: formData.installments ?? 1,
        description: `Pedido #${order.id.split('-').at(-1)}`,
        external_reference: order.id,
        metadata: { order_id: order.id },
        payer: {
          email: formData.payer.email,
          identification: formData.payer.identification,
        },
        ...(!local && { notification_url: `${appUrl}/api/payments/mercadopago` }),
      },
      requestOptions: { idempotencyKey: randomUUID() },
    });

    const status = result.status ?? 'rejected';

    if (status === 'approved') {
      await markOrderPaid(order.id, String(result.id));
      return { ok: true, status, message: 'Pago aprobado' };
    }

    if (status === 'in_process' || status === 'pending') {
      return {
        ok: true,
        status,
        message: 'Tu pago está siendo procesado. Te avisaremos cuando se confirme.',
      };
    }

    return {
      ok: false,
      status,
      message: result.status_detail ?? 'El pago fue rechazado',
    };
  } catch (error) {
    console.error('processPayment', error);
    return { ok: false, status: 'rejected', message: 'No se pudo procesar el pago' };
  }
};
