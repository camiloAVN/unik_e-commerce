import { getCompanies } from '@/actions';
import { CompaniesClient } from './ui/CompaniesClient';

export default async function CompaniesPage() {
  const companies = await getCompanies();
  return <CompaniesClient companies={companies} />;
}
