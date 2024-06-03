"use server"
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export async function getPendingOrder() {


        try{
            const getPendingOrder = await prisma.$transaction([
       
               //fetching buy pending 
               prisma.buy_Orders.findMany({
                   where:{
                       isPending:true
                   }
               }),
       
                //fetching sell pending 
                prisma.sell_Orders.findMany({
                   where:{
                       isPending:true
                   }
               })
       
            ]);
       
            console.log("pending orders",getPendingOrder);
       
    }catch(e){
        console.log("err while fetching pending orders")
    }
    
}