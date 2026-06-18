import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { sendOrderEmails } from '@/actions/order/send-order-emails';

/**
 * Marca una orden como pagada de forma idempotente.
 * La llaman tanto el cobro con tarjeta (processPayment) como el webhook de MP.
 */
export const markOrderPaid = async (orderId: string, transactionId?: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, isPaid: true },
  });

  if (!order) {
    return { ok: false, message: `La orden ${orderId} no existe` };
  }

  // Ya estaba pagada — no reenviar correos ni reprocesar.
  if (order.isPaid) {
    return { ok: true, alreadyPaid: true };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      isPaid: true,
      paidAt: new Date(),
      ...(transactionId ? { transactionId } : {}),
    },
  });

  // Enviar correos sin bloquear la confirmación del pago.
  sendOrderEmails(orderId).catch(console.error);

  revalidatePath(`/orders/${orderId}`);

  return { ok: true, alreadyPaid: false };
};
