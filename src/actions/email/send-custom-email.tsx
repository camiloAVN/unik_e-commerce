'use server';

import { auth } from '@/auth';
import { resend, FROM_MANAGEMENT } from '@/lib/resend';
import { getR2ObjectBuffer, deleteR2Object } from '@/lib/r2-upload';
import { renderQuotePdfBuffer } from '@/lib/render-quote-pdf';
import { getSettings } from '@/actions/settings/get-settings';
import { CustomEmail } from '@/emails/CustomEmail';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SendInput {
  to: string;
  subject: string;
  body: string;
  attachments?: { key: string; filename: string }[];
  quoteIds?: string[];
}

export async function sendCustomEmail(input: SendInput) {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return { ok: false as const, message: 'No autorizado' };
  }

  const to = input.to.trim();
  const subject = input.subject.trim();
  const body = input.body.trim();

  if (!EMAIL_RE.test(to)) return { ok: false as const, message: 'Correo del destinatario inválido' };
  if (!subject) return { ok: false as const, message: 'El asunto es obligatorio' };
  if (!body) return { ok: false as const, message: 'El cuerpo del mensaje es obligatorio' };
  if (!process.env.RESEND_API_KEY) {
    return { ok: false as const, message: 'Resend no está configurado (falta RESEND_API_KEY)' };
  }

  const tempKeys = (input.attachments ?? []).map((a) => a.key);

  try {
    // Adjuntos propios (desde R2) + PDFs de cotizaciones (render en servidor).
    const attachments: { filename: string; content: Buffer }[] = [];

    for (const att of input.attachments ?? []) {
      const content = await getR2ObjectBuffer(att.key);
      attachments.push({ filename: att.filename, content });
    }

    for (const quoteId of input.quoteIds ?? []) {
      const pdf = await renderQuotePdfBuffer(quoteId);
      if (pdf) attachments.push(pdf);
    }

    const settings = await getSettings();
    const adminEmail = settings.adminEmail?.trim();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    const { error } = await resend.emails.send({
      from: FROM_MANAGEMENT,
      to,
      bcc: adminEmail || undefined,
      replyTo: settings.quoteIssuerEmail?.trim() || adminEmail || undefined,
      subject,
      react: (
        <CustomEmail
          body={body}
          issuerName={settings.quoteIssuerName || 'UNIK'}
          brandColor={settings.quoteHeaderColor || '#D61C1C'}
          appUrl={appUrl}
        />
      ),
      attachments: attachments.length ? attachments : undefined,
    });

    if (error) {
      return { ok: false as const, message: error.message ?? 'Resend rechazó el envío' };
    }

    // Limpiar adjuntos temporales de R2 tras enviar.
    await Promise.all(tempKeys.map((key) => deleteR2Object(key)));

    return { ok: true as const };
  } catch (err) {
    console.error('[send-custom-email]', err);
    return { ok: false as const, message: 'No se pudo enviar el correo. Inténtalo de nuevo.' };
  }
}
