'use client';

import { placeOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LuShoppingCart } from "react-icons/lu";

export const PlaceOrder = () => {

    const router = useRouter();

    const [loaded, setLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const address = useAddressStore(state => state.address);

    const cart = useCartStore(state => state.cart);
    const clearCart = useCartStore(state =>state.clearCart);

    const { subTotal, tax, total, itemsInCart } = useMemo(() => {
    const subTotal = cart.reduce((acc, p) => acc + p.quantity * p.price, 0);
    const tax = subTotal * 0.10;
    const total = subTotal + tax;
    const itemsInCart = cart.reduce((acc, p) => acc + p.quantity, 0);
    return { subTotal, tax, total, itemsInCart };
    }, [cart]);


    useEffect(()=>{
        setLoaded(true)
    },[])

    if(!loaded){
        return <p>Cargando...</p>
    }

    const onPlaceOrder = async()=>{
        setIsPlacingOrder(true);

        const productsToOrder = cart.map(product =>({
            productId: product.id,
            quantity: product.quantity,
            size: product.size,
        }))
        console.log({address, productsToOrder});

        const resp = await placeOrder(productsToOrder, address);
        
        if(!resp.ok){
            setIsPlacingOrder(false);
            setErrorMessage(resp.message);
            return;
        }

        clearCart();
        router.replace('/orders/' + resp.order?.id)

    }

  return (
    <div>
        <div className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-gray-100/50 shadow-xl">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <LuShoppingCart className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Customer information</h2>
            </div>
            <div>
                <p className="font-semibold">{address.firstName} {address.lastName}</p>
                <p>{address.address}</p>
                <p>{address.address2}</p>
                <p>{address.postalCode}</p>
                <p>{address.city}, {address.country}</p>
                <p>{address.phone}</p>
            </div>

            {/* Totals */}
            <div className="border-t border-gray-200 pt-3 sm:pt-4 space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-gray-600">
                    <span>Cantidad de productos</span>
                    <span>{itemsInCart }</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{currencyFormat(subTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span>
                    <span>{currencyFormat(tax)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>{currencyFormat(total)}</span>
                </div>
            </div>

            <p className="text-red-400 mb-2">{errorMessage}</p>

            {/* Complete Order Button */}
            <button 
                disabled={isPlacingOrder}
                onClick={()=>onPlaceOrder()}
                className={
                    clsx({
                        "w-full bg-gradient-to-r from-lime-400 to-emerald-500 text-white py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-lime-400/25 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 mb-3 sm:mb-4": !isPlacingOrder,
                        "w-full bg-gray-500 text-white py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg mb-3 sm:mb-4": isPlacingOrder
                    })
                }
            >
                Complete Order
            </button>

            <p className="text-xs text-gray-500 text-center leading-relaxed">
            By completing your order, you agree to our Terms of Service and Privacy Policy
            </p>
        </div>

    </div>
  )
}
