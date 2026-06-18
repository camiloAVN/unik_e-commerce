'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const schema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'El nombre es requerido').max(150),
  nit: z.string().max(50).optional().or(z.literal('')),
  email: z.string().email('Correo inválido').optional().or(z.literal('')),
  phone: z.string().max(50).optional().or(z.literal('')),
  contactName: z.string().max(150).optional().or(z.literal('')),
  address: z.string().max(200).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  notes: z.string().max(1000).optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

export type CompanyFormData = z.infer<typeof schema>;

export async function createUpdateCompany(raw: CompanyFormData) {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  const { id, ...rest } = parsed.data;

  // Normaliza strings vacíos a null para los campos opcionales.
  const data = {
    name: rest.name,
    nit: rest.nit || null,
    email: rest.email || null,
    phone: rest.phone || null,
    contactName: rest.contactName || null,
    address: rest.address || null,
    city: rest.city || null,
    notes: rest.notes || null,
    isActive: rest.isActive,
  };

  try {
    const company = id
      ? await prisma.company.update({ where: { id }, data })
      : await prisma.company.create({ data });

    revalidatePath('/admin/companies');
    return { ok: true, company };
  } catch {
    return { ok: false, message: 'Error al guardar la empresa' };
  }
}
