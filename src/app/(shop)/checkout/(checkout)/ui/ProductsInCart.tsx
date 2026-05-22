"use client";

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {

    const [loaded, setLoaded] = useState(false);
    const productsInCart = useCartStore(state => state.cart);

    useEffect(()=>{
        setLoaded(true);
    },[])

    if(!loaded){
        return <p>Loading...</p>
    }



  return (
    <>

        {
            productsInCart.length === 0 &&(
                <div className="flex justify-center items-center h-full">
                    <h1 className="text-black">Carrito de compras vacio</h1>
                </div>
            )
        }

        {  productsInCart .map((item) => {

            return(
                <div key={`${item.slug}-${item.size}`} className="bg-black/30 rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                        <Image
                            src={`/products/${item.image}`}
                            width={100}
                            height={100}
                            alt={item.title}
                            className="rounded"
                        />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1">
                        <span className="font-semibold text-gray-800 mb-1">
                           {item.title} - {item.quantity}
                        </span>

                        <span className="inline-block px-2 py-1 bg-lime-100 text-lime-700 text-xs rounded-md font-medium ml-2">
                        {item.size}
                        </span>
                    </div>
                    </div>

                    {/* Quantity and Price Controls */}
                    <div className="flex items-center justify-between mt-4">

                    <div className="flex items-center space-x-3">
                        <span className="font-bold text-lg text-gray-800">
                        {currencyFormat(item.price * item.quantity)}
                        </span>

                    </div>
                    </div>
                </div>
                )
            })
        }
    
    
    
    </>
  )
}
