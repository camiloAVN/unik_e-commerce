'use server';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL ?? '');

export async function uploadCategoryImage(formData: FormData) {
  const file = formData.get('file') as File | null;
  if (!file || file.size === 0) {
    return { ok: false as const, message: 'No se recibió ninguna imagen' };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise<{ ok: true; url: string } | { ok: false; message: string }>((resolve) => {
    cloudinary.uploader.upload_stream(
      { folder: 'categories', resource_type: 'image' },
      (error, result) => {
        if (error || !result) {
          resolve({ ok: false, message: 'Error al subir la imagen' });
        } else {
          resolve({ ok: true, url: result.secure_url });
        }
      }
    ).end(buffer);
  });
}
