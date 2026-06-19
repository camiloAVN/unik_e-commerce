import { getQuotes } from '@/actions';
import { CorreoClient } from './ui/CorreoClient';

export default async function CorreoPage() {
  const quotes = await getQuotes();

  const quoteOptions = quotes.map((q) => ({
    id: q.id,
    number: q.number,
    companyName: q.company.name,
    total: q.total,
  }));

  return <CorreoClient quotes={quoteOptions} />;
}
