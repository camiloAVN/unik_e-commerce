'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const itemSchema = z.object({
  description: z.string().min(1, 'Cada línea necesita una descripción').max(300),
  quantity: z.number().positive('La cantidad debe ser mayor a 0'),
  unitPrice: z.number().min(0, 'El precio no puede ser negativo'),
  productId: z.string().optional().nullable(),
});

const schema = z.object({
  id: z.string().uuid().optional(),
  companyId: z.string().uuid('Selecciona una empresa'),
  status: z.enum(['borrador', 'enviada', 'aceptada', 'rechazada']).default('borrador'),
  validUntil: z.string().optional().nullable(),
  discountPct: z.number().min(0).max(100).default(0),
  notes: z.string().max(2000).optional().or(z.literal('')),
  terms: z.string().max(2000).optional().or(z.literal('')),
  items: z.array(itemSchema).min(1, 'Agrega al menos una línea a la cotización'),
});

export type QuoteFormData = z.infer<typeof schema>;

const IVA = 0.19;

export async function createUpdateQuote(raw: QuoteFormData) {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  const { id, companyId, status, validUntil, discountPct, notes, terms, items } = parsed.data;

  // Cálculos (snapshot) — el servidor es la fuente de verdad.
  const itemsWithTotals = items.map((it, idx) => ({
    description: it.description,
    quantity: it.quantity,
    unitPrice: it.unitPrice,
    total: it.quantity * it.unitPrice,
    productId: it.productId || null,
    sortOrder: idx,
  }));

  const subTotal = itemsWithTotals.reduce((acc, it) => acc + it.total, 0);
  const discountAmount = subTotal * (discountPct / 100);
  const taxableBase = subTotal - discountAmount;
  const tax = taxableBase * IVA;
  const total = taxableBase + tax;

  const quoteData = {
    companyId,
    status,
    validUntil: validUntil ? new Date(validUntil) : null,
    discountPct,
    subTotal,
    discountAmount,
    taxableBase,
    tax,
    total,
    notes: notes || null,
    terms: terms || null,
  };

  try {
    if (id) {
      // Editar: actualizar cabecera y reemplazar líneas.
      const updated = await prisma.$transaction(async (tx) => {
        await tx.quoteItem.deleteMany({ where: { quoteId: id } });
        return tx.quote.update({
          where: { id },
          data: { ...quoteData, items: { create: itemsWithTotals } },
        });
      });
      revalidatePath('/admin/quotes');
      return { ok: true, quote: updated };
    }

    // Crear: generar consecutivo.
    const created = await prisma.$transaction(async (tx) => {
      const agg = await tx.quote.aggregate({ _max: { number: true } });
      const nextNumber = (agg._max.number ?? 0) + 1;
      return tx.quote.create({
        data: { ...quoteData, number: nextNumber, items: { create: itemsWithTotals } },
      });
    });

    revalidatePath('/admin/quotes');
    return { ok: true, quote: created };
  } catch (error) {
    console.error('createUpdateQuote', error);
    return { ok: false, message: 'Error al guardar la cotización' };
  }
}
