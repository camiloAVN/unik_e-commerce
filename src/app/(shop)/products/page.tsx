export const revalidate = 60;

import Link from 'next/link';
import { LuPackageSearch } from 'react-icons/lu';
import { getPaginationProductWithImages, getCategories } from '@/actions';
import { Pagination, ProductGrid } from '@/components';

interface Props {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category: categorySlug, page: pageParam } = await searchParams;
  const page = pageParam ? Math.max(1, parseInt(pageParam)) : 1;

  const [allCategories, { products, totalPages }] = await Promise.all([
    getCategories(),
    getPaginationProductWithImages({ page, take: 12, categorySlug }),
  ]);

  const categories = (
    allCategories as { id: string; name: string; slug: string; isActive: boolean; sortOrder: number }[]
  )
    .filter(c => c.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const activeCategory = categories.find(c => c.slug === categorySlug);

  /* ── helpers ── */
  const pillBase =
    'px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap';
  const pillActive = 'bg-[#D61C1C] border-[#D61C1C] text-white';
  const pillIdle =
    'bg-white border-[#E5E5E5] text-[#444444] hover:border-[#111111] hover:text-[#111111]';

  return (
    <div className="pt-6">

      {/* ── Page header ── */}
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">
            {activeCategory ? activeCategory.name : 'Todos los productos'}
          </h1>
          {activeCategory && (
            <p className="text-sm text-[#444444] mt-0.5">
              Mostrando resultados para{' '}
              <span className="font-medium text-[#111111]">{activeCategory.name}</span>
            </p>
          )}
        </div>
      </div>

      {/* ── Category filter pills ── */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-7 pb-5 border-b border-[#E5E5E5]">
          {/* "Todos" pill */}
          <Link
            href="/products"
            className={`${pillBase} ${!categorySlug ? pillActive : pillIdle}`}
          >
            Todos
          </Link>

          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`${pillBase} ${categorySlug === cat.slug ? pillActive : pillIdle}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* ── Products or empty state ── */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <LuPackageSearch className="w-12 h-12 text-[#E5E5E5] mb-4" />
          <p className="text-base font-semibold text-[#111111]">
            {categorySlug
              ? 'No hay productos en esta categoría'
              : 'No hay productos disponibles'}
          </p>
          <p className="text-sm text-[#444444] mt-1 mb-6">
            {categorySlug
              ? 'Prueba seleccionando otra categoría.'
              : 'Vuelve más tarde.'}
          </p>
          {categorySlug && (
            <Link
              href="/products"
              className="text-sm font-medium text-[#D61C1C] hover:underline underline-offset-2"
            >
              Ver todos los productos
            </Link>
          )}
        </div>
      ) : (
        <>
          <ProductGrid products={products} />
          <Pagination totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
