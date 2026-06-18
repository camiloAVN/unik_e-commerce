'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteCompany(id: string) {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }

  const count = await prisma.quote.count({ where: { companyId: id } });
  if (count > 0) {
    return {
      ok: false,
      message: `No se puede eliminar: la empresa tiene ${count} cotización(es) asociada(s).`,
    };
  }

  try {
    await prisma.company.delete({ where: { id } });
    revalidatePath('/admin/companies');
    return { ok: true };
  } catch {
    return { ok: false, message: 'Error al eliminar la empresa' };
  }
}
