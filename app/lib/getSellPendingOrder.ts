"use server"
import prisma from "@/db";

export async function getSellPendingOrders() {

    try{
        const sellPendingOrder = await prisma.sell_Orders.findMany({
            where:{
                isPending:true
            }
        });
     

       return sellPendingOrder.map ( (singleOrder)=>({
        id: singleOrder.id, 
        buyPrice: singleOrder.price,
        buyQuantity: singleOrder.quantity,
       }))
    }catch(e){
        console.log("error while fetching pending buy order data",e)
    }
    
}