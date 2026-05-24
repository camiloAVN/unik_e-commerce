'use client';

import React from 'react';
import { createUpdateCategory, deleteCategory } from '@/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LuPencil, LuPlus, LuTrash2, LuX } from 'react-icons/lu';

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  _count: { products: number };
};

const EMPTY_FORM = {
  id: '',
  name: '',
  slug: '',
  description: '',
  isActive: true,
  sortOrder: 0,
};

function slugify(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function CategoriesClient({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugEdited, setSlugEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<Record<string, string>>({});

  function openNew() {
    setForm(EMPTY_FORM);
    setSlugEdited(false);
    setError('');
    setIsOpen(true);
  }

  function openEdit(cat: Category) {
    setForm({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? '',
      isActive: cat.isActive,
      sortOrder: cat.sortOrder,
    });
    setSlugEdited(true);
    setError('');
    setIsOpen(true);
  }

  function handleNameChange(value: string) {
    setForm(f => ({
      ...f,
      name: value,
      slug: slugEdited ? f.slug : slugify(value),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await createUpdateCategory({
      ...(form.id ? { id: form.id } : {}),
      name: form.name,
      slug: form.slug,
      description: form.description,
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder),
    });

    setLoading(false);

    if (!result.ok) {
      setError(result.message ?? 'Error desconocido');
      return;
    }

    setIsOpen(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    setDeletingId(null);
    setDeleteError({});
    const result = await deleteCategory(id);
    if (!result.ok) {
      setDeleteError({ [id]: result.message ?? 'Error al eliminar' });
    } else {
      router.refresh();
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Categorías</h1>
          <p className="text-sm text-[#444444] mt-1">{categories.length} categorías registradas</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#D61C1C] hover:bg-[#b81818] text-white text-sm font-medium px-4 py-2.5 rounded transition-colors"
        >
          <LuPlus className="w-4 h-4" />
          Nueva categoría
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
        {categories.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-[#444444]">
            No hay categorías. Crea la primera.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-[#E5E5E5]">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Orden</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444] hidden md:table-cell">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444] hidden lg:table-cell">Descripción</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Productos</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <React.Fragment key={cat.id}>
                  <tr className="border-t border-[#E5E5E5] hover:bg-[#FAFAFA]">
                    <td className="px-4 py-3 text-[#444444] text-center">{cat.sortOrder}</td>
                    <td className="px-4 py-3 font-medium text-[#111111]">{cat.name}</td>
                    <td className="px-4 py-3 text-[#444444] font-mono text-xs hidden md:table-cell">{cat.slug}</td>
                    <td className="px-4 py-3 text-[#444444] hidden lg:table-cell max-w-xs truncate">{cat.description || '—'}</td>
                    <td className="px-4 py-3 text-center text-[#444444]">{cat._count.products}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${cat.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-[#444444]'}`}>
                        {cat.isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(cat)}
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444] hover:text-[#111111] transition-colors"
                          title="Editar"
                        >
                          <LuPencil className="w-4 h-4" />
                        </button>
                        {deletingId === cat.id ? (
                          <span className="flex items-center gap-1 text-xs text-[#444444]">
                            <button onClick={() => handleDelete(cat.id)} className="text-[#D61C1C] font-medium hover:underline">Eliminar</button>
                            <span>/</span>
                            <button onClick={() => setDeletingId(null)} className="hover:underline">Cancelar</button>
                          </span>
                        ) : (
                          <button
                            onClick={() => { setDeletingId(cat.id); setDeleteError({}); }}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444] hover:text-[#D61C1C] transition-colors"
                            title="Eliminar"
                          >
                            <LuTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {deleteError[cat.id] && (
                    <tr className="bg-red-50">
                      <td colSpan={7} className="px-4 py-2 text-xs text-[#D61C1C]">{deleteError[cat.id]}</td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
              <h2 className="font-semibold text-[#111111]">
                {form.id ? 'Editar categoría' : 'Nueva categoría'}
              </h2>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444]">
                <LuX className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1.5">Nombre *</label>
                <input
                  value={form.name}
                  onChange={e => handleNameChange(e.target.value)}
                  className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                  placeholder="Ej. Ropa"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1.5">Slug *</label>
                <input
                  value={form.slug}
                  onChange={e => { setSlugEdited(true); setForm(f => ({ ...f, slug: e.target.value })); }}
                  className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm font-mono text-[#444444] focus:outline-none focus:border-[#111111]"
                  placeholder="ropa"
                  required
                />
                <p className="text-xs text-[#444444] mt-1">Identificador único en URLs. Se genera automáticamente del nombre.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1.5">Descripción</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111] resize-none"
                  placeholder="Descripción breve de la categoría"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-[#444444] mb-1.5">Orden de visualización</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
                    className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                    min={0}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-[#444444] mb-1.5">Estado</label>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                    className={`w-full border rounded px-3 py-2 text-sm font-medium transition-colors ${form.isActive ? 'border-green-500 bg-green-50 text-green-700' : 'border-[#E5E5E5] bg-white text-[#444444]'}`}
                  >
                    {form.isActive ? 'Activa' : 'Inactiva'}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-[#D61C1C]">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 border border-[#E5E5E5] rounded px-4 py-2.5 text-sm font-medium text-[#444444] hover:bg-[#F8F9FA] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#D61C1C] hover:bg-[#b81818] disabled:opacity-60 text-white rounded px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  {loading ? 'Guardando…' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
