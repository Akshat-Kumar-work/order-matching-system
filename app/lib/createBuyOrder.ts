"use server"
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface BuyOrder {
    price: number;
    quantity: number;
  }


  //function to check if same price order is already completed or not
const checkCompletedOrdersPrice = async(price:number)=>{
    const completedBuyOrder = await prisma.buy_Orders.findFirst({
        where:{
            price:price
        }
    });
    const completedSellOrder = await prisma.sell_Orders.findFirst({
        where:{
            price:price
        }
    });

    if(completedBuyOrder){
        return  completedBuyOrder
    }else if( completedSellOrder){
        return completedSellOrder
    }else{
        return null;
    }
}

export async function createBuyOrder({price, quantity}:BuyOrder) {
        try{

            //1 check if same buy price is present in pending buy order 
            const samePriceOrder = await prisma.buy_Orders.findFirst({
                where:{
                    price:price,
                    isPending:true
                }
            });

            //if same price present in pending order, increment quantity of that order
            if(samePriceOrder){

               const incrementQuantity =  await prisma.buy_Orders.update({
                    where:{
                        id: samePriceOrder.id
                    },data:{
                        quantity:{
                            increment: Number(quantity)
                        }
                    }
                });

                return{
                    mess: "order placed as the price already present in pending buy order,  quantity incremented"
                } ;
                
            }else{
                //if same buy order price is not present in pending buy order table

                //fetching pending seller order data having same price
                const samePricePendingSellerOrder = await prisma.sell_Orders.findFirst({
                    where:{
                        price:price,
                        isPending:true
                    }
                });

                
                //if same price present in pending seller orders
                if(samePricePendingSellerOrder){

                    //2 case for completion of order
                       
                    
                }else{
                    //price is not present in pending seller order and buy order too , so create new pending buy order 
                    const data = await prisma.buy_Orders.create({
                        data:{
                            price:price,
                            quantity:quantity
                        }
                    });

                    return {
                        mess:"order created in pending buy order "
                    }
                }

               
            }

        }catch(e){
            console.log("error while creating buy order");
        }
}