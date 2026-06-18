'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface SettingsInput {
  adminEmail?: string;
  quoteIssuerName?: string;
  quoteIssuerNit?: string;
  quoteIssuerEmail?: string;
  quoteIssuerPhone?: string;
  quoteIssuerAddress?: string;
  quoteIssuerWebsite?: string;
  quoteFontFamily?: string;
  quoteFontSize?: number;
  quoteHeaderColor?: string;
}

const ALLOWED_FONTS = ['Helvetica', 'Times-Roman', 'Courier'];

export async function updateSettings(data: SettingsInput) {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }

  // Solo persistir las claves recibidas (actualización parcial).
  const update: SettingsInput = {};
  for (const [key, value] of Object.entries(data) as [keyof SettingsInput, unknown][]) {
    if (value === undefined) continue;
    update[key] = value as never;
  }

  // Saneamiento básico de los valores de apariencia.
  if (update.quoteFontFamily && !ALLOWED_FONTS.includes(update.quoteFontFamily)) {
    update.quoteFontFamily = 'Helvetica';
  }
  if (update.quoteFontSize !== undefined) {
    update.quoteFontSize = Math.min(16, Math.max(6, Math.round(update.quoteFontSize)));
  }
  if (update.quoteHeaderColor && !/^#[0-9a-fA-F]{6}$/.test(update.quoteHeaderColor)) {
    update.quoteHeaderColor = '#D61C1C';
  }

  await prisma.appSettings.upsert({
    where: { id: 'singleton' },
    update,
    create: { id: 'singleton', ...update },
  });

  revalidatePath('/admin/configuracion');
  revalidatePath('/admin/quotes');
  return { ok: true };
}
