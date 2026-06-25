import {
  Column,
  Heading,
  Hr,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { OrderEmailData } from './types';
import { EmailLayout } from './components/EmailLayout';

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(n);

const shortId = (id: string) => id.slice(-8).toUpperCase();

interface Props extends OrderEmailData {
  appUrl: string;
}

export function OrderConfirmationEmail({
  orderId,
  orderDate,
  transactionId,
  address,
  items,
  subTotal,
  tax,
  total,
  appUrl,
}: Props) {
  return (
    <EmailLayout
      appUrl={appUrl}
      preview={`¡Compra confirmada! Orden #${shortId(orderId)} — ${fmt(total)}`}
    >
      <Section style={content}>
        <Heading style={h1}>¡Gracias por tu compra, {address.firstName}!</Heading>
        <Text style={para}>
          Hemos recibido tu pedido y está siendo procesado. A continuación
          encontrarás el resumen de tu compra.
        </Text>

        {/* Order meta */}
        <Section style={metaBox}>
          <Row>
            <Column>
              <Text style={metaLabel}>Orden</Text>
              <Text style={metaValue}>#{shortId(orderId)}</Text>
            </Column>
            <Column>
              <Text style={metaLabel}>Fecha</Text>
              <Text style={metaValue}>{orderDate}</Text>
            </Column>
            <Column>
              <Text style={metaLabel}>Estado</Text>
              <Text style={{ ...metaValue, color: '#16a34a' }}>Pagado ✓</Text>
            </Column>
          </Row>
        </Section>

        <Hr style={hr} />

        {/* Items */}
        <Text style={sectionTitle}>Productos ordenados</Text>

        {items.map((item, i) => (
          <Row key={i} style={itemRow}>
            <Column style={{ flex: 1 }}>
              <Text style={itemName}>{item.title}</Text>
            </Column>
            <Column style={itemQty}>
              <Text style={itemDetail}>×{item.quantity}</Text>
            </Column>
            <Column style={itemPrice}>
              <Text style={itemDetail}>{fmt(item.price * item.quantity)}</Text>
            </Column>
          </Row>
        ))}

        <Hr style={hr} />

        {/* Totals */}
        <Section style={totalsSection}>
          <Row style={totalRow}>
            <Column><Text style={totalLabel}>Subtotal</Text></Column>
            <Column><Text style={totalValue}>{fmt(subTotal)}</Text></Column>
          </Row>
          <Row style={totalRow}>
            <Column><Text style={totalLabel}>IVA</Text></Column>
            <Column><Text style={totalValue}>{fmt(tax)}</Text></Column>
          </Row>
          <Row style={{ ...totalRow, borderTop: '2px solid #D61C1C', paddingTop: '10px' }}>
            <Column><Text style={grandTotalLabel}>Total pagado</Text></Column>
            <Column><Text style={grandTotalValue}>{fmt(total)}</Text></Column>
          </Row>
        </Section>

        <Hr style={hr} />

        {/* Shipping address */}
        <Text style={sectionTitle}>Dirección de envío</Text>
        <Section style={addressBox}>
          <Text style={addressLine}>
            <strong>{address.firstName} {address.lastName}</strong>
          </Text>
          <Text style={addressLine}>{address.address}{address.address2 ? `, ${address.address2}` : ''}</Text>
          <Text style={addressLine}>{address.city}{address.postalCode ? ` (${address.postalCode})` : ''}</Text>
          <Text style={addressLine}>{address.country}</Text>
          <Text style={addressLine}>Tel: {address.phone}</Text>
        </Section>

        <Hr style={hr} />

        {/* Transaction */}
        <Text style={txText}>
          ID de transacción: <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{transactionId}</span>
        </Text>

        {/* Help */}
        <Text style={helpText}>
          ¿Tienes alguna pregunta? Puedes responder este correo y te
          ayudaremos con gusto.
        </Text>
      </Section>
    </EmailLayout>
  );
}

export default OrderConfirmationEmail;

// ── Styles ──────────────────────────────────────────────────────────────────

const content: React.CSSProperties = {
  padding: '32px 40px',
};

const h1: React.CSSProperties = {
  color: '#111111',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 12px',
};

const para: React.CSSProperties = {
  color: '#555555',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 24px',
};

const metaBox: React.CSSProperties = {
  backgroundColor: '#F8F9FA',
  borderRadius: '6px',
  padding: '16px 20px',
  marginBottom: '24px',
};

const metaLabel: React.CSSProperties = {
  color: '#888888',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  margin: '0 0 2px',
};

const metaValue: React.CSSProperties = {
  color: '#111111',
  fontSize: '14px',
  fontWeight: '600',
  margin: 0,
};

const hr: React.CSSProperties = {
  borderColor: '#E5E5E5',
  margin: '20px 0',
};

const sectionTitle: React.CSSProperties = {
  color: '#111111',
  fontSize: '13px',
  fontWeight: '700',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  margin: '0 0 12px',
};

const itemRow: React.CSSProperties = {
  borderBottom: '1px solid #F4F4F5',
  padding: '8px 0',
};

const itemName: React.CSSProperties = {
  color: '#111111',
  fontSize: '14px',
  margin: 0,
};

const itemQty: React.CSSProperties = {
  width: '48px',
  textAlign: 'center',
};

const itemPrice: React.CSSProperties = {
  width: '100px',
  textAlign: 'right',
};

const itemDetail: React.CSSProperties = {
  color: '#444444',
  fontSize: '14px',
  margin: 0,
};

const totalsSection: React.CSSProperties = {
  maxWidth: '260px',
  marginLeft: 'auto',
};

const totalRow: React.CSSProperties = {
  padding: '4px 0',
};

const totalLabel: React.CSSProperties = {
  color: '#555555',
  fontSize: '14px',
  margin: 0,
};

const totalValue: React.CSSProperties = {
  color: '#111111',
  fontSize: '14px',
  textAlign: 'right',
  margin: 0,
};

const grandTotalLabel: React.CSSProperties = {
  color: '#111111',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0 0 4px',
};

const grandTotalValue: React.CSSProperties = {
  color: '#D61C1C',
  fontSize: '18px',
  fontWeight: '800',
  textAlign: 'right',
  margin: '0 0 4px',
};

const addressBox: React.CSSProperties = {
  backgroundColor: '#F8F9FA',
  borderRadius: '6px',
  padding: '16px 20px',
};

const addressLine: React.CSSProperties = {
  color: '#444444',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 2px',
};

const txText: React.CSSProperties = {
  color: '#888888',
  fontSize: '12px',
  margin: '0 0 16px',
};

const helpText: React.CSSProperties = {
  color: '#888888',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: 0,
};
