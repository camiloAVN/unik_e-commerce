import { readFileSync } from 'fs';
import path from 'path';
import { renderToBuffer } from '@react-pdf/renderer';
import prisma from '@/lib/prisma';
import { getSettings } from '@/actions/settings/get-settings';
import { QuoteDocument, type QuotePdfData } from '@/components/quotes/QuotePDF';

// El logo se incrusta como data URL para evitar el fetch de red en Node.
let cachedLogo: string | null = null;
function getLogoDataUrl(): string {
  if (cachedLogo) return cachedLogo;
  const buf = readFileSync(path.join(process.cwd(), 'public', 'imgs', 'logo.png'));
  cachedLogo = `data:image/png;base64,${buf.toString('base64')}`;
  return cachedLogo;
}

/**
 * Renderiza el PDF de una cotización del sistema a un Buffer, listo para adjuntarlo a un correo.
 * Devuelve null si la cotización no existe.
 */
export async function renderQuotePdfBuffer(
  quoteId: string,
): Promise<{ filename: string; content: Buffer } | null> {
  const [quote, settings] = await Promise.all([
    prisma.quote.findUnique({
      where: { id: quoteId },
      include: { company: true, items: { orderBy: { sortOrder: 'asc' } } },
    }),
    getSettings(),
  ]);

  if (!quote) return null;

  const data: QuotePdfData = {
    number: quote.number,
    status: quote.status,
    issueDate: quote.issueDate,
    validUntil: quote.validUntil,
    company: {
      name: quote.company.name,
      nit: quote.company.nit,
      email: quote.company.email,
      phone: quote.company.phone,
      contactName: quote.company.contactName,
      address: quote.company.address,
      city: quote.company.city,
    },
    items: quote.items.map((it) => ({
      description: it.description,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      total: it.total,
    })),
    discountPct: quote.discountPct,
    subTotal: quote.subTotal,
    discountAmount: quote.discountAmount,
    taxableBase: quote.taxableBase,
    tax: quote.tax,
    total: quote.total,
    notes: quote.notes,
    terms: quote.terms,
    logoUrl: getLogoDataUrl(),
    issuer: {
      name: settings.quoteIssuerName,
      nit: settings.quoteIssuerNit,
      email: settings.quoteIssuerEmail,
      phone: settings.quoteIssuerPhone,
      address: settings.quoteIssuerAddress,
      website: settings.quoteIssuerWebsite,
    },
    style: {
      fontFamily: settings.quoteFontFamily,
      fontSize: settings.quoteFontSize,
      headerColor: settings.quoteHeaderColor,
    },
  };

  const content = await renderToBuffer(<QuoteDocument data={data} />);
  return { filename: `COT-${String(quote.number).padStart(4, '0')}.pdf`, content };
}
