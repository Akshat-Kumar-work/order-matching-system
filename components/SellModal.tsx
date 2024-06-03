"use client"

import { useState } from "react";



const SellModal = ({ currentState, setModal }: any) => {

  const [price,setPrice] = useState(null);
  const [quantity,setQuantity] = useState(null);


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
         
          type="text"
          id="first_name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />

        {/* quantity */}
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Quantity
        </label>
        <input

          type="text"
          id="first_name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />

<div className="flex justify-center p-2">
          <button  className="text-lg font-bold text-red-800">
           Sell
          </button>
        </div>

   
      </div>
    </div>
  );
};

export default SellModal;
