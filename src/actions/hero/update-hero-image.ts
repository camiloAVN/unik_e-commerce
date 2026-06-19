'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/** Actualiza una imagen del hero: activar/desactivar, reordenar o cambiar el alt. */
export async function updateHeroImage(
  id: string,
  data: { isActive?: boolean; sortOrder?: number; alt?: string },
) {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return { ok: false as const, message: 'No autorizado' };
  }

  const update: { isActive?: boolean; sortOrder?: number; alt?: string | null } = {};
  if (data.isActive !== undefined) update.isActive = data.isActive;
  if (data.sortOrder !== undefined) update.sortOrder = Math.round(data.sortOrder);
  if (data.alt !== undefined) update.alt = data.alt.trim() || null;

  try {
    await prisma.heroImage.update({ where: { id }, data: update });
    revalidatePath('/');
    revalidatePath('/admin/configuracion');
    return { ok: true as const };
  } catch {
    return { ok: false as const, message: 'No se pudo actualizar la imagen' };
  }
}
