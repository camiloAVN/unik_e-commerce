import { MercadoPagoConfig } from 'mercadopago';

// Cliente de Mercado Pago para el servidor.
// Solo se necesita el Access Token (Client ID / Secret son para OAuth, no se usan).
export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN ?? '',
  options: { timeout: 10000 },
});

// URL base de la app — se usa para back_urls y notification_url.
export const getAppUrl = () =>
  process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const isLocalUrl = (url: string) =>
  url.includes('localhost') || url.includes('127.0.0.1');
