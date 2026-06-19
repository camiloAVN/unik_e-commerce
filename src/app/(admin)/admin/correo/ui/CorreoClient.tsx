'use client';

import { useRef, useState } from 'react';
import { sendCustomEmail, deleteEmailAttachment } from '@/actions';
import { uploadEmailAttachment, type EmailAttachment, currencyFormat } from '@/utils';
import {
  LuCircleCheck,
  LuFileText,
  LuMail,
  LuPaperclip,
  LuSend,
  LuTrash2,
} from 'react-icons/lu';

type QuoteOption = { id: string; number: number; companyName: string; total: number };

const inputCls =
  'w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]';
const labelCls = 'block text-xs font-semibold text-[#444444] mb-1.5';

function prettySize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CorreoClient({ quotes }: { quotes: QuoteOption[] }) {
  const fileInput = useRef<HTMLInputElement>(null);

  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState<EmailAttachment[]>([]);
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);

  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (fileInput.current) fileInput.current.value = '';
    if (!files.length) return;

    setUploading(true);
    setError('');
    try {
      for (const file of files) {
        const att = await uploadEmailAttachment(file);
        setAttachments((prev) => [...prev, att]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir el adjunto');
    } finally {
      setUploading(false);
    }
  }

  async function removeAttachment(key: string) {
    setAttachments((prev) => prev.filter((a) => a.key !== key));
    // Borra el temporal de R2 para no dejar huérfanos.
    await deleteEmailAttachment(key);
  }

  function toggleQuote(id: string) {
    setSelectedQuotes((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id],
    );
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError('');
    setSent(false);

    const res = await sendCustomEmail({
      to,
      subject,
      body,
      attachments: attachments.map((a) => ({ key: a.key, filename: a.filename })),
      quoteIds: selectedQuotes,
    });

    setSending(false);

    if (!res.ok) {
      setError(res.message ?? 'No se pudo enviar el correo');
      return;
    }

    // Reset (los temporales ya los borró el servidor tras enviar).
    setTo('');
    setSubject('');
    setBody('');
    setAttachments([]);
    setSelectedQuotes([]);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

  const busy = sending || uploading;

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111111]">Correo</h1>
        <p className="text-sm text-[#444444] mt-1">
          Envía correos personalizados a tus clientes con adjuntos y cotizaciones.
        </p>
      </div>

      <form
        onSubmit={handleSend}
        className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center gap-2">
          <LuMail className="w-4 h-4 text-[#D61C1C]" />
          <h2 className="font-semibold text-[#111111]">Nuevo mensaje</h2>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Destinatario + asunto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Para *</label>
              <input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className={inputCls}
                placeholder="cliente@correo.com"
                required
              />
            </div>
            <div>
              <label className={labelCls}>Asunto *</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={inputCls}
                placeholder="Asunto del correo"
                required
              />
            </div>
          </div>

          {/* Cuerpo */}
          <div>
            <label className={labelCls}>Mensaje *</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={9}
              className={`${inputCls} resize-y`}
              placeholder={'Hola,\n\nEscribe aquí tu mensaje…'}
              required
            />
            <p className="text-xs text-[#888] mt-1.5">
              Se respetan los saltos de línea. El mensaje se enviará con el logo y los colores de la empresa.
            </p>
          </div>

          {/* Adjuntos propios */}
          <div>
            <label className={labelCls}>Adjuntos (PDF o imágenes)</label>
            <input
              ref={fileInput}
              type="file"
              accept=".pdf,image/*"
              multiple
              onChange={handleFiles}
              className="hidden"
              id="email-attachments"
            />
            <label
              htmlFor="email-attachments"
              className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded cursor-pointer border border-[#E5E5E5] transition-colors ${
                uploading ? 'text-[#888] cursor-wait' : 'text-[#444444] hover:bg-[#F8F9FA]'
              }`}
            >
              <LuPaperclip className="w-4 h-4" />
              {uploading ? 'Subiendo…' : 'Adjuntar archivo'}
            </label>

            {attachments.length > 0 && (
              <ul className="mt-3 space-y-2">
                {attachments.map((a) => (
                  <li
                    key={a.key}
                    className="flex items-center justify-between bg-[#F8F9FA] border border-[#E5E5E5] rounded px-3 py-2"
                  >
                    <span className="flex items-center gap-2 text-sm text-[#111111] truncate">
                      <LuPaperclip className="w-3.5 h-3.5 text-[#888] flex-shrink-0" />
                      <span className="truncate">{a.filename}</span>
                      <span className="text-xs text-[#888] flex-shrink-0">({prettySize(a.size)})</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(a.key)}
                      className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 text-[#888] hover:text-[#D61C1C] flex-shrink-0"
                      title="Quitar"
                    >
                      <LuTrash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Cotizaciones del sistema */}
          <div>
            <label className={labelCls}>Adjuntar cotizaciones del sistema</label>
            {quotes.length === 0 ? (
              <p className="text-sm text-[#888]">No hay cotizaciones creadas todavía.</p>
            ) : (
              <div className="border border-[#E5E5E5] rounded-lg max-h-52 overflow-y-auto divide-y divide-[#F0F0F0]">
                {quotes.map((q) => {
                  const checked = selectedQuotes.includes(q.id);
                  return (
                    <label
                      key={q.id}
                      className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-[#FAFAFA]"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleQuote(q.id)}
                        className="accent-[#D61C1C] w-4 h-4"
                      />
                      <LuFileText className="w-4 h-4 text-[#888]" />
                      <span className="font-mono text-xs text-[#111111]">
                        COT-{String(q.number).padStart(4, '0')}
                      </span>
                      <span className="text-sm text-[#444444] flex-1 truncate">{q.companyName}</span>
                      <span className="text-sm font-medium text-[#111111]">
                        {currencyFormat(q.total)}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-[#D61C1C]">{error}</p>}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={busy}
              className="flex items-center gap-2 bg-[#D61C1C] hover:bg-[#b81818] disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded transition-colors"
            >
              <LuSend className="w-4 h-4" />
              {sending ? 'Enviando…' : 'Enviar correo'}
            </button>
            {sent && (
              <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                <LuCircleCheck className="w-4 h-4" />
                Correo enviado
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
