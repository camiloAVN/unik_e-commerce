import { createUploadUrl } from '@/actions';

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB por adjunto

export type EmailAttachment = {
  url: string;
  key: string;
  filename: string;
  contentType: string;
  size: number;
};

/**
 * Sube un adjunto (PDF o imagen) a R2 en la carpeta temporal 'email-temp' vía presigned URL.
 * Devuelve la metadata necesaria para adjuntarlo y luego borrarlo del bucket.
 */
export async function uploadEmailAttachment(file: File): Promise<EmailAttachment> {
  const isPdf = file.type === 'application/pdf';
  if (!isPdf && !file.type.startsWith('image/')) {
    throw new Error('Solo se permiten PDF o imágenes');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('El archivo supera el tamaño máximo de 15 MB');
  }

  const signed = await createUploadUrl({ folder: 'email-temp', contentType: file.type });
  if (!signed.ok) throw new Error(signed.message);

  const res = await fetch(signed.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  if (!res.ok) throw new Error('Error al subir el adjunto a R2');

  return {
    url: signed.publicUrl,
    key: signed.key,
    filename: file.name,
    contentType: file.type,
    size: file.size,
  };
}
