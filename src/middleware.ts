import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { NextResponse, type NextRequest } from 'next/server';

const { auth } = NextAuth(authConfig);

export default function middleware(request: NextRequest) {
  // Fuerza HTTPS en producción (Railway termina TLS en el proxy).
  if (process.env.NODE_ENV === 'production') {
    const proto = request.headers.get('x-forwarded-proto');
    if (proto === 'http') {
      const url = request.nextUrl.clone();
      url.protocol = 'https:';
      url.port = '';
      return NextResponse.redirect(url, 301);
    }
  }
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
