import { getQuotes, getQuoteFormData, getSettings } from '@/actions';
import { QuotesClient } from './ui/QuotesClient';

export default async function QuotesPage() {
  const [quotes, { companies, products }, settings] = await Promise.all([
    getQuotes(),
    getQuoteFormData(),
    getSettings(),
  ]);

  const pdfConfig = {
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

  return (
    <QuotesClient
      quotes={quotes}
      companies={companies}
      products={products}
      pdfConfig={pdfConfig}
    />
  );
}
