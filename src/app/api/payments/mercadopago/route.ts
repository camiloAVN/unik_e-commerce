import { createHmac } from 'crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { Payment } from 'mercadopago';
import { mpClient } from '@/lib/mercadopago';
import { markOrderPaid } from '@/lib/mark-order-paid';

/**
 * Verifica la firma del webhook de Mercado Pago.
 * La clave secreta se obtiene en: MP → Tus integraciones → Webhooks → "clave secreta".
 */
function verifySignature(request: NextRequest, dataId: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true; // sin secreto configurado (dev): no validamos

  const xSignature = request.headers.get('x-signature') ?? '';
  const xRequestId = request.headers.get('x-request-id') ?? '';

  const parts = Object.fromEntries(
    xSignature.split(',').map((p) => p.split('=').map((s) => s.trim()))
  );
  const ts = parts['ts'];
  const v1 = parts['v1'];
  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const computed = createHmac('sha256', secret).update(manifest).digest('hex');
  return computed === v1;
}

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const body = await request.json().catch(() => ({} as any));

    // El id del pago puede venir en query (?data.id=) o en el body.
    const dataId =
      url.searchParams.get('data.id') ??
      url.searchParams.get('id') ??
      body?.data?.id ??
      '';

    const type = url.searchParams.get('type') ?? body?.type ?? body?.topic;

    // Solo nos interesan notificaciones de pago.
    if (type !== 'payment' || !dataId) {
      return NextResponse.json({ received: true });
    }

    if (!verifySignature(request, String(dataId))) {
      return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
    }

    const payment = new Payment(mpClient);
    const data = await payment.get({ id: String(dataId) });

    const orderId = data.external_reference;
    if (data.status === 'approved' && orderId) {
      await markOrderPaid(orderId, String(data.id));
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('mercadopago webhook', error);
    // Devolvemos 200 para que MP no reintente indefinidamente por errores nuestros.
    return NextResponse.json({ received: true });
  }
}
