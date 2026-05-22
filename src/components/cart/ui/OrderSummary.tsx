"use client";

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { useEffect, useMemo, useState } from "react";

export const OrderSummary = () => {

    //const getSummaryInformation = useCartStore(state => state.getSummaryInformation);
    //const { subTotal, tax, total} = getSummaryInformation();


    const cart = useCartStore(state => state.cart);

    const { subTotal, tax, total, itemsInCart } = useMemo(() => {
    const subTotal = cart.reduce((acc, p) => acc + p.quantity * p.price, 0);
    const tax = subTotal * 0.10;
    const total = subTotal + tax;
    const itemsInCart = cart.reduce((acc, p) => acc + p.quantity, 0);
    return { subTotal, tax, total, itemsInCart };
    }, [cart]);




    const [loaded, setLoaded] = useState(false);

    useEffect(()=>{
        setLoaded(true);
    },[])

    if(!loaded){
        return <p>Loading...</p>
    }


  return (
    <div className="space-y-3 mb-4">
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
  )
}
