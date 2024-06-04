"use server"

import prisma from "@/db";
import { checkCompletedOrdersPrice } from "./createBuyOrder";



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
            const samePricePendingAtbuyOrder = await prisma.buy_Orders.findFirst({
                where:{
                    price:price,
                    isPending:true
                }
            });


//--------------------------------------------------------------------complete order conditions 

            //if buy order table having same price in pending state make it complete
            if(samePricePendingAtbuyOrder){



                //if seller and buyer quantity is same 
                if(samePricePendingAtbuyOrder.price===price && samePricePendingAtbuyOrder.quantity===quantity){

                    const isCompletedOrderPresent = await checkCompletedOrdersPrice(price);

                    //if  same price already present in completed state
                    if(isCompletedOrderPresent){


                                if(isCompletedOrderPresent.type === "buy"){
                                    await prisma.$transaction([
                                        prisma.buy_Orders.update({
                                            where:{
                                                id:isCompletedOrderPresent.data.id
                                            },data:{
                                                quantity:{
                                                    increment:Number(quantity)
                                                }
                                            }
                                        }),
                                        prisma.buy_Orders.delete({
                                            where:{
                                                id:samePricePendingAtbuyOrder.id
                                            }
                                        })
                                    ]);
                                    return{
                                        mess:"sell order completed by incremented buy quantity which is already completed and deleted the buy pending order"
                                    }
                                }else{
                                    await prisma.$transaction([
                                        prisma.sell_Orders.update({
                                            where:{
                                                id:isCompletedOrderPresent.data.id
                                            },data:{
                                                quantity:{
                                                    increment:Number(quantity)
                                                }
                                            }
                                        }),
                                        prisma.buy_Orders.delete({
                                            where:{
                                                id:samePricePendingAtbuyOrder.id
                                            }
                                        })
                                    ]);
                                    return{
                                        mess:"sell order completed by incremeneted completed sell quantity and deleted buy order pending  "
                                    }
                                }
                    }

                    //same price not present, we will udpate the pending buy order table 
                    await prisma.buy_Orders.update({
                        where:{
                            id:samePricePendingAtbuyOrder.id
                        },data:{
                            isPending:false
                        }
                    });
                }


                if(samePricePendingAtbuyOrder.quantity){

                    //if seller quantity is more than buyer , seller quantity > buyer quantity
                    if(samePricePendingAtbuyOrder.price===price && quantity > samePricePendingAtbuyOrder.quantity){

                        const isCompletedOrderPresent = await checkCompletedOrdersPrice(price);

                        //if same price already in complete state
                        if(isCompletedOrderPresent){
                            
                            if(isCompletedOrderPresent.type==="buy"){

                                //update previous completed buy order 
                                await prisma.$transaction([

                                    prisma.buy_Orders.update({
                                        where:{
                                            id:isCompletedOrderPresent.data.id
                                        },data:{
                                            quantity:{
                                               increment:Number(samePricePendingAtbuyOrder.quantity) 
                                            }
                                        }
                                    }),

                                    prisma.sell_Orders.create({
                                        data:{
                                            price:Number(price),
                                            quantity:Number(quantity-samePricePendingAtbuyOrder.quantity)
                                        }
                                    }),

                                    prisma.buy_Orders.delete({
                                        where:{
                                            id:samePricePendingAtbuyOrder.id
                                        }
                                    })
                                ]);
                                return {
                                    mess:"sell order completed with incremented buy completed order and created the seller order by decrementation"
                                }
                            }else{
                                 //update previous completed sell order 
                                 await prisma.$transaction([

                                    prisma.sell_Orders.update({
                                        where:{
                                            id:isCompletedOrderPresent.data.id
                                        },data:{
                                            quantity:{
                                               increment:Number(samePricePendingAtbuyOrder.quantity) 
                                            }
                                        }
                                    }),

                                    prisma.sell_Orders.create({
                                        data:{
                                            price:Number(price),
                                            quantity:Number(quantity-samePricePendingAtbuyOrder.quantity)
                                        }
                                    }),
                                    prisma.buy_Orders.delete({
                                        where:{
                                            id:samePricePendingAtbuyOrder.id
                                        }})
                                ]);
                                return {
                                    mess:"sell order completed with incremented buy completed order and created the seller order by decrementation"
                                }
                                
                            }
                           

                        }

                         //when no previous prices are present in complete order table
                         await prisma.$transaction([
                            //update buyer to complete order
                            prisma.buy_Orders.update({
                                where:{
                                    id:samePricePendingAtbuyOrder.id
                                },data:{
                                    isPending:false
                                }
                            }),
                            prisma.sell_Orders.create({
                                data:{
                                    price:Number(price),
                                    quantity:Number(quantity-samePricePendingAtbuyOrder.quantity)
                                }
                            })
                         ])

                         return{
                            mess:"sell order done with buy order completion and new sell pending order creation"
                         }
                    }

                    //if buy order quantity is more than sell order quantity, buy quantity > sell quantity
                   if(samePricePendingAtbuyOrder.price === price && samePricePendingAtbuyOrder.quantity > quantity){

                    const isSamePricing = await checkCompletedOrdersPrice(price);

                    if(isSamePricing){

                        if(isSamePricing.type === "buy"){
                          await  prisma.$transaction([

                                prisma.buy_Orders.update({
                                    where:{
                                        id:isSamePricing.data.id
                                    },data:{
                                        quantity:{
                                            increment:Number(quantity)
                                        }
                                    }
                                }),
                                prisma.buy_Orders.update({
                                    where:{
                                        id:samePricePendingAtbuyOrder.id
                                    },data:{
                                        quantity:Number(samePricePendingAtbuyOrder.quantity-quantity)
                                    }
                                })
                            ]);
                            return{
                                mess:"sell order completed with previous buy completed order incrementation and buy order pending updation"
                            }
                        }else{
                            //same price present at sell order completion
                            await  prisma.$transaction([

                                prisma.sell_Orders.update({
                                    where:{
                                        id:isSamePricing.data.id
                                    },data:{
                                        quantity:{
                                            increment:Number(quantity)
                                        }
                                    }
                                }),
                                prisma.buy_Orders.update({
                                    where:{
                                        id:samePricePendingAtbuyOrder.id
                                    },data:{
                                        quantity: Number(samePricePendingAtbuyOrder.quantity-quantity)
                                        
                                    }
                                })
                            ]);
                            return{
                                mess:"sell order completed with previous buy completed order incrementation and buy order pending updation"
                            }
                        }
                    }

                    await prisma.$transaction([

                        prisma.sell_Orders.create({
                            data:{
                                price:price,
                                quantity:quantity,
                                isPending:false
                            }
                        }),

                        prisma.buy_Orders.update({
                            where:{
                                id:samePricePendingAtbuyOrder.id
                            },data:{
                                quantity:Number(samePricePendingAtbuyOrder.quantity-quantity)
                                
                            }
                        })
                    ]);

                    return{
                        mess:"sell order done with new order creation with pending false and decrementation of buy order "
                    }

                   }
                }

            }


//-----------------------------------------------------------new pending sell order
        
            else{
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