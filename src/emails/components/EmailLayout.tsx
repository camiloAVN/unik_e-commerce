import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

/** Datos de la empresa, usados en el pie de TODOS los correos. */
export const COMPANY = {
  name: 'UNIK MOBILIARIO IMPORTADO',
  address: 'Diagonal 10b No 78-32',
  website: 'unikimportaciones.com',
  websiteUrl: 'https://unikimportaciones.com',
};

interface Props {
  /** URL pública de la app para resolver el logo (ej. https://unikimportaciones.com). */
  appUrl: string;
  /** Texto de previsualización (lo que se ve en la bandeja). */
  preview: string;
  /** Color de acento de la marca (filo superior). */
  accentColor?: string;
  children: React.ReactNode;
}

/**
 * Estructura común de todos los correos:
 *  - Header con el logo sobre fondo BLANCO (el logo es oscuro, por eso NO va
 *    sobre banda roja: no se vería).
 *  - Filo rojo de acento en la parte superior.
 *  - Footer con los datos de la empresa.
 * El contenido específico de cada correo va como `children`.
 */
export function EmailLayout({ appUrl, preview, accentColor = '#D61C1C', children }: Props) {
  return (
    <Html lang="es">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={{ ...container, borderTop: `4px solid ${accentColor}` }}>

          {/* Header — logo sobre blanco */}
          <Section style={header}>
            <Img
              src={`${appUrl}/imgs/logo_2.png`}
              alt={COMPANY.name}
              height={50}
              style={logo}
            />
          </Section>

          {children}

          {/* Footer — datos de la empresa */}
          <Section style={footer}>
            <Text style={footerBrand}>{COMPANY.name}</Text>
            <Text style={footerLine}>{COMPANY.address}</Text>
            <Text style={footerLine}>
              <Link href={COMPANY.websiteUrl} style={footerLink}>{COMPANY.website}</Link>
            </Text>
            <Text style={footerMuted}>
              © {new Date().getFullYear()} {COMPANY.name}. Todos los derechos reservados.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

export default EmailLayout;

// ── Styles ──────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: '#F4F4F5',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: '32px 0',
};

const container: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  maxWidth: '600px',
  margin: '0 auto',
  overflow: 'hidden',
  border: '1px solid #E5E5E5',
};

const header: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '28px 40px',
  textAlign: 'center',
  borderBottom: '1px solid #EEEEEE',
};

const logo: React.CSSProperties = {
  height: '50px',
  width: 'auto',
  margin: '0 auto',
  objectFit: 'contain',
};

const footer: React.CSSProperties = {
  backgroundColor: '#F8F9FA',
  borderTop: '1px solid #E5E5E5',
  padding: '24px 40px',
  textAlign: 'center',
};

const footerBrand: React.CSSProperties = {
  color: '#111111',
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '0.5px',
  margin: '0 0 6px',
};

const footerLine: React.CSSProperties = {
  color: '#666666',
  fontSize: '12px',
  margin: '0 0 2px',
  lineHeight: '1.5',
};

const footerLink: React.CSSProperties = {
  color: '#D61C1C',
  textDecoration: 'none',
};

const footerMuted: React.CSSProperties = {
  color: '#AAAAAA',
  fontSize: '11px',
  margin: '8px 0 0',
  lineHeight: '1.5',
};
