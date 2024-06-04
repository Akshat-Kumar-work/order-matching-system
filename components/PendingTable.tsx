const PendingOrdersTable = ({buyPending, sellPending}:any) => {


  return (  
    <div className=" border-2 p-4 md:m-10 m-4">

      <h1 className="text-xl border-b pb-2 text-center">
        Pending Orders Table
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border">

        {/* pending buy orders */}
        <div className=" border ">

           <div className=" font-bold text-green-600 text-center p-2">Buy Orders</div> 

        <div  className="grid grid-cols-2 gap-2">


        {/* quantity */}
          <div >
          <h2 className="text-lg font-semibold border p-2">Quantity</h2>
          <div className=" border  ">
            
              {buyPending.map((order: any) => (
              <div className="border p-1" key={order.id}>  
                {order.buyQuantity}
              </div>
            ))}

          </div>
          </div>

          {/* price */}
            <div >
              
            <h2 className="text-lg font-semibold border p-2">Price</h2>

                <div  className=" border ">
                 {buyPending.map((order: any) => (
                  <div className="border p-1" key={order.id}> 
                    {order.buyPrice}
                  </div>
                ))}
                </div>

              </div>

          </div>

      
        </div>

        {/* pending sell orders */}
        <div className="border" >

          <div className=" text-red-700 font-bold text-center p-2">Sell Orders</div>

          <div className=" grid grid-cols-2 gap-2">

          {/* quantities */}
            <div >
          <h2 className="text-lg font-semibold border p-2">Quantity</h2>

          <div  className=" border ">
                       {sellPending.map((order: any) => (
                        <div className="border p-1" key={order.id}> 
                          {order.buyQuantity}
                        </div>
                      ))}
          </div>

            </div>

            {/* price */}
            <div >
          <h2 className="text-lg font-semibold border p-2">Price</h2>

          <div  className=" border ">
                 {sellPending.map((order: any) => (
                  <div className="border p-1" key={order.id}> 
                    {order.buyPrice}
                  </div>
                ))}
                </div>



            </div>


          </div>
         
        </div>

      </div>


    </div>
  );

}
export default PendingOrdersTable;
