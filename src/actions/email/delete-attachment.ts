'use server';

import { auth } from '@/auth';
import { deleteR2Object } from '@/lib/r2-upload';

/** Borra un adjunto temporal de R2 (carpeta email-temp) cuando se quita antes de enviar. */
export async function deleteEmailAttachment(key: string) {
  const session = await auth();
  if (session?.user.role !== 'admin') return { ok: false as const };
  if (!key.startsWith('email-temp/')) return { ok: false as const };
  await deleteR2Object(key);
  return { ok: true as const };
}
