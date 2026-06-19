'use server';

import prisma from '@/lib/prisma';

/** Todas las imágenes del hero (activas o no) — usado por Configuración. */
export async function getHeroImagesAdmin() {
  return prisma.heroImage.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: { id: true, url: true, alt: true, sortOrder: true, isActive: true },
  });
}
