"use client";

import { QuantitySelector, SizeSelector } from '@/components'
import type { CartProduct, Product, Size } from '@/interfaces'
import { useCartStore } from '@/store';

import { useState } from 'react';

interface Props{
    product: Product;
}

export const AddToCart = ({product}:Props) => {

    const addProductToCart = useCartStore(state => state.addProductToCart)

    const [size, setSize] = useState<Size|undefined>();
    const [quantity, setQuantity] = useState<number>(1);
    const [posted, setPosted] = useState(false);

    const addToCart = ()=>{
        setPosted(true);

        if(!size) return;

        const cartProduct: CartProduct = {
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            quantity:  quantity,
            size: size,
            image: product.images[0]
        }
        addProductToCart(cartProduct);
        setPosted(false);
        setQuantity(1);
        setSize(undefined);

    }

  return (
    <>
        {
            posted && !size &&(
                <span className='mt-2 text-red-400'>Debe de seleccionar una talla</span>
            )
        }
        
        <SizeSelector
            selectedSize={size}
            availableSizes={product?.sizes}
            onSizeChanged={setSize}
        />

        <QuantitySelector 
            quantity={quantity}
            onQuantityChanged={setQuantity}
        />

        <button 
            className="bg-[#60e011] rounded-4xl mt-5 mb-5 p-3"
            onClick={addToCart}
        >
            Agregar al carrito
        </button>
    </>
  )
}
