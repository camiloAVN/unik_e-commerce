import { createUploadUrl } from '@/actions';
import type { UploadFolder } from '@/lib/r2-presign';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Sube una imagen a R2 desde el navegador usando una presigned URL.
 * 1) pide la firma al servidor, 2) hace PUT directo a R2 con el MISMO Content-Type.
 * Devuelve la URL pública final.
 */
export async function uploadImageToR2(file: File, folder: UploadFolder): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('La imagen supera el tamaño máximo de 5 MB');
  }

  const signed = await createUploadUrl({ folder, contentType: file.type });
  if (!signed.ok) throw new Error(signed.message);

  const res = await fetch(signed.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  if (!res.ok) {
    throw new Error('Error al subir la imagen a R2');
  }

  return signed.publicUrl;
}
