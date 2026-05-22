import { getProductBySlug } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";
import { getCategories } from "@/actions/category/get-categories";

interface Props{
    params:Promise<{
        slug:string;
    }>
}
export default async function ProdutcPage({params}:Props) {
    const {slug} = await params;

    const [product, categories] = await Promise.all([
        getProductBySlug(slug),
        getCategories()
    ])

    if(!product && slug !== 'new'){
        redirect('/admin/products')
    }

    const title = (slug === 'new') ? "Nuevo producto" : "Editar producto"
    
    return (
        <div>
            <h1 className="text-gray-200 font-semibold text-4xl">
                {product?.title ?? ''}
            </h1>
            <ProductForm product={product ?? {}} categories={categories}/>
        </div>
    );
}