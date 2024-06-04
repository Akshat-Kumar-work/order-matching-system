"use server"

import prisma from "@/db";

interface SellOrder {
    price: number;
    quantity: number;
  }

export async function createSellOrder({price, quantity}:SellOrder) {

    try{
        const createBuyOrderResponse = await prisma.buy_Orders.create({
            
        })
    }catch(e){

    }
    
}