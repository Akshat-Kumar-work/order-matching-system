"use server"

import prisma from "@/db";


export async function getBuyPendingOrders() {

    try{
        const BuyPendingOrder = await prisma.buy_Orders.findMany({
            where:{
                isPending:true
            }
        });
       

        return BuyPendingOrder.map((order) => ({
            id: order.id, 
            buyPrice: order.price,
            buyQuantity: order.quantity,
          }));
   
    }catch(e){
        console.log("error while fetching pending buy order data",e)
    }
    
}