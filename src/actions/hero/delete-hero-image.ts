'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { deleteFromR2 } from '@/lib/r2-upload';
import { revalidatePath } from 'next/cache';

/** Elimina una imagen del hero (fila en BD + objeto en R2). */
export async function deleteHeroImage(id: string) {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return { ok: false as const, message: 'No autorizado' };
  }

  try {
    const deleted = await prisma.heroImage.delete({ where: { id }, select: { url: true } });
    await deleteFromR2(deleted.url);
    revalidatePath('/');
    revalidatePath('/admin/configuracion');
    return { ok: true as const };
  } catch {
    return { ok: false as const, message: 'No se pudo eliminar la imagen' };
  }
}
