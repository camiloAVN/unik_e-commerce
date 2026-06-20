import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

// Remitente por defecto / fallback.
export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? 'UNIK <noreply@unik.co>';

// Remitente para correos del e-commerce (recibos / confirmaciones de orden a clientes).
export const FROM_SALES = process.env.RESEND_FROM_SALES ?? FROM_EMAIL;

// Remitente para los correos manuales enviados desde el panel (ventana "Correo").
export const FROM_MANAGEMENT = process.env.RESEND_FROM_MANAGEMENT ?? FROM_EMAIL;
