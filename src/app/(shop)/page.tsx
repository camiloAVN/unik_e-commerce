export const revalidate = 60 // se relavida cada 60 seg

import { getPaginationProductWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
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
    <div className="p-3 flex justify-center items-center -mt-23">
      <div className="w-full h-[500px] flex justify-center items-center rounded-4xl bg-gray-600">
        <h1>Bienvenido</h1>

      </div>
    </div>

    <Title
      title="Tienda"
      subtitle="Todos los products"
      className="mb-2 text-white"
    />
    <ProductGrid products={products}/>

    <Pagination totalPages={totalPages}/>

    </>
  );
}
