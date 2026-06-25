import { Section, Text } from '@react-email/components';
import { EmailLayout, COMPANY } from './components/EmailLayout';

interface Props {
  body: string;
  brandColor?: string;
  appUrl: string;
}

export function CustomEmail({ body, brandColor = '#D61C1C', appUrl }: Props) {
  const preview = body.slice(0, 90).replace(/\s+/g, ' ').trim();

  return (
    <EmailLayout appUrl={appUrl} preview={preview || COMPANY.name} accentColor={brandColor}>
      {/* Cuerpo del mensaje (respeta saltos de línea) */}
      <Section style={content}>
        <Text style={message}>{body}</Text>
      </Section>
    </EmailLayout>
  );
}

export default CustomEmail;

// ── Styles ──────────────────────────────────────────────────────────────────

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
