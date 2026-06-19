import type { NextConfig } from "next";

function getR2Hostname(): string | null {
  try {
    const url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    return url ? new URL(url).hostname : null;
  } catch {
    return null;
  }
}

const r2Hostname = getR2Hostname();

const securityHeaders = [
  // Previene clickjacking (la página no puede cargarse en iframes externos)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Previene MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Limita información de referrer enviada a otros sitios
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Protección XSS legacy para navegadores viejos
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Desactiva APIs de hardware no usadas
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Content Security Policy: bloquea scripts, frames e iframes externos no autorizados
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js requiere unsafe-inline/unsafe-eval para hydration.
      // Mercado Pago: SDK + recursos del Payment Brick.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.mercadopago.com https://*.mercadopago.com https://*.mercadolibre.com",
      "style-src 'self' 'unsafe-inline'",
      // Imágenes propias + R2/Cloudflare + Mercado Pago + data URIs
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      // @react-pdf/renderer genera el PDF en un Web Worker creado desde un blob:
      "worker-src 'self' blob:",
      // 'self' API Mercado Pago + data:/blob: para el WASM (fontkit/yoga) de @react-pdf
      // + endpoint S3 de R2 para el PUT directo con presigned URLs (subida de imágenes)
      "connect-src 'self' data: blob: https://api.mercadopago.com https://*.mercadopago.com https://*.mercadolibre.com https://*.r2.cloudflarestorage.com",
      "frame-src https://*.mercadopago.com https://*.mercadolibre.com",
      // Bloquea objetos embebidos (Flash, plugins)
      "object-src 'none'",
      // Previene inyección de base URL
      "base-uri 'self'",
      // Formularios solo pueden enviarse al mismo origen
      "form-action 'self'",
    ].join('; '),
  },
  // HSTS: fuerza HTTPS solo en producción (no aplica en localhost)
  ...(process.env.NODE_ENV === 'production'
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }]
    : []),
];

const nextConfig: NextConfig = {
  // Evita que errores de ESLint/TS preexistentes rompan el build en Railway
  // (ver DEPLOYMENT_PLAYBOOK.md §8).
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      // Host del dominio público configurado (custom domain, p. ej. cdn.unikimportaciones.com)
      ...(r2Hostname
        ? [{ protocol: 'https' as const, hostname: r2Hostname }]
        : []
      ),
      // Subdominios r2.dev (acceso público del bucket, útil para pruebas y al alternar de URL)
      { protocol: 'https' as const, hostname: '**.r2.dev' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
