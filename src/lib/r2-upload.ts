import { DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { r2, R2_BUCKET, R2_PUBLIC_URL } from '@/lib/r2';

export async function deleteFromR2(imageUrl: string): Promise<void> {
  const key = imageUrl.replace(`${R2_PUBLIC_URL}/`, '');
  await deleteR2Object(key);
}

/** Borra un objeto de R2 por su key. No lanza (fallos no son fatales). */
export async function deleteR2Object(key: string): Promise<void> {
  try {
    await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
  } catch {
    // Deletion failures are non-fatal
  }
}

/** Descarga un objeto de R2 por su key y lo devuelve como Buffer (para adjuntarlo a un correo). */
export async function getR2ObjectBuffer(key: string): Promise<Buffer> {
  const res = await r2.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }));
  const bytes = await res.Body!.transformToByteArray();
  return Buffer.from(bytes);
}
