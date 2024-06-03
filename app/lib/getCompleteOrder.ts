"use server"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function getCompleteOrder() {

    try{
     const getCompleteOrder = await prisma.$transaction([

        //fetching buy completed 
        prisma.buy_Orders.findMany({
            where:{
                isPending:false
            }
        }),

         //fetching sell completed 
         prisma.sell_Orders.findMany({
            where:{
                isPending:false
            }
        })

     ]);

    //  return( getCompleteOrder.map((value)=>{

  // Extracting the quantity and price from each order and returning them in a flattened array
  //flat function convert 2d array into 1 d array
  const formattedOrders = getCompleteOrder.flat().map(({ quantity, price }) => ({ quantity, price }));

    return formattedOrders.map( (element)=>({
       quantity:element.quantity,
       price:element.price
     }))

 
    }catch(e){
        console.log("error while fetching complete order data",e)
    }
    
}