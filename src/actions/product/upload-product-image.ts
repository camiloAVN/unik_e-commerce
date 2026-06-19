'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Persiste la URL de una imagen (ya subida a R2 vía presigned URL) asociándola a un producto.
 */
export async function uploadProductImage({ productId, url }: { productId: string; url: string }) {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return { ok: false as const, message: 'No autorizado' };
  }
  if (!productId) return { ok: false as const, message: 'ID de producto requerido' };
  if (!url || !url.startsWith('http')) return { ok: false as const, message: 'URL de imagen inválida' };

  const image = await prisma.productImage.create({
    data: { url, productId },
    select: { id: true, product: { select: { slug: true } } },
  });

  revalidatePath('/admin/products');
  revalidatePath(`/product/${image.product.slug}`);

  return { ok: true as const, id: image.id, url };
}
