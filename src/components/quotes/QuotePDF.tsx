import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';

const DARK = '#111111';
const GRAY = '#666666';
const LIGHT = '#E5E5E5';
const SOFT = '#F8F9FA';

export interface QuoteIssuer {
  name: string;
  nit?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
}

export interface QuotePdfStyle {
  fontFamily: string; // Helvetica | Times-Roman | Courier
  fontSize: number; // tamaño base
  headerColor: string; // hex
}

export interface QuotePdfData {
  number: number;
  status: string;
  issueDate: string | Date;
  validUntil?: string | Date | null;
  company: {
    name: string;
    nit?: string | null;
    email?: string | null;
    phone?: string | null;
    contactName?: string | null;
    address?: string | null;
    city?: string | null;
  };
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
  discountPct: number;
  subTotal: number;
  discountAmount: number;
  taxableBase: number;
  tax: number;
  total: number;
  notes?: string | null;
  terms?: string | null;
  logoUrl: string;
  issuer: QuoteIssuer;
  style: QuotePdfStyle;
}

const cop = (v: number) =>
  '$ ' + new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(Math.round(v));

const fmtDate = (d: string | Date) =>
  new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'long', year: 'numeric' }).format(
    new Date(d),
  );

// Variante bold para las fuentes integradas de react-pdf.
const BOLD_OF: Record<string, string> = {
  Helvetica: 'Helvetica-Bold',
  'Times-Roman': 'Times-Bold',
  Courier: 'Courier-Bold',
};

function makeStyles(cfg: QuotePdfStyle) {
  const base = Math.min(16, Math.max(6, cfg.fontSize || 9));
  const family = BOLD_OF[cfg.fontFamily] ? cfg.fontFamily : 'Helvetica';
  const bold = BOLD_OF[family];
  const header = /^#[0-9a-fA-F]{6}$/.test(cfg.headerColor) ? cfg.headerColor : '#D61C1C';

  return StyleSheet.create({
    page: {
      paddingTop: 36,
      paddingBottom: 64,
      paddingHorizontal: 40,
      fontSize: base,
      color: DARK,
      fontFamily: family,
    },

    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    logo: { width: 130, height: 44, objectFit: 'contain' },
    headerRight: { alignItems: 'flex-end' },
    docTitle: { fontSize: base * 2.2, fontFamily: bold, color: header, letterSpacing: 1 },
    docNumber: { fontSize: base + 2, fontFamily: bold, color: DARK, marginTop: 2 },
    docMeta: { fontSize: base - 1, color: GRAY, marginTop: 4 },
    statusPill: {
      marginTop: 6,
      fontSize: base - 2,
      color: header,
      backgroundColor: '#F3F4F6',
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: 3,
      textTransform: 'uppercase',
      fontFamily: bold,
      letterSpacing: 1,
    },

    brandRule: { height: 3, backgroundColor: header, marginTop: 14, marginBottom: 18, borderRadius: 2 },

    parties: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 },
    party: { width: '47%' },
    partyLabel: {
      fontSize: base - 2,
      color: GRAY,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 4,
      fontFamily: bold,
    },
    partyName: { fontSize: base + 2, fontFamily: bold, color: DARK, marginBottom: 2 },
    partyLine: { fontSize: base - 0.5, color: GRAY, marginBottom: 1.5 },

    table: { borderWidth: 1, borderColor: LIGHT, borderRadius: 4 },
    thead: { flexDirection: 'row', backgroundColor: header },
    th: { color: '#FFFFFF', fontSize: base - 1, fontFamily: bold, paddingVertical: 7, paddingHorizontal: 8 },
    row: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: LIGHT },
    rowAlt: { backgroundColor: SOFT },
    td: { fontSize: base - 0.5, paddingVertical: 6, paddingHorizontal: 8, color: DARK },

    colDesc: { width: '46%' },
    colQty: { width: '12%', textAlign: 'center' },
    colPrice: { width: '21%', textAlign: 'right' },
    colTotal: { width: '21%', textAlign: 'right' },

    bottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
    notesBox: { width: '52%' },
    notesLabel: {
      fontSize: base - 2,
      color: GRAY,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 3,
      fontFamily: bold,
    },
    notesText: { fontSize: base - 1, color: GRAY, lineHeight: 1.4, marginBottom: 8 },

    totals: { width: '42%' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
    totalLabel: { fontSize: base, color: GRAY },
    totalValue: { fontSize: base, color: DARK, fontFamily: bold },
    grandRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 6,
      paddingTop: 8,
      paddingBottom: 8,
      paddingHorizontal: 10,
      backgroundColor: DARK,
      borderRadius: 4,
    },
    grandLabel: { fontSize: base + 1, color: '#FFFFFF', fontFamily: bold },
    grandValue: { fontSize: base + 3, color: '#FFFFFF', fontFamily: bold },

    footer: {
      position: 'absolute',
      bottom: 28,
      left: 40,
      right: 40,
      borderTopWidth: 1,
      borderTopColor: LIGHT,
      paddingTop: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    footerText: { fontSize: base - 1.5, color: GRAY },
  });
}

export const QuoteDocument = ({ data }: { data: QuotePdfData }) => {
  const styles = makeStyles(data.style);
  const issuer = data.issuer;

  return (
    <Document
      title={`Cotización COT-${String(data.number).padStart(4, '0')}`}
      author={issuer.name}
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={data.logoUrl} style={styles.logo} />
          <View style={styles.headerRight}>
            <Text style={styles.docTitle}>COTIZACIÓN</Text>
            <Text style={styles.docNumber}>N° COT-{String(data.number).padStart(4, '0')}</Text>
            <Text style={styles.docMeta}>Fecha: {fmtDate(data.issueDate)}</Text>
            {data.validUntil && (
              <Text style={styles.docMeta}>Válida hasta: {fmtDate(data.validUntil)}</Text>
            )}
            <Text style={styles.statusPill}>{data.status}</Text>
          </View>
        </View>

        <View style={styles.brandRule} />

        {/* Parties */}
        <View style={styles.parties}>
          <View style={styles.party}>
            <Text style={styles.partyLabel}>De</Text>
            <Text style={styles.partyName}>{issuer.name}</Text>
            {issuer.nit ? <Text style={styles.partyLine}>NIT: {issuer.nit}</Text> : null}
            {issuer.address ? <Text style={styles.partyLine}>{issuer.address}</Text> : null}
            {issuer.phone ? <Text style={styles.partyLine}>{issuer.phone}</Text> : null}
            {issuer.email ? <Text style={styles.partyLine}>{issuer.email}</Text> : null}
            {issuer.website ? <Text style={styles.partyLine}>{issuer.website}</Text> : null}
          </View>
          <View style={styles.party}>
            <Text style={styles.partyLabel}>Para</Text>
            <Text style={styles.partyName}>{data.company.name}</Text>
            {data.company.nit && <Text style={styles.partyLine}>NIT: {data.company.nit}</Text>}
            {data.company.contactName && (
              <Text style={styles.partyLine}>Contacto: {data.company.contactName}</Text>
            )}
            {(data.company.address || data.company.city) && (
              <Text style={styles.partyLine}>
                {[data.company.address, data.company.city].filter(Boolean).join(', ')}
              </Text>
            )}
            {data.company.phone && <Text style={styles.partyLine}>{data.company.phone}</Text>}
            {data.company.email && <Text style={styles.partyLine}>{data.company.email}</Text>}
          </View>
        </View>

        {/* Items */}
        <View style={styles.table}>
          <View style={styles.thead}>
            <Text style={[styles.th, styles.colDesc]}>Descripción</Text>
            <Text style={[styles.th, styles.colQty]}>Cant.</Text>
            <Text style={[styles.th, styles.colPrice]}>Precio unit.</Text>
            <Text style={[styles.th, styles.colTotal]}>Total</Text>
          </View>
          {data.items.map((it, i) => (
            <View key={i} style={[styles.row, ...(i % 2 === 1 ? [styles.rowAlt] : [])]} wrap={false}>
              <Text style={[styles.td, styles.colDesc]}>{it.description}</Text>
              <Text style={[styles.td, styles.colQty]}>{it.quantity}</Text>
              <Text style={[styles.td, styles.colPrice]}>{cop(it.unitPrice)}</Text>
              <Text style={[styles.td, styles.colTotal]}>{cop(it.total)}</Text>
            </View>
          ))}
        </View>

        {/* Notes + Totals */}
        <View style={styles.bottom}>
          <View style={styles.notesBox}>
            {data.notes ? (
              <>
                <Text style={styles.notesLabel}>Observaciones</Text>
                <Text style={styles.notesText}>{data.notes}</Text>
              </>
            ) : null}
            {data.terms ? (
              <>
                <Text style={styles.notesLabel}>Términos y condiciones</Text>
                <Text style={styles.notesText}>{data.terms}</Text>
              </>
            ) : null}
          </View>

          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{cop(data.subTotal)}</Text>
            </View>
            {data.discountPct > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Descuento ({data.discountPct}%)</Text>
                <Text style={styles.totalValue}>- {cop(data.discountAmount)}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Base gravable</Text>
              <Text style={styles.totalValue}>{cop(data.taxableBase)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IVA (19%)</Text>
              <Text style={styles.totalValue}>{cop(data.tax)}</Text>
            </View>
            <View style={styles.grandRow}>
              <Text style={styles.grandLabel}>TOTAL</Text>
              <Text style={styles.grandValue}>{cop(data.total)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {issuer.name}
            {issuer.nit ? ` · NIT ${issuer.nit}` : ''}
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
};

/**
 * Genera el PDF y dispara la descarga en el navegador.
 * Se llama dinámicamente desde el cliente para no cargar @react-pdf en el bundle del servidor.
 */
export async function downloadQuotePdf(data: QuotePdfData) {
  const blob = await pdf(<QuoteDocument data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `COT-${String(data.number).padStart(4, '0')}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
