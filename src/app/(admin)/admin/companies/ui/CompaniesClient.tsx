'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUpdateCompany, deleteCompany } from '@/actions';
import {
  LuBuilding2,
  LuMail,
  LuPencil,
  LuPhone,
  LuPlus,
  LuTrash2,
  LuX,
} from 'react-icons/lu';

type Company = {
  id: string;
  name: string;
  nit: string | null;
  email: string | null;
  phone: string | null;
  contactName: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
  isActive: boolean;
  _count: { quotes: number };
};

const EMPTY_FORM = {
  id: '',
  name: '',
  nit: '',
  email: '',
  phone: '',
  contactName: '',
  address: '',
  city: '',
  notes: '',
  isActive: true,
};

export function CompaniesClient({ companies }: { companies: Company[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<Record<string, string>>({});

  function openNew() {
    setForm(EMPTY_FORM);
    setError('');
    setIsOpen(true);
  }

  function openEdit(c: Company) {
    setForm({
      id: c.id,
      name: c.name,
      nit: c.nit ?? '',
      email: c.email ?? '',
      phone: c.phone ?? '',
      contactName: c.contactName ?? '',
      address: c.address ?? '',
      city: c.city ?? '',
      notes: c.notes ?? '',
      isActive: c.isActive,
    });
    setError('');
    setIsOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await createUpdateCompany({
      ...(form.id ? { id: form.id } : {}),
      name: form.name,
      nit: form.nit,
      email: form.email,
      phone: form.phone,
      contactName: form.contactName,
      address: form.address,
      city: form.city,
      notes: form.notes,
      isActive: form.isActive,
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
    const result = await deleteCompany(id);
    if (!result.ok) {
      setDeleteError({ [id]: result.message ?? 'Error al eliminar' });
    } else {
      router.refresh();
    }
  }

  const input =
    'w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]';
  const label = 'block text-xs font-semibold text-[#444444] mb-1.5';

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Empresas</h1>
          <p className="text-sm text-[#444444] mt-1">
            {companies.length} {companies.length === 1 ? 'empresa registrada' : 'empresas registradas'}
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#D61C1C] hover:bg-[#b81818] text-white text-sm font-medium px-4 py-2.5 rounded transition-colors"
        >
          <LuPlus className="w-4 h-4" />
          Nueva empresa
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
        {companies.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-[#444444]">
            No hay empresas registradas. Crea la primera.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-[#E5E5E5]">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Empresa</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444] hidden md:table-cell">NIT</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444] hidden lg:table-cell">Contacto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444] hidden lg:table-cell">Ciudad</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Cotiz.</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <React.Fragment key={c.id}>
                  <tr className="border-t border-[#E5E5E5] hover:bg-[#FAFAFA]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded bg-red-50 flex items-center justify-center flex-shrink-0">
                          <LuBuilding2 className="w-4 h-4 text-[#D61C1C]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#111111] truncate">{c.name}</p>
                          {c.email && (
                            <p className="text-xs text-[#888] flex items-center gap-1 truncate">
                              <LuMail className="w-3 h-3" /> {c.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#444444] hidden md:table-cell">{c.nit || '—'}</td>
                    <td className="px-4 py-3 text-[#444444] hidden lg:table-cell">
                      {c.contactName || '—'}
                      {c.phone && (
                        <span className="block text-xs text-[#888] flex items-center gap-1">
                          <LuPhone className="w-3 h-3" /> {c.phone}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#444444] hidden lg:table-cell">{c.city || '—'}</td>
                    <td className="px-4 py-3 text-center text-[#444444]">{c._count.quotes}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${c.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-[#444444]'}`}>
                        {c.isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(c)}
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444] hover:text-[#111111] transition-colors"
                          title="Editar"
                        >
                          <LuPencil className="w-4 h-4" />
                        </button>
                        {deletingId === c.id ? (
                          <span className="flex items-center gap-1 text-xs text-[#444444]">
                            <button onClick={() => handleDelete(c.id)} className="text-[#D61C1C] font-medium hover:underline">Eliminar</button>
                            <span>/</span>
                            <button onClick={() => setDeletingId(null)} className="hover:underline">Cancelar</button>
                          </span>
                        ) : (
                          <button
                            onClick={() => { setDeletingId(c.id); setDeleteError({}); }}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444] hover:text-[#D61C1C] transition-colors"
                            title="Eliminar"
                          >
                            <LuTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {deleteError[c.id] && (
                    <tr className="bg-red-50">
                      <td colSpan={7} className="px-4 py-2 text-xs text-[#D61C1C]">{deleteError[c.id]}</td>
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
          <div className="bg-white rounded-lg w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] sticky top-0 bg-white z-10">
              <h2 className="font-semibold text-[#111111]">
                {form.id ? 'Editar empresa' : 'Nueva empresa'}
              </h2>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444]">
                <LuX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className={label}>Nombre / Razón social *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={input}
                  placeholder="Ej. Distribuciones ACME S.A.S."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={label}>NIT</label>
                  <input value={form.nit} onChange={(e) => setForm((f) => ({ ...f, nit: e.target.value }))} className={input} placeholder="900.123.456-7" />
                </div>
                <div>
                  <label className={label}>Ciudad</label>
                  <input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className={input} placeholder="Bogotá" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={label}>Correo</label>
                  <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={input} placeholder="contacto@empresa.com" />
                </div>
                <div>
                  <label className={label}>Teléfono</label>
                  <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={input} placeholder="+57 300 000 0000" />
                </div>
              </div>

              <div>
                <label className={label}>Persona de contacto</label>
                <input value={form.contactName} onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))} className={input} placeholder="Nombre del contacto" />
              </div>

              <div>
                <label className={label}>Dirección</label>
                <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className={input} placeholder="Calle 00 # 00-00" />
              </div>

              <div>
                <label className={label}>Notas</label>
                <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} className={`${input} resize-none`} placeholder="Información adicional" />
              </div>

              <div>
                <label className={label}>Estado</label>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                  className={`w-full border rounded px-3 py-2 text-sm font-medium transition-colors ${form.isActive ? 'border-green-500 bg-green-50 text-green-700' : 'border-[#E5E5E5] bg-white text-[#444444]'}`}
                >
                  {form.isActive ? 'Activa' : 'Inactiva'}
                </button>
              </div>

              {error && <p className="text-sm text-[#D61C1C]">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 border border-[#E5E5E5] rounded px-4 py-2.5 text-sm font-medium text-[#444444] hover:bg-[#F8F9FA] transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="flex-1 bg-[#D61C1C] hover:bg-[#b81818] disabled:opacity-60 text-white rounded px-4 py-2.5 text-sm font-medium transition-colors">
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
