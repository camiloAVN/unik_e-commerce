'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const schema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'El nombre es requerido').max(255),
  slug: z.string().min(1, 'El serial es requerido').max(255),
  description: z.string().min(1, 'La descripción es requerida'),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  inStock: z.number().int().min(0, 'El stock debe ser mayor o igual a 0'),
  categoryId: z.string().uuid('Selecciona una categoría'),
  tags: z.string().default(''),
});

export type ProductFormData = z.infer<typeof schema>;

export async function createUpdateProduct(raw: ProductFormData) {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.errors[0]?.message ?? 'Datos inválidos' };
  }

  const { id, tags, slug, ...data } = parsed.data;
  const normalizedSlug = slug.toLowerCase().replace(/\s+/g, '-').trim();
  const tagsArray = tags
    ? tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
    : [];

  try {
    if (id) {
      await prisma.product.update({
        where: { id },
        data: { ...data, slug: normalizedSlug, tags: { set: tagsArray } },
      });
    } else {
      await prisma.product.create({
        data: { ...data, slug: normalizedSlug, tags: { set: tagsArray } },
      });
    }
    revalidatePath('/admin/products');
    revalidatePath('/');
    revalidatePath(`/products/${normalizedSlug}`);
    return { ok: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { ok: false, message: 'Ya existe un producto con ese serial' };
    }
    return { ok: false, message: 'Error al guardar el producto' };
  }
}
