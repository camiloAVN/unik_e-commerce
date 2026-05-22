"use client";

import { createUpdateProduct, deleteProductImage } from "@/actions";
import { ProductImage } from "@/components";
import { Category, Product, ProductImage as ProductWithImage } from "@/interfaces";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface Props {
  product: Partial<Product> & { ProductImage?: ProductWithImage[] };
  categories: Category[];
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: string[];
  tags: string;
  gender: 'men' | 'women' | 'kid' | 'unisex';
  categoryId: string;

  images?: FileList;

}

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: {isValid},
    getValues,
    setValue,
    watch
  } = useForm<FormInputs>({
    defaultValues:{
      ...product,
      tags: product.tags?.join(', ') ,
      sizes: product.sizes ?? [],
      images: undefined
      
    }
  });

  watch('sizes')

  const onSizeChanged = (size: string) =>{
    const sizes = new Set(getValues('sizes'));
    sizes.has(size) ? sizes.delete(size) : sizes.add(size)

    setValue('sizes',Array.from(sizes))
  }

  const onSubmit = async(data: FormInputs) =>{

    const formData = new FormData();

    const {images,...productToSave} = data;

    if(product.id){
      formData.append('id', product.id ?? '');

    }

    formData.append('title', productToSave.title);
    formData.append('slug', productToSave.slug);
    formData.append('description', productToSave.description);
    formData.append('price', productToSave.price.toString());
    formData.append('inStock', productToSave.inStock.toString());
    formData.append('sizes', productToSave.sizes.toString());
    formData.append('tags', productToSave.tags);
    formData.append('categoryId', productToSave.categoryId);
    formData.append('gender', productToSave.gender);

    if(images){
      for( let i = 0; i <images.length; i++){
        formData.append('images', images[i])
      }
    }

    const {ok, product: updatedProduct} = await createUpdateProduct(formData);

    if(!ok){
      alert('Producto no se pudo actualizar')
      return;
    }

    router.replace(`/admin/product/${updatedProduct?.slug}`)

  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3">
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span className="text-gray-200">Título</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200" {...register('title',{required:true})} />
        </div>

        <div className="flex flex-col mb-2">
          <span className="text-gray-200">Slug</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200" {...register('slug',{required:true})}/>
        </div>

        <div className="flex flex-col mb-2">
          <span className="text-gray-200">Descripción</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200"
            {...register('description',{required:true})}
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span className="text-gray-200">Price</span>
          <input type="number" className="p-2 border rounded-md bg-gray-200" {...register('price',{required:true, min:0})}/>
        </div>

        <div className="flex flex-col mb-2">
          <span className="text-gray-200">Tags</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200" {...register('tags',{required:true})} />
        </div>

        <div className="flex flex-col mb-2">
          <span className="text-gray-200">Gender</span>
          <select className="p-2 border rounded-md bg-gray-200" {...register('gender',{required:true})}>
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span className="text-gray-200">Categoria</span>
          <select className="p-2 border rounded-md bg-gray-200" {...register('categoryId',{required:true})}>
            <option value="">[Seleccione]</option>
            {
              categories.map(category =>(
                <option key={category.id} value={category.id}>{category.name}</option>

              ))
            }
          </select>
        </div>

        <button className="bg-emerald-400 rounded-2xl w-full p-2 hover:bg-emerald-300 font-semibold">
          Guardar
        </button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">

        <div className="flex flex-col mb-2">
          <span className="text-gray-200">Inventario</span>
          <input type="number" className="p-2 border rounded-md bg-gray-200" {...register('inStock',{required:true, min:0})}/>
        </div>

        {/* As checkboxes */}
        <div className="flex flex-col">

          <span className="text-gray-200">Tallas</span>
          <div className="flex flex-wrap">
            
            {
              sizes.map( size => (
                // bg-blue-500 text-white <--- si está seleccionado
                <div key={ size }
                  onClick={()=> onSizeChanged(size)} 
                  className={
                  clsx(
                    "flex items-center justify-center cursor-pointer w-10 h-10 mr-2 border border-gray-600 rounded-md",
                    {
                      'bg-blue-500 text-white': getValues('sizes').includes(size),
                    }
                  )
                }>
                  <span>{ size }</span>
                </div>
              ))
            }
          </div>
          <div className="flex flex-col mb-2">

            <span className="text-gray-200">Fotos</span>
            <input 
              type="file"
              {...register('images')}
              multiple 
              className="p-2 border rounded-md bg-blue-400 hover:bg-blue-300" 
              accept="image/png, image/jpeg, image/avif"
            />

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {
              product.ProductImage?.map(image =>(
                <div key={image.id}>
                  <ProductImage
                    alt={product.title ?? ''}
                    src={image.url}
                    width={300}
                    height={300}
                    className="rounded-t shadow-md"
                  />
                  <button 
                    type="button"
                    onClick={()=> deleteProductImage(image.id, image.url)}
                    className="w-full bg-red-500 rounded-b-xl hover:bg-red-300">
                    Eliminar
                  </button>
                </div>
              ))
            }

          </div>

        </div>
      </div>
    </form>
  );
};