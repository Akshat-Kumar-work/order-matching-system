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
  const formattedOrders = getCompleteOrder.flat();
  const quantities:any = [];
  const prices:any = [];

  //from single array we are seperating values of quantities and prices
  formattedOrders.forEach(order=>{
    quantities.push(order.quantity);
    prices.push(order.price);
  })




  return ({quantities,prices});

 
    }catch(e){
        console.log("error while fetching complete order data",e)
    }
    
}