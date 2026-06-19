'use client';

import { useState } from 'react';
import { updateSettings } from '@/actions';
import { LuCircleCheck, LuFileText, LuMail, LuSave, LuType } from 'react-icons/lu';
import { HeroImagesManager, type HeroImageItem } from './HeroImagesManager';

interface Settings {
  adminEmail: string;
  quoteIssuerName: string;
  quoteIssuerNit: string;
  quoteIssuerEmail: string;
  quoteIssuerPhone: string;
  quoteIssuerAddress: string;
  quoteIssuerWebsite: string;
  quoteFontFamily: string;
  quoteFontSize: number;
  quoteHeaderColor: string;
}

interface Props {
  settings: Settings;
  heroImages: HeroImageItem[];
}

const FONT_OPTIONS = [
  { value: 'Helvetica', label: 'Helvetica (sans-serif)' },
  { value: 'Times-Roman', label: 'Times (serif)' },
  { value: 'Courier', label: 'Courier (monoespaciada)' },
];

const inputCls =
  'w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]';
const labelCls = 'block text-xs font-semibold text-[#444444] mb-1.5';

export function SettingsClient({ settings, heroImages }: Props) {
  // ── Sección notificaciones ──
  const [email, setEmail] = useState(settings.adminEmail);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [savedEmail, setSavedEmail] = useState(false);
  const [errorEmail, setErrorEmail] = useState('');

  // ── Sección cotizaciones ──
  const [quote, setQuote] = useState({
    quoteIssuerName: settings.quoteIssuerName,
    quoteIssuerNit: settings.quoteIssuerNit,
    quoteIssuerEmail: settings.quoteIssuerEmail,
    quoteIssuerPhone: settings.quoteIssuerPhone,
    quoteIssuerAddress: settings.quoteIssuerAddress,
    quoteIssuerWebsite: settings.quoteIssuerWebsite,
    quoteFontFamily: settings.quoteFontFamily,
    quoteFontSize: settings.quoteFontSize,
    quoteHeaderColor: settings.quoteHeaderColor,
  });
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [savedQuote, setSavedQuote] = useState(false);
  const [errorQuote, setErrorQuote] = useState('');

  function setQ<K extends keyof typeof quote>(key: K, value: (typeof quote)[K]) {
    setQuote((q) => ({ ...q, [key]: value }));
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoadingEmail(true);
    setErrorEmail('');
    setSavedEmail(false);
    const res = await updateSettings({ adminEmail: email.trim() });
    setLoadingEmail(false);
    if (!res.ok) {
      setErrorEmail(res.message ?? 'No se pudo guardar la configuración.');
      return;
    }
    setSavedEmail(true);
    setTimeout(() => setSavedEmail(false), 3000);
  }

  async function handleQuoteSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoadingQuote(true);
    setErrorQuote('');
    setSavedQuote(false);
    const res = await updateSettings({
      ...quote,
      quoteFontSize: Number(quote.quoteFontSize),
    });
    setLoadingQuote(false);
    if (!res.ok) {
      setErrorQuote(res.message ?? 'No se pudo guardar la configuración.');
      return;
    }
    setSavedQuote(true);
    setTimeout(() => setSavedQuote(false), 3000);
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111111]">Configuración</h1>
        <p className="text-sm text-[#444444] mt-1">Ajustes generales del panel administrativo</p>
      </div>

      {/* Section: Notifications */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <LuMail className="w-4 h-4 text-[#444444]" />
            <h2 className="font-semibold text-[#111111]">Notificaciones por correo</h2>
          </div>
          <p className="text-sm text-[#444444] mt-1">
            Configura el correo que recibirá alertas de nuevas órdenes de compra.
          </p>
        </div>

        <form onSubmit={handleEmailSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className={labelCls}>Correo de notificaciones de órdenes</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              placeholder="admin@tutienda.com"
            />
            <p className="text-xs text-[#444444] mt-1.5">
              Cada vez que un cliente complete una compra, este correo recibirá todos los datos del
              pedido y la dirección de envío para iniciar la logística.
            </p>
          </div>

          {errorEmail && <p className="text-sm text-[#D61C1C]">{errorEmail}</p>}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={loadingEmail}
              className="flex items-center gap-2 bg-[#D61C1C] hover:bg-[#b81818] disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded transition-colors"
            >
              <LuSave className="w-4 h-4" />
              {loadingEmail ? 'Guardando…' : 'Guardar cambios'}
            </button>
            {savedEmail && (
              <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                <LuCircleCheck className="w-4 h-4" />
                Cambios guardados
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Section: Cotizaciones */}
      <div className="mt-4 bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <LuFileText className="w-4 h-4 text-[#444444]" />
            <h2 className="font-semibold text-[#111111]">Cotizaciones</h2>
          </div>
          <p className="text-sm text-[#444444] mt-1">
            Datos del emisor y apariencia del PDF que se genera al cotizar.
          </p>
        </div>

        <form onSubmit={handleQuoteSubmit} className="px-6 py-5 space-y-5">
          {/* Datos del emisor */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#888] mb-3">
              Datos del emisor
            </h3>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Razón social / nombre *</label>
                <input
                  value={quote.quoteIssuerName}
                  onChange={(e) => setQ('quoteIssuerName', e.target.value)}
                  className={inputCls}
                  placeholder="UNIK S.A.S."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>NIT</label>
                  <input
                    value={quote.quoteIssuerNit}
                    onChange={(e) => setQ('quoteIssuerNit', e.target.value)}
                    className={inputCls}
                    placeholder="900.000.000-0"
                  />
                </div>
                <div>
                  <label className={labelCls}>Teléfono</label>
                  <input
                    value={quote.quoteIssuerPhone}
                    onChange={(e) => setQ('quoteIssuerPhone', e.target.value)}
                    className={inputCls}
                    placeholder="+57 300 000 0000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Correo</label>
                  <input
                    type="email"
                    value={quote.quoteIssuerEmail}
                    onChange={(e) => setQ('quoteIssuerEmail', e.target.value)}
                    className={inputCls}
                    placeholder="contacto@unik.com"
                  />
                </div>
                <div>
                  <label className={labelCls}>Sitio web</label>
                  <input
                    value={quote.quoteIssuerWebsite}
                    onChange={(e) => setQ('quoteIssuerWebsite', e.target.value)}
                    className={inputCls}
                    placeholder="www.unik.com"
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Dirección</label>
                <input
                  value={quote.quoteIssuerAddress}
                  onChange={(e) => setQ('quoteIssuerAddress', e.target.value)}
                  className={inputCls}
                  placeholder="Calle 00 # 00-00, Ciudad"
                />
              </div>
            </div>
          </div>

          {/* Apariencia */}
          <div className="pt-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#888] mb-3 flex items-center gap-1.5">
              <LuType className="w-3.5 h-3.5" /> Apariencia del PDF
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Tipo de letra</label>
                <select
                  value={quote.quoteFontFamily}
                  onChange={(e) => setQ('quoteFontFamily', e.target.value)}
                  className={inputCls}
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Tamaño base</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={6}
                    max={16}
                    value={quote.quoteFontSize}
                    onChange={(e) => setQ('quoteFontSize', Number(e.target.value))}
                    className={inputCls}
                  />
                  <span className="text-xs text-[#888]">pt</span>
                </div>
              </div>
              <div>
                <label className={labelCls}>Color de encabezado</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={quote.quoteHeaderColor}
                    onChange={(e) => setQ('quoteHeaderColor', e.target.value)}
                    className="h-9 w-12 border border-[#E5E5E5] rounded cursor-pointer p-0.5"
                  />
                  <input
                    value={quote.quoteHeaderColor}
                    onChange={(e) => setQ('quoteHeaderColor', e.target.value)}
                    className={`${inputCls} font-mono uppercase`}
                    placeholder="#D61C1C"
                  />
                </div>
              </div>
            </div>

            {/* Mini vista previa */}
            <div className="mt-4 border border-[#E5E5E5] rounded-lg p-4 bg-[#FAFAFA]">
              <p className="text-[10px] uppercase tracking-wider text-[#888] mb-2">Vista previa</p>
              <div
                style={{
                  fontFamily:
                    quote.quoteFontFamily === 'Times-Roman'
                      ? 'Georgia, serif'
                      : quote.quoteFontFamily === 'Courier'
                      ? 'monospace'
                      : 'Arial, sans-serif',
                  fontSize: `${quote.quoteFontSize + 2}px`,
                }}
              >
                <span style={{ color: quote.quoteHeaderColor, fontWeight: 700, letterSpacing: 1 }}>
                  COTIZACIÓN
                </span>
                <div style={{ height: 3, background: quote.quoteHeaderColor, margin: '6px 0', borderRadius: 2 }} />
                <span style={{ color: '#111' }}>{quote.quoteIssuerName || 'Nombre del emisor'}</span>
              </div>
            </div>
          </div>

          {errorQuote && <p className="text-sm text-[#D61C1C]">{errorQuote}</p>}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={loadingQuote}
              className="flex items-center gap-2 bg-[#D61C1C] hover:bg-[#b81818] disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded transition-colors"
            >
              <LuSave className="w-4 h-4" />
              {loadingQuote ? 'Guardando…' : 'Guardar cotizaciones'}
            </button>
            {savedQuote && (
              <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                <LuCircleCheck className="w-4 h-4" />
                Cambios guardados
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Section: Hero / Portada */}
      <HeroImagesManager images={heroImages} />

      {/* Section: Resend status */}
      <div className="mt-4 bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E5E5]">
          <h2 className="font-semibold text-[#111111]">Estado del servicio de correo</h2>
        </div>
        <div className="px-6 py-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#444444]">Proveedor</span>
            <span className="font-medium text-[#111111]">Resend</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#444444]">
              Variable <code className="text-xs bg-[#F8F9FA] px-1 py-0.5 rounded">RESEND_API_KEY</code>
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                process.env.NEXT_PUBLIC_RESEND_CONFIGURED === 'true'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {process.env.NEXT_PUBLIC_RESEND_CONFIGURED === 'true' ? 'Configurado' : 'Pendiente'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#444444]">
              Variable <code className="text-xs bg-[#F8F9FA] px-1 py-0.5 rounded">RESEND_FROM_EMAIL</code>
            </span>
            <span className="text-[#444444] font-mono text-xs">
              {process.env.NEXT_PUBLIC_RESEND_FROM_DISPLAY ?? 'noreply@unik.co (por defecto)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
