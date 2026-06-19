'use server';

import prisma from '@/lib/prisma';

/** Imágenes activas del hero, ordenadas — usado por la home. */
export async function getHeroImages() {
  return prisma.heroImage.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: { id: true, url: true, alt: true },
  });
}
