"use server"
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface BuyOrder {
    price: number;
    quantity: number;
  }

export async function createBuyOrder({price, quantity}:BuyOrder) {

    try{
        const SellOrder = await prisma.sell_Orders.findMany({
            where: {
                price: price
            }
        });

        const createBuyOrderResponse = await prisma.buy_Orders.create({

        })
    }catch(e){

    }
    
}