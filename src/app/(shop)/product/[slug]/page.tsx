export const revalidate = 604800; // 7 dias

import notFound from "../not-found";
import { titleFont } from "@/config/fonts";
import { ProductMobileSlideShow, ProductSlideShow, StockLabel } from "@/components";
import { getProductBySlug } from "@/actions";
import { Metadata, ResolvingMetadata } from "next";
import { AddToCart } from "./ui/AddToCart";

interface Props {
    params:Promise<{
        slug:string;
    }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug
 
  // fetch post information
  const product = await getProductBySlug(slug);
 
  return {
    title: product?.title ?? "producto no encontrado",
    description: product?.description ?? "",

    openGraph:{
        title: product?.title ?? "producto no encontrado",
        description: product?.description ?? "",
        // estas imagenes son las que van a estar en redes al momento de hacer marketing
        images:[`/products/${product?.images[1]}`] //todo: cambiar en produccion
    }
  }
}
 


export default async function ProductPage({params}:Props){
     const {slug} = await params;
    const product = await getProductBySlug(slug);

    if(!product){
        notFound();
    }


    return(
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ">
            <div className="cols-span-1 md:col-span-2">

                <ProductMobileSlideShow
                    title={product?.title}
                    images={product?.images}
                    className="block md:hidden"
                />


                <ProductSlideShow
                    title={product?.title}
                    images={product?.images}
                    className="hidden md:block"
                />
            </div>
            <div className="col-span-1 p-5 bg-white rounded md:h-[85vh] h-fit mb-5">

                <StockLabel slug={product?.slug}/>

                <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
                    {product?.title}
                </h1>
                <p className="text-lg mb-5">${product?.price}</p>

                <AddToCart product={product!}/>

                <h3 className="font-bold text-sm"> Descripcion</h3>
                <p className="font-light">
                    {product?.description}
                </p>

            </div>
        </div>
    )
}