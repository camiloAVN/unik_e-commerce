import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface Props {
  body: string;
  issuerName: string;
  brandColor: string;
  appUrl: string;
}

export function CustomEmail({ body, issuerName, brandColor, appUrl }: Props) {
  const preview = body.slice(0, 90).replace(/\s+/g, ' ').trim();

  return (
    <Html lang="es">
      <Head />
      <Preview>{preview || issuerName}</Preview>
      <BodyWrap brandColor={brandColor}>
        <Container style={container}>
          {/* Header con logo sobre banda de marca */}
          <Section style={{ ...header, backgroundColor: brandColor }}>
            <Img
              src={`${appUrl}/imgs/logo.png`}
              alt={issuerName}
              height={40}
              style={logo}
            />
          </Section>

          {/* Cuerpo del mensaje (respeta saltos de línea) */}
          <Section style={content}>
            <Text style={message}>{body}</Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerBrand}>{issuerName}</Text>
            <Text style={footerText}>
              Este correo fue enviado por {issuerName}. Si tienes dudas, responde a este mensaje.
            </Text>
          </Section>
        </Container>
      </BodyWrap>
    </Html>
  );
}

export default CustomEmail;

function BodyWrap({ children, brandColor }: { children: React.ReactNode; brandColor: string }) {
  return <Body style={{ ...bodyStyle, borderTop: `4px solid ${brandColor}` }}>{children}</Body>;
}

// ── Styles ──────────────────────────────────────────────────────────────────

const bodyStyle: React.CSSProperties = {
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
  padding: '24px 40px',
  textAlign: 'center',
};

const logo: React.CSSProperties = {
  height: '40px',
  width: 'auto',
  margin: '0 auto',
  objectFit: 'contain',
};

const content: React.CSSProperties = {
  padding: '32px 40px',
};

const message: React.CSSProperties = {
  color: '#111111',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: 0,
  whiteSpace: 'pre-line',
};

const footer: React.CSSProperties = {
  backgroundColor: '#F8F9FA',
  borderTop: '1px solid #E5E5E5',
  padding: '20px 40px',
  textAlign: 'center',
};

const footerBrand: React.CSSProperties = {
  color: '#111111',
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '1px',
  margin: '0 0 4px',
};

const footerText: React.CSSProperties = {
  color: '#AAAAAA',
  fontSize: '11px',
  margin: 0,
  lineHeight: '1.5',
};
