import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { r2, R2_BUCKET, R2_PUBLIC_URL } from '@/lib/r2';

// Tipos MIME de imagen permitidos → extensión usada para la key en R2.
export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
};

// Adjuntos de correo: imágenes + PDF.
export const ALLOWED_ATTACHMENT_TYPES: Record<string, string> = {
  ...ALLOWED_IMAGE_TYPES,
  'application/pdf': 'pdf',
};

// Carpetas válidas dentro del bucket.
export const UPLOAD_FOLDERS = ['products', 'categories', 'hero', 'email-temp'] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

// Tipos permitidos por carpeta: 'email-temp' acepta PDF + imágenes; el resto solo imágenes.
export function allowedTypesFor(folder: UploadFolder): Record<string, string> {
  return folder === 'email-temp' ? ALLOWED_ATTACHMENT_TYPES : ALLOWED_IMAGE_TYPES;
}

/**
 * Genera una presigned URL para subir un objeto directamente a R2 desde el navegador.
 * El cliente debe hacer PUT con EXACTAMENTE el mismo Content-Type firmado aquí,
 * de lo contrario R2 responde 403 SignatureDoesNotMatch.
 */
export async function createPresignedPut(params: {
  folder: UploadFolder;
  contentType: string;
}): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
  const ext = allowedTypesFor(params.folder)[params.contentType];
  const key = `${params.folder}/${randomUUID()}.${ext}`;

  const uploadUrl = await getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: params.contentType,
    }),
    { expiresIn: 600 }, // 10 minutos
  );

  return { uploadUrl, publicUrl: `${R2_PUBLIC_URL}/${key}`, key };
}
