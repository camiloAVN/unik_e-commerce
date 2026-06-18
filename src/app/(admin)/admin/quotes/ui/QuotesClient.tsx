'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUpdateQuote, deleteQuote } from '@/actions';
import { currencyFormat } from '@/utils';
import type { QuotePdfData, QuoteIssuer, QuotePdfStyle } from '@/components/quotes/QuotePDF';
import {
  LuDownload,
  LuFileText,
  LuPencil,
  LuPlus,
  LuTrash2,
  LuX,
} from 'react-icons/lu';

type CompanyOption = {
  id: string;
  name: string;
  nit: string | null;
  email: string | null;
  phone: string | null;
  contactName: string | null;
  address: string | null;
  city: string | null;
};

type ProductOption = { id: string; title: string; price: number };

type QuoteItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  productId: string | null;
  sortOrder: number;
};

type Quote = {
  id: string;
  number: number;
  status: string;
  issueDate: string | Date;
  validUntil: string | Date | null;
  discountPct: number;
  subTotal: number;
  discountAmount: number;
  taxableBase: number;
  tax: number;
  total: number;
  notes: string | null;
  terms: string | null;
  company: CompanyOption & { id: string; name: string };
  items: QuoteItem[];
};

type LineRow = {
  key: string;
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

const STATUS_OPTIONS = ['borrador', 'enviada', 'aceptada', 'rechazada'] as const;

const STATUS_STYLES: Record<string, string> = {
  borrador: 'bg-gray-100 text-[#444444]',
  enviada: 'bg-blue-50 text-blue-700',
  aceptada: 'bg-green-50 text-green-700',
  rechazada: 'bg-red-50 text-[#D61C1C]',
};

const IVA = 0.19;
const newKey = () => Math.random().toString(36).slice(2);

function toDateInput(d: string | Date | null | undefined): string {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

export function QuotesClient({
  quotes,
  companies,
  products,
  pdfConfig,
}: {
  quotes: Quote[];
  companies: CompanyOption[];
  products: ProductOption[];
  pdfConfig: { issuer: QuoteIssuer; style: QuotePdfStyle };
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Encabezado del formulario
  const [editId, setEditId] = useState<string>('');
  const [companyId, setCompanyId] = useState('');
  const [status, setStatus] = useState<string>('borrador');
  const [validUntil, setValidUntil] = useState('');
  const [discountPct, setDiscountPct] = useState(0);
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');
  const [lines, setLines] = useState<LineRow[]>([]);

  const totals = useMemo(() => {
    const subTotal = lines.reduce((acc, l) => acc + l.quantity * l.unitPrice, 0);
    const discountAmount = subTotal * (discountPct / 100);
    const taxableBase = subTotal - discountAmount;
    const tax = taxableBase * IVA;
    const total = taxableBase + tax;
    return { subTotal, discountAmount, taxableBase, tax, total };
  }, [lines, discountPct]);

  function openNew() {
    setEditId('');
    setCompanyId('');
    setStatus('borrador');
    setValidUntil('');
    setDiscountPct(0);
    setNotes('');
    setTerms('');
    setLines([{ key: newKey(), productId: '', description: '', quantity: 1, unitPrice: 0 }]);
    setError('');
    setIsOpen(true);
  }

  function openEdit(q: Quote) {
    setEditId(q.id);
    setCompanyId(q.company.id);
    setStatus(q.status);
    setValidUntil(toDateInput(q.validUntil));
    setDiscountPct(q.discountPct);
    setNotes(q.notes ?? '');
    setTerms(q.terms ?? '');
    setLines(
      q.items.map((it) => ({
        key: newKey(),
        productId: it.productId ?? '',
        description: it.description,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
      })),
    );
    setError('');
    setIsOpen(true);
  }

  function addLine() {
    setLines((ls) => [...ls, { key: newKey(), productId: '', description: '', quantity: 1, unitPrice: 0 }]);
  }

  function removeLine(key: string) {
    setLines((ls) => ls.filter((l) => l.key !== key));
  }

  function updateLine(key: string, patch: Partial<LineRow>) {
    setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  }

  function onPickProduct(key: string, productId: string) {
    if (!productId) {
      updateLine(key, { productId: '' });
      return;
    }
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    updateLine(key, { productId, description: p.title, unitPrice: p.price });
  }

  async function buildAndDownload(q: {
    number: number;
    status: string;
    issueDate: string | Date;
    validUntil: string | Date | null;
    company: CompanyOption;
    items: { description: string; quantity: number; unitPrice: number; total: number }[];
    discountPct: number;
    subTotal: number;
    discountAmount: number;
    taxableBase: number;
    tax: number;
    total: number;
    notes: string | null;
    terms: string | null;
  }) {
    const data: QuotePdfData = {
      ...q,
      logoUrl: `${window.location.origin}/imgs/logo.png`,
      issuer: pdfConfig.issuer,
      style: pdfConfig.style,
    };
    const { downloadQuotePdf } = await import('@/components/quotes/QuotePDF');
    await downloadQuotePdf(data);
  }

  async function handleDownloadExisting(q: Quote) {
    await buildAndDownload({
      number: q.number,
      status: q.status,
      issueDate: q.issueDate,
      validUntil: q.validUntil,
      company: q.company,
      items: q.items.map((it) => ({
        description: it.description,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        total: it.total,
      })),
      discountPct: q.discountPct,
      subTotal: q.subTotal,
      discountAmount: q.discountAmount,
      taxableBase: q.taxableBase,
      tax: q.tax,
      total: q.total,
      notes: q.notes,
      terms: q.terms,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await createUpdateQuote({
      ...(editId ? { id: editId } : {}),
      companyId,
      status: status as (typeof STATUS_OPTIONS)[number],
      validUntil: validUntil || null,
      discountPct: Number(discountPct),
      notes,
      terms,
      items: lines.map((l) => ({
        description: l.description,
        quantity: Number(l.quantity),
        unitPrice: Number(l.unitPrice),
        productId: l.productId || null,
      })),
    });

    setLoading(false);

    if (!result.ok || !result.quote) {
      setError(result.message ?? 'Error al guardar');
      return;
    }

    setIsOpen(false);

    // Al crear una nueva cotización, ofrecer el PDF de inmediato.
    if (!editId) {
      const company = companies.find((c) => c.id === companyId);
      if (company) {
        await buildAndDownload({
          number: result.quote.number,
          status: result.quote.status,
          issueDate: result.quote.issueDate,
          validUntil: result.quote.validUntil,
          company,
          items: lines.map((l) => ({
            description: l.description,
            quantity: Number(l.quantity),
            unitPrice: Number(l.unitPrice),
            total: Number(l.quantity) * Number(l.unitPrice),
          })),
          discountPct: Number(discountPct),
          subTotal: totals.subTotal,
          discountAmount: totals.discountAmount,
          taxableBase: totals.taxableBase,
          tax: totals.tax,
          total: totals.total,
          notes: notes || null,
          terms: terms || null,
        });
      }
    }

    router.refresh();
  }

  async function handleDelete(id: string) {
    setDeletingId(null);
    const result = await deleteQuote(id);
    if (result.ok) router.refresh();
  }

  const input =
    'w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]';
  const label = 'block text-xs font-semibold text-[#444444] mb-1.5';

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Cotizaciones</h1>
          <p className="text-sm text-[#444444] mt-1">
            {quotes.length} {quotes.length === 1 ? 'cotización' : 'cotizaciones'}
          </p>
        </div>
        <button
          onClick={openNew}
          disabled={companies.length === 0}
          className="flex items-center gap-2 bg-[#D61C1C] hover:bg-[#b81818] disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded transition-colors"
          title={companies.length === 0 ? 'Primero registra una empresa' : undefined}
        >
          <LuPlus className="w-4 h-4" />
          Nueva cotización
        </button>
      </div>

      {companies.length === 0 && (
        <div className="mb-4 text-sm text-[#444444] bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          Necesitas al menos una empresa activa para crear cotizaciones. Ve a <strong>Empresas</strong> y registra una.
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
        {quotes.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-[#444444]">
            No hay cotizaciones todavía.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-[#E5E5E5]">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">N°</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Empresa</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444] hidden md:table-cell">Fecha</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Estado</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Total</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <React.Fragment key={q.id}>
                  <tr className="border-t border-[#E5E5E5] hover:bg-[#FAFAFA]">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-[#111111]">
                      COT-{String(q.number).padStart(4, '0')}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#111111]">{q.company.name}</td>
                    <td className="px-4 py-3 text-[#444444] hidden md:table-cell">
                      {new Date(q.issueDate).toLocaleDateString('es-CO')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[q.status] ?? 'bg-gray-100 text-[#444444]'}`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-[#111111]">{currencyFormat(q.total)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleDownloadExisting(q)}
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-red-50 text-[#444444] hover:text-[#D61C1C] transition-colors"
                          title="Descargar PDF"
                        >
                          <LuDownload className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEdit(q)}
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444] hover:text-[#111111] transition-colors"
                          title="Editar"
                        >
                          <LuPencil className="w-4 h-4" />
                        </button>
                        {deletingId === q.id ? (
                          <span className="flex items-center gap-1 text-xs text-[#444444]">
                            <button onClick={() => handleDelete(q.id)} className="text-[#D61C1C] font-medium hover:underline">Eliminar</button>
                            <span>/</span>
                            <button onClick={() => setDeletingId(null)} className="hover:underline">Cancelar</button>
                          </span>
                        ) : (
                          <button
                            onClick={() => setDeletingId(q.id)}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444] hover:text-[#D61C1C] transition-colors"
                            title="Eliminar"
                          >
                            <LuTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Editor modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 py-6 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-4xl shadow-xl my-auto">
            {/* header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] sticky top-0 bg-white z-10 rounded-t-lg">
              <h2 className="font-semibold text-[#111111] flex items-center gap-2">
                <LuFileText className="w-4 h-4 text-[#D61C1C]" />
                {editId ? 'Editar cotización' : 'Nueva cotización'}
              </h2>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444]">
                <LuX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              {/* Cabecera */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className={label}>Empresa / cliente *</label>
                  <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} className={input} required>
                    <option value="">Selecciona una empresa…</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}{c.nit ? ` — ${c.nit}` : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label}>Válida hasta</label>
                  <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className={input} />
                </div>
                <div>
                  <label className={label}>Estado</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${input} capitalize`}>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Líneas */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={label + ' mb-0'}>Productos / ítems</label>
                  <button type="button" onClick={addLine} className="flex items-center gap-1 text-xs font-medium text-[#D61C1C] hover:underline">
                    <LuPlus className="w-3.5 h-3.5" /> Agregar línea
                  </button>
                </div>

                <div className="border border-[#E5E5E5] rounded-lg overflow-hidden">
                  {/* head */}
                  <div className="hidden md:grid grid-cols-[1.4fr_2.2fr_0.7fr_1fr_1fr_auto] gap-2 px-3 py-2 bg-[#F8F9FA] text-[10px] font-semibold uppercase tracking-wider text-[#444444]">
                    <span>Producto</span>
                    <span>Descripción</span>
                    <span className="text-center">Cant.</span>
                    <span className="text-right">Precio unit.</span>
                    <span className="text-right">Total</span>
                    <span />
                  </div>

                  {lines.length === 0 && (
                    <div className="px-3 py-6 text-center text-xs text-[#888]">
                      Sin líneas. Agrega productos registrados o ítems libres.
                    </div>
                  )}

                  {lines.map((l) => (
                    <div key={l.key} className="grid grid-cols-2 md:grid-cols-[1.4fr_2.2fr_0.7fr_1fr_1fr_auto] gap-2 px-3 py-2 border-t border-[#E5E5E5] items-center">
                      <select
                        value={l.productId}
                        onChange={(e) => onPickProduct(l.key, e.target.value)}
                        className="border border-[#E5E5E5] rounded px-2 py-1.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                      >
                        <option value="">Ítem libre</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                      <input
                        value={l.description}
                        onChange={(e) => updateLine(l.key, { description: e.target.value })}
                        className="border border-[#E5E5E5] rounded px-2 py-1.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                        placeholder="Descripción del ítem"
                        required
                      />
                      <input
                        type="number"
                        min={0}
                        step="any"
                        value={l.quantity}
                        onChange={(e) => updateLine(l.key, { quantity: Number(e.target.value) })}
                        className="border border-[#E5E5E5] rounded px-2 py-1.5 text-xs text-[#111111] text-center focus:outline-none focus:border-[#111111]"
                      />
                      <input
                        type="number"
                        min={0}
                        step="any"
                        value={l.unitPrice}
                        onChange={(e) => updateLine(l.key, { unitPrice: Number(e.target.value) })}
                        className="border border-[#E5E5E5] rounded px-2 py-1.5 text-xs text-[#111111] text-right focus:outline-none focus:border-[#111111]"
                      />
                      <span className="text-xs text-[#111111] text-right font-medium">
                        {currencyFormat(l.quantity * l.unitPrice)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeLine(l.key)}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 text-[#888] hover:text-[#D61C1C] justify-self-end"
                        title="Quitar"
                      >
                        <LuTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notas + Totales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div>
                    <label className={label}>Observaciones</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={`${input} resize-none`} placeholder="Notas para el cliente" />
                  </div>
                  <div>
                    <label className={label}>Términos y condiciones</label>
                    <textarea value={terms} onChange={(e) => setTerms(e.target.value)} rows={2} className={`${input} resize-none`} placeholder="Validez, forma de pago, etc." />
                  </div>
                </div>

                <div className="bg-[#F8F9FA] rounded-lg p-4 space-y-2.5 h-fit">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#444444]">Subtotal</span>
                    <span className="text-[#111111]">{currencyFormat(totals.subTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#444444]">Descuento</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step="any"
                        value={discountPct}
                        onChange={(e) => setDiscountPct(Number(e.target.value))}
                        className="w-16 border border-[#E5E5E5] rounded px-2 py-1 text-xs text-right focus:outline-none focus:border-[#111111]"
                      />
                      <span className="text-[#444444] text-xs">%</span>
                    </div>
                  </div>
                  {discountPct > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#444444]">Descuento aplicado</span>
                      <span className="text-[#D61C1C]">- {currencyFormat(totals.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-[#444444]">Base gravable</span>
                    <span className="text-[#111111]">{currencyFormat(totals.taxableBase)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#444444]">IVA (19%)</span>
                    <span className="text-[#111111]">{currencyFormat(totals.tax)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#111111] pt-2 border-t border-[#E5E5E5]">
                    <span>Total</span>
                    <span>{currencyFormat(totals.total)}</span>
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-[#D61C1C]">{error}</p>}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 border border-[#E5E5E5] rounded px-4 py-2.5 text-sm font-medium text-[#444444] hover:bg-[#F8F9FA] transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="flex-1 bg-[#D61C1C] hover:bg-[#b81818] disabled:opacity-60 text-white rounded px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  {loading ? 'Guardando…' : editId ? 'Guardar cambios' : 'Crear y descargar PDF'}
                  {!loading && !editId && <LuDownload className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
