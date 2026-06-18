'use server';

import prisma from '@/lib/prisma';

/**
 * Datos necesarios para el formulario de cotización:
 * empresas activas + productos registrados (para el selector de líneas).
 */
export const getQuoteFormData = async () => {
  const [companies, products] = await Promise.all([
    prisma.company.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        nit: true,
        email: true,
        phone: true,
        contactName: true,
        address: true,
        city: true,
      },
    }),
    prisma.product.findMany({
      orderBy: { title: 'asc' },
      select: { id: true, title: true, price: true },
    }),
  ]);

  return { companies, products };
};
