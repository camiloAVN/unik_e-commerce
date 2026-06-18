'use server';

import prisma from '@/lib/prisma';

export const getCompanies = async () => {
  return prisma.company.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { quotes: true } } },
  });
};

// Versión liviana para selects (formulario de cotización).
export const getActiveCompanies = async () => {
  return prisma.company.findMany({
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
  });
};
