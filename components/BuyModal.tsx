"use client"
import { useState } from "react";
import { createBuyOrder } from "@/app/lib/createBuyOrder";

const BuyModal = ({currentState,setModal}:any) => {


  
  const [price,setPrice] = useState(0);
  const [quantity,setQuantity] = useState(0);


    if (!currentState) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">

      <div className="bg-white p-6 rounded-lg shadow-lg">

      <div className="flex justify-end">
          <button onClick={() => setModal(false)} className="text-lg font-bold text-red-700">
            X
          </button>
        </div>

        
        {/* price */}
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Price
        </label>
        <input
         onChange={(e)=>setPrice(Number(e.target.value))}
          type="text"
          id="first_name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />

        {/* quantity */}
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Quantity
        </label>
        <input
          onChange={(e)=>setQuantity(Number(e.target.value))}
          type="text"
          id="first_name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />

<div className="flex justify-center p-2">
          <button  className="text-lg font-bold text-green-600" onClick={async()=> {await createBuyOrder(price,quantity), window.location.reload()}}>
           Buy
          </button>
        </div>

   
      </div>
    </div>
    );
  };

  export default BuyModal;