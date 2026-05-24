export const revalidate = 60 // se relavida cada 60 seg

import { getPaginationProductWithImages } from "@/actions";
import { FeatureBadges, FeaturedCategories, HeroSlideshow, Pagination, ProductGrid, Title } from "@/components";
import { redirect } from "next/navigation";


interface Props{

  searchParams:Promise<{
    page?: string;
  }>
}


export default async function Home({searchParams}:Props) {
  
  const params = await searchParams
  const page = params.page ? parseInt(params.page) : 1;

  const {products, currentPage, totalPages}= await getPaginationProductWithImages({page});

  if (products.length === 0){
    redirect('/');
  }


  return (
    <>
      {/* Hero — break out of the layout's side padding */}
      <div className="-mx-5 sm:-mx-10">
        <HeroSlideshow />
      </div>

      {/* Feature badges */}
      <FeatureBadges />

      {/* Featured categories */}
      <FeaturedCategories />

      <Title
        title="Tienda"
        subtitle="Todos los productos"
        className="mt-8 mb-2"
      />
      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
