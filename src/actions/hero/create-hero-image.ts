'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/** Registra una imagen del hero (ya subida a R2) al final del orden. */
export async function createHeroImage({ url, alt }: { url: string; alt?: string }) {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return { ok: false as const, message: 'No autorizado' };
  }
  if (!url || !url.startsWith('http')) {
    return { ok: false as const, message: 'URL de imagen inválida' };
  }

  const last = await prisma.heroImage.findFirst({
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true },
  });

  const image = await prisma.heroImage.create({
    data: { url, alt: alt?.trim() || null, sortOrder: (last?.sortOrder ?? -1) + 1 },
    select: { id: true, url: true, alt: true, sortOrder: true, isActive: true },
  });

  revalidatePath('/');
  revalidatePath('/admin/configuracion');
  return { ok: true as const, image };
}
