"use client"
import { useState } from "react";
import BuyModal from "./BuyModal";
import SellModal from "./SellModal";

const Header = () => {


    const [buyModalState, setBuyModalState] = useState(false);
    const [sellModalState, setSellModalState] = useState(false);

  return (
    <div className="flex justify-between border-b p-4">

      <div className="text-lg  flex-col justify-center font-bold hidden md:flex">Order-Exchange</div>


      <button className=" text-lg flex  flex-col justify-center font-bold"
       onClick={() => setBuyModalState(prevState => !prevState)}> + Buy
      </button>


      <button className="text-lg flex  flex-col justify-center font-bold"
    onClick={() => setSellModalState(prevState => !prevState)}> - Sell 
      </button>


        <BuyModal currentState={buyModalState} setModal={setBuyModalState}/>
        <SellModal currentState={sellModalState} setModal={setSellModalState}/>
    </div>
  )
}

export default Header