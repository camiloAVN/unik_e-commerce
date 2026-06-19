'use server';

import { auth } from '@/auth';
import {
  createPresignedPut,
  allowedTypesFor,
  UPLOAD_FOLDERS,
  type UploadFolder,
} from '@/lib/r2-presign';

type Result =
  | { ok: true; uploadUrl: string; publicUrl: string; key: string }
  | { ok: false; message: string };

/**
 * Devuelve una presigned URL para que el cliente suba una imagen directamente a R2.
 * Solo administradores. Valida carpeta y tipo MIME antes de firmar.
 */
export async function createUploadUrl(params: {
  folder: UploadFolder;
  contentType: string;
}): Promise<Result> {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }

  if (!UPLOAD_FOLDERS.includes(params.folder)) {
    return { ok: false, message: 'Carpeta no válida' };
  }

  if (!allowedTypesFor(params.folder)[params.contentType]) {
    const msg =
      params.folder === 'email-temp'
        ? 'Tipo no permitido (usa PDF o imagen JPG, PNG, WEBP, AVIF o GIF)'
        : 'Tipo de imagen no permitido (usa JPG, PNG, WEBP, AVIF o GIF)';
    return { ok: false, message: msg };
  }

  try {
    const { uploadUrl, publicUrl, key } = await createPresignedPut(params);
    return { ok: true, uploadUrl, publicUrl, key };
  } catch {
    return { ok: false, message: 'No se pudo generar la URL de subida' };
  }
}
