'use client';

import React from 'react';
import { createUpdateProduct, deleteProduct } from '@/actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LuImagePlus, LuPencil, LuPlus, LuTrash2, LuX } from 'react-icons/lu';

type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  tags: string[];
  categoryId: string;
  category: { id: string; name: string };
  images: { url: string }[];
};

type Category = { id: string; name: string };

const EMPTY_FORM = {
  id: '',
  title: '',
  slug: '',
  description: '',
  categoryId: '',
  inStock: '',
  tags: '',
  baseCost: '',
  marginPct: '',
  marginAmt: '',
  price: '',
};

function slugify(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function formatCOP(value: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}

function getImageSrc(url: string) {
  return url.startsWith('http') ? url : `/products/${url}`;
}

export function ProductsClient({ products, categories }: { products: Product[]; categories: Category[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugEdited, setSlugEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<Record<string, string>>({});

  // ── Price calculation ──────────────────────────────────────
  function recalcFromCost(cost: string, pct: string) {
    const c = parseFloat(cost) || 0;
    const p = parseFloat(pct) || 0;
    const amt = c * p / 100;
    return { marginAmt: amt ? amt.toFixed(0) : '', price: (c + amt).toFixed(0) };
  }

  function handleBaseCostChange(value: string) {
    const { marginAmt, price } = recalcFromCost(value, form.marginPct);
    setForm(f => ({ ...f, baseCost: value, marginAmt, price }));
  }

  function handleMarginPctChange(value: string) {
    const { marginAmt, price } = recalcFromCost(form.baseCost, value);
    setForm(f => ({ ...f, marginPct: value, marginAmt, price }));
  }

  function handleMarginAmtChange(value: string) {
    const cost = parseFloat(form.baseCost) || 0;
    const amt = parseFloat(value) || 0;
    const pct = cost > 0 ? (amt / cost * 100).toFixed(1) : '';
    const price = (cost + amt).toFixed(0);
    setForm(f => ({ ...f, marginAmt: value, marginPct: pct, price }));
  }
  // ──────────────────────────────────────────────────────────

  function openNew() {
    setForm(EMPTY_FORM);
    setSlugEdited(false);
    setError('');
    setIsOpen(true);
  }

  function openEdit(p: Product) {
    setForm({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      categoryId: p.categoryId,
      inStock: String(p.inStock),
      tags: p.tags.join(', '),
      baseCost: String(p.price),
      marginPct: '',
      marginAmt: '',
      price: String(p.price),
    });
    setSlugEdited(true);
    setError('');
    setIsOpen(true);
  }

  function handleTitleChange(value: string) {
    setForm(f => ({
      ...f,
      title: value,
      slug: slugEdited ? f.slug : slugify(value),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const price = parseFloat(form.price) || 0;
    if (price <= 0) {
      setError('El precio de venta debe ser mayor a 0');
      setLoading(false);
      return;
    }

    const result = await createUpdateProduct({
      ...(form.id ? { id: form.id } : {}),
      title: form.title,
      slug: form.slug,
      description: form.description,
      price,
      inStock: parseInt(form.inStock) || 0,
      categoryId: form.categoryId,
      tags: form.tags,
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
    const result = await deleteProduct(id);
    if (!result.ok) {
      setDeleteError({ [id]: result.message ?? 'Error al eliminar' });
    } else {
      router.refresh();
    }
  }

  const priceTotal = parseFloat(form.price) || 0;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Productos</h1>
          <p className="text-sm text-[#444444] mt-1">{products.length} productos registrados</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#D61C1C] hover:bg-[#b81818] text-white text-sm font-medium px-4 py-2.5 rounded transition-colors"
        >
          <LuPlus className="w-4 h-4" />
          Nuevo producto
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
        {products.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-[#444444]">No hay productos. Crea el primero.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-[#E5E5E5]">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444] w-12" />
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444] hidden md:table-cell">Categoría</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Precio venta</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Stock</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <React.Fragment key={p.id}>
                  <tr className="border-t border-[#E5E5E5] hover:bg-[#FAFAFA]">
                    <td className="px-4 py-3">
                      {p.images[0] ? (
                        <div className="w-10 h-10 rounded overflow-hidden bg-[#F8F9FA] flex-shrink-0">
                          <Image
                            src={getImageSrc(p.images[0].url)}
                            alt={p.title}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-[#F8F9FA] flex items-center justify-center flex-shrink-0">
                          <LuImagePlus className="w-4 h-4 text-[#E5E5E5]" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#111111]">{p.title}</p>
                      <p className="text-xs text-[#444444] font-mono">{p.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-[#444444] hidden md:table-cell">{p.category.name}</td>
                    <td className="px-4 py-3 text-right font-medium text-[#111111]">{formatCOP(p.price)}</td>
                    <td className="px-4 py-3 text-center text-[#444444]">{p.inStock}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444] hover:text-[#111111] transition-colors"
                          title="Editar"
                        >
                          <LuPencil className="w-4 h-4" />
                        </button>
                        {deletingId === p.id ? (
                          <span className="flex items-center gap-1 text-xs text-[#444444]">
                            <button onClick={() => handleDelete(p.id)} className="text-[#D61C1C] font-medium hover:underline">Eliminar</button>
                            <span>/</span>
                            <button onClick={() => setDeletingId(null)} className="hover:underline">Cancelar</button>
                          </span>
                        ) : (
                          <button
                            onClick={() => { setDeletingId(p.id); setDeleteError({}); }}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444] hover:text-[#D61C1C] transition-colors"
                            title="Eliminar"
                          >
                            <LuTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {deleteError[p.id] && (
                    <tr className="bg-red-50">
                      <td colSpan={6} className="px-4 py-2 text-xs text-[#D61C1C]">{deleteError[p.id]}</td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Drawer overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setIsOpen(false)} />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white border-l border-[#E5E5E5] z-50 flex flex-col shadow-xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] flex-shrink-0">
          <h2 className="font-semibold text-[#111111]">
            {form.id ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444]">
            <LuX className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer form */}
        <form id="product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-[#444444] mb-1.5">Nombre *</label>
            <input
              value={form.title}
              onChange={e => handleTitleChange(e.target.value)}
              className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
              placeholder="Ej. Camiseta Premium"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-semibold text-[#444444] mb-1.5">Descripción *</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111] resize-none"
              placeholder="Descripción del producto"
              required
            />
          </div>

          {/* Serial y Categoría */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#444444] mb-1.5">Serial / SKU *</label>
              <input
                value={form.slug}
                onChange={e => { setSlugEdited(true); setForm(f => ({ ...f, slug: e.target.value })); }}
                className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm font-mono text-[#444444] focus:outline-none focus:border-[#111111]"
                placeholder="camiseta-premium"
                required
              />
              <p className="text-xs text-[#444444] mt-1">Identificador único en URLs</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#444444] mb-1.5">Categoría *</label>
              <select
                value={form.categoryId}
                onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111] bg-white"
                required
              >
                <option value="">Seleccionar…</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Precio */}
          <div className="border border-[#E5E5E5] rounded-lg p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#444444]">Precio</p>

            {/* Precio unitario */}
            <div>
              <label className="block text-xs text-[#444444] mb-1">Precio unitario (costo) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#444444]">$</span>
                <input
                  type="number"
                  min={0}
                  value={form.baseCost}
                  onChange={e => handleBaseCostChange(e.target.value)}
                  className="w-full border border-[#E5E5E5] rounded pl-7 pr-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Margen */}
            <div>
              <label className="block text-xs text-[#444444] mb-1">Margen de ganancia</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={form.marginPct}
                    onChange={e => handleMarginPctChange(e.target.value)}
                    className="w-full border border-[#E5E5E5] rounded pl-3 pr-8 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#444444]">%</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#444444]">$</span>
                  <input
                    type="number"
                    min={0}
                    value={form.marginAmt}
                    onChange={e => handleMarginAmtChange(e.target.value)}
                    className="w-full border border-[#E5E5E5] rounded pl-7 pr-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                    placeholder="0"
                  />
                </div>
              </div>
              <p className="text-xs text-[#444444] mt-1">Edita el % o el valor $ — el otro se actualiza automáticamente</p>
            </div>

            {/* Precio de venta */}
            <div className="bg-[#F8F9FA] rounded p-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#444444]">Precio de venta (en tienda)</p>
                <p className="text-xs text-[#444444] mt-0.5">= Costo + Margen</p>
              </div>
              <p className="text-xl font-bold text-[#111111]">
                {priceTotal > 0 ? formatCOP(priceTotal) : '—'}
              </p>
            </div>
          </div>

          {/* Stock y Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#444444] mb-1.5">Stock *</label>
              <input
                type="number"
                min={0}
                value={form.inStock}
                onChange={e => setForm(f => ({ ...f, inStock: e.target.value }))}
                className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#444444] mb-1.5">Tags</label>
              <input
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                placeholder="ropa, algodón, premium"
              />
            </div>
          </div>

          {/* Imagen (placeholder) */}
          <div>
            <label className="block text-xs font-semibold text-[#444444] mb-1.5">Imagen del producto</label>
            <button
              type="button"
              className="flex items-center gap-2 border border-dashed border-[#E5E5E5] rounded px-4 py-3 text-sm text-[#444444] hover:border-[#111111] hover:text-[#111111] transition-colors w-full justify-center"
            >
              <LuImagePlus className="w-4 h-4" />
              Subir imagen
            </button>
            <p className="text-xs text-[#444444] mt-1">La carga de imágenes estará disponible próximamente</p>
          </div>

          {error && <p className="text-sm text-[#D61C1C]">{error}</p>}
        </form>

        {/* Drawer footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#E5E5E5] flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 border border-[#E5E5E5] rounded px-4 py-2.5 text-sm font-medium text-[#444444] hover:bg-[#F8F9FA] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={loading}
            className="flex-1 bg-[#D61C1C] hover:bg-[#b81818] disabled:opacity-60 text-white rounded px-4 py-2.5 text-sm font-medium transition-colors"
          >
            {loading ? 'Guardando…' : 'Guardar producto'}
          </button>
        </div>
      </div>
    </>
  );
}
