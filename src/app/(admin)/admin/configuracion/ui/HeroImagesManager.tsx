'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  createHeroImage,
  deleteHeroImage,
  updateHeroImage,
} from '@/actions';
import { uploadImageToR2 } from '@/utils';
import { LuImagePlus, LuTrash2, LuEye, LuEyeOff, LuArrowUp, LuArrowDown } from 'react-icons/lu';

export type HeroImageItem = {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  isActive: boolean;
};

export function HeroImagesManager({ images }: { images: HeroImageItem[] }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (fileInput.current) fileInput.current.value = '';
    if (!files.length) return;

    setUploading(true);
    setError('');
    try {
      for (const file of files) {
        const url = await uploadImageToR2(file, 'hero');
        const res = await createHeroImage({ url });
        if (!res.ok) throw new Error(res.message);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  }

  async function toggle(img: HeroImageItem) {
    setBusyId(img.id);
    await updateHeroImage(img.id, { isActive: !img.isActive });
    setBusyId(null);
    router.refresh();
  }

  async function remove(id: string) {
    setBusyId(id);
    await deleteHeroImage(id);
    setBusyId(null);
    router.refresh();
  }

  // Intercambia el sortOrder con el vecino para reordenar.
  async function move(index: number, dir: -1 | 1) {
    const a = images[index];
    const b = images[index + dir];
    if (!a || !b) return;
    setBusyId(a.id);
    await Promise.all([
      updateHeroImage(a.id, { sortOrder: b.sortOrder }),
      updateHeroImage(b.id, { sortOrder: a.sortOrder }),
    ]);
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="mt-4 bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E5E5E5]">
        <div className="flex items-center gap-2">
          <LuImagePlus className="w-4 h-4 text-[#444444]" />
          <h2 className="font-semibold text-[#111111]">Portada / Hero</h2>
        </div>
        <p className="text-sm text-[#444444] mt-1">
          Imágenes del carrusel de la página de inicio. Tamaño recomendado 1600×400 px (JPG, PNG o WEBP, máx. 5 MB).
        </p>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Subir */}
        <div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="hidden"
            id="hero-upload"
          />
          <label
            htmlFor="hero-upload"
            className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded cursor-pointer transition-colors ${
              uploading
                ? 'bg-[#F8F9FA] text-[#888] cursor-wait'
                : 'bg-[#D61C1C] hover:bg-[#b81818] text-white'
            }`}
          >
            <LuImagePlus className="w-4 h-4" />
            {uploading ? 'Subiendo…' : 'Subir imágenes'}
          </label>
          {error && <p className="text-sm text-[#D61C1C] mt-2">{error}</p>}
        </div>

        {/* Galería */}
        {images.length === 0 ? (
          <p className="text-sm text-[#888] border border-dashed border-[#E5E5E5] rounded-lg px-4 py-8 text-center">
            Aún no hay imágenes. Mientras tanto la home muestra fondos de color por defecto.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((img, i) => (
              <div
                key={img.id}
                className={`relative border rounded-lg overflow-hidden group ${
                  img.isActive ? 'border-[#E5E5E5]' : 'border-amber-300'
                }`}
              >
                <div className="relative aspect-[4/1] bg-[#F8F9FA]">
                  <Image src={img.url} alt={img.alt ?? ''} fill className="object-cover" sizes="400px" />
                  {!img.isActive && (
                    <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                      Oculta
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between px-3 py-2 bg-white">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => move(i, -1)}
                      disabled={i === 0 || busyId === img.id}
                      className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444] disabled:opacity-30"
                      title="Subir en el orden"
                    >
                      <LuArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => move(i, 1)}
                      disabled={i === images.length - 1 || busyId === img.id}
                      className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444] disabled:opacity-30"
                      title="Bajar en el orden"
                    >
                      <LuArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggle(img)}
                      disabled={busyId === img.id}
                      className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444] disabled:opacity-50"
                      title={img.isActive ? 'Ocultar' : 'Mostrar'}
                    >
                      {img.isActive ? <LuEye className="w-4 h-4" /> : <LuEyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => remove(img.id)}
                      disabled={busyId === img.id}
                      className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 text-[#444444] hover:text-[#D61C1C] disabled:opacity-50"
                      title="Eliminar"
                    >
                      <LuTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
