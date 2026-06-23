import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { type NextRequest } from 'next/server';

const { auth } = NextAuth(authConfig);

export default function middleware(request: NextRequest) {
  // El proxy de Railway termina el TLS y sirve el dominio solo por HTTPS.
  // No forzamos HTTPS aquí: el proxy reenvía internamente por HTTP, así que
  // un redirect manual a https provoca un bucle infinito (ERR_TOO_MANY_REDIRECTS).
  return (auth as any)(request);
}

// Especifica qué rutas proteger
export const config = {
  matcher: [
    // Protege todas las rutas excepto:
    // - api/auth      (rutas de autenticación)
    // - api/payments  (webhook de Mercado Pago — debe ser accesible sin sesión)
    // - _next/static  (archivos estáticos)
    // - _next/image   (optimización de imágenes)
    // - imgs/products (assets locales — excluir o se rompe next/image)
    // - favicon.ico
    '/((?!api/auth|api/payments|_next/static|_next/image|favicon.ico|imgs|products).*)',
  ],
};
