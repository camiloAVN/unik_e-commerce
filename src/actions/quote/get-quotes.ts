'use server';

import prisma from '@/lib/prisma';

export const getQuotes = async () => {
  return prisma.quote.findMany({
    orderBy: { number: 'desc' },
    include: {
      company: true,
      items: { orderBy: { sortOrder: 'asc' } },
    },
  });
};

export const getQuoteById = async (id: string) => {
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      company: true,
      items: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!quote) return { ok: false, message: 'Cotización no encontrada' };
  return { ok: true, quote };
};
