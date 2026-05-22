"use client";

import { useState } from "react";
import { IoAddCircleOutline, IoRemoveCircle } from "react-icons/io5";

interface Props{
    quantity:number;
    onQuantityChanged: (value:number)=>void;
}


export const QuantitySelector = ({quantity, onQuantityChanged}:Props) => {

    //const [count, setCount] = useState(quantity);

    const onValueChanged =(value:number)=>{
        if(quantity + value < 1) return;

         onQuantityChanged(quantity + value);

    }


  return (
    <div className="flex">
        <button onClick={()=>onValueChanged(-1)}>
            <IoRemoveCircle size={30}/>
        </button>
        <span className="w-20 mx-3 px-5 bg-gray-100 rounded text-center">
            {quantity}
        </span>

        <button onClick={()=>onValueChanged(+1)}>
            <IoAddCircleOutline size={30}/>
        </button>

    </div>
  )
}
