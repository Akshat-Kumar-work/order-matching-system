"use server"

import prisma from "@/db";



export async function createSellOrder(price:number,quantity:number) {

    try{

        //getting same price seller order data with pending 
        const selleOrderData = await prisma.sell_Orders.findFirst({
            where:{
                price:price,
                isPending:true
            }
        });

        //1 check if same price present in table with pending state
        //if same price present with pending status then increment the quantity
        if(selleOrderData){
                await prisma.sell_Orders.update({
                    where:{
                        id: selleOrderData.id
                    },data:{
                        quantity:{
                            increment: Number(quantity)
                        }
                    }
                })

                return{
                    mess: "sell order incremented successfully"
                }
        }else{
            //means there is no same price pending currently in sell order table 

            //getting buy order data which is having same price and is pending
            const buyOrderData = await prisma.buy_Orders.findFirst({
                where:{
                    price:price,
                    isPending:true
                }
            });

            //if buy order table having same price in pending state make it complete
            if(buyOrderData){

            }else{
                //means there is no pending orders in seller or buyer table, we have to create new
                await prisma.sell_Orders.create({
                    data:{
                        price:Number(price),
                        quantity:Number(quantity)
                    }
                })

                return {
                    mess:"new pending sell order created successfully"
                }
            }

        }

    }catch(e){
        console.log("error while creating sell order ",e);
    }   
    
}