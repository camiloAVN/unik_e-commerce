'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteQuote(id: string) {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }

  try {
    // Los items se borran en cascada (onDelete: Cascade).
    await prisma.quote.delete({ where: { id } });
    revalidatePath('/admin/quotes');
    return { ok: true };
  } catch {
    return { ok: false, message: 'Error al eliminar la cotización' };
  }
}
