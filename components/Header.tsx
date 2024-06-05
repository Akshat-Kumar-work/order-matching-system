"use client"

import { useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import BuyModal from "./BuyModal";
import SellModal from "./SellModal";


const Header = () => {


  const session = useSession();
  const name = session?.data?.user?.name;

  const [buyModalState, setBuyModalState] = useState(false);
  const [sellModalState, setSellModalState] = useState(false);

  return (
    <div className="flex justify-between border-b p-4">

        <button
          className="text-lg  flex-col justify-center font-bold hidden md:flex" onClick={()=> window.location.href = "/chart" }>
          Visualize-Order-Data
        </button>


      <div className="text-lg  flex-col justify-center font-bold hidden md:flex">
        {name}
      </div>

      <button
        className=" text-lg flex  flex-col justify-center font-bold text-green-600"
        onClick={() => setBuyModalState((prevState) => !prevState)}
      >
        + Buy
      </button>

      <button
        className="text-lg flex  flex-col justify-center font-bold text-red-800"
        onClick={() => setSellModalState((prevState) => !prevState)}
      >
        - Sell
      </button>

      <button className="text-lg flex  flex-col justify-center font-bold" onClick={() => signOut()}>
        Logout
      </button>

      <BuyModal currentState={buyModalState} setModal={setBuyModalState} />
      <SellModal currentState={sellModalState} setModal={setSellModalState} />
    </div>
  );
};

export default Header;
