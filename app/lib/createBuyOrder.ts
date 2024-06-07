"use server"

import prisma from "@/db";



  //function to check if same price order is already completed or not
 export const checkCompletedOrdersPrice = async(price:number)=>{

    const completedBuyOrder = await prisma.buy_Orders.findFirst({
        where:{
            price:price,
            isPending:false
        }
    });
  
    if(completedBuyOrder){
        
        return {  type:"buy" , data: completedBuyOrder}
    }
    const completedSellOrder = await prisma.sell_Orders.findFirst({
        where:{
            price:price,
            isPending:false
        }
    });
    
    if(completedSellOrder){
        return {type:"sell",data:completedSellOrder};
    }
        return null;
  
}



export async function createBuyOrder(price:number, quantity:number) {
        try{

            //1 check if same buy price is present in pending buy order 
            const samePriceBuyOrder = await prisma.buy_Orders.findFirst({
                where:{
                    price:price,
                    isPending:true
                }
            });

            //if same price present in buy pending order, increment quantity of that order
            if(samePriceBuyOrder){

               await prisma.buy_Orders.update({
                    where:{
                        id: samePriceBuyOrder.id
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

                //if same buy order price is not present in pending buy order table, check if present in pending seller order to complete order

                //fetching pending seller order data having same price
                const samePricePendingSellerOrder = await prisma.sell_Orders.findFirst({
                    where:{
                        price:price,
                        isPending:true
                    }
                });

//--------------------------------------------------------------------complete order conditions 
                if(samePricePendingSellerOrder){
                    //if same price present in pending seller orders->complete order

                    //2 cases for completion of order -> when quantity and price are equal, quantity is different

                    //case 1 -> when quantity and price are equal of seller and buyer, same price of buy order is not currently present in table
                    //so we directly update the seller pending table no need to interfare in buy orders, in future we can set onrampTransactions for transaction histories
                    if(samePricePendingSellerOrder.price === price && samePricePendingSellerOrder.quantity === quantity){

                       const isCompletedOrderPresent =  await checkCompletedOrdersPrice(price);

                        //if same price is already present in completed order table
                       if(isCompletedOrderPresent){

                                    if(isCompletedOrderPresent.type==="buy"){
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
                                            prisma.sell_Orders.delete({
                                                where:{
                                                    id:samePricePendingSellerOrder.id
                                                }
                                            })
                                        ])
                                        return {
                                            mess :"buy order done by incrementing the previous buy complete order "
                                        }
                                        }
                                    else{
                                        await prisma.$transaction([
                                            prisma.sell_Orders.update({
                                                where:{
                                                    id: isCompletedOrderPresent.data.id
                                                },data:{
                                                    quantity:{
                                                        increment:Number(quantity)
                                                    }
                                                }
                                            }),
                                            prisma.sell_Orders.delete({
                                                where:{
                                                    id:samePricePendingSellerOrder.id
                                                }
                                            })
                                        ])
                                        return {
                                            mess :"buy order done by incrementing the previous buy complete order "
                                        }
                                    }

                       }

                       //same price not present in complete order table so we will update the pending sell order table to complete
                        await prisma.sell_Orders.update({
                            where:{
                                id:samePricePendingSellerOrder.id
                            },data:{
                                isPending:false
                            }
                        });
                        return {
                            mess:"buy order completed "
                        }
                    }

                    //if quantity present only this check is because quantity can be null also
                 if(samePricePendingSellerOrder.quantity){

                    //if seller quantity more than buyer , seller quant > buyer quant
                    if(samePricePendingSellerOrder.price===price && samePricePendingSellerOrder.quantity > quantity){


                       const isCompletedOrderPresent =  await checkCompletedOrdersPrice(price);

                          //if same price is already present in completed order table
                       if(isCompletedOrderPresent){

                        if(isCompletedOrderPresent.type==="buy"){

                            //updating previous completed buy transactions 
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
                             //decrementing seller quantity as it is more than buyer requirement
                            prisma.sell_Orders.update({
                                where:{
                                    id:samePricePendingSellerOrder.id
                                },data:{
                                    quantity:{
                                        decrement:Number(quantity)
                                    }
                                }
                            }),

                            ]);

                            return{
                                mess:"buy order completed with updation of complete order table and decrement of seller order"
                            }


                        }else{

                            await prisma.$transaction([
                            //decrementing seller quantity as it is more than buyer requirement
                            prisma.sell_Orders.update({
                                where:{
                                    id:samePricePendingSellerOrder.id
                                },data:{
                                    quantity:{
                                        decrement:Number(quantity)
                                    }
                                }
                            }),
                            //updating seller completed quantity in complete order table
                             prisma.sell_Orders.update({
                                where:{
                                    id:isCompletedOrderPresent.data.id
                                },data:{
                                    quantity:{
                                        increment:Number(quantity)
                                    }
                                }
                            })
                            ])

                            return{
                                mess:"buy order completed with updation of previous seller completed table and sell order  quantity decrement"
                            }
                         
                        }
                     }
                    
                     //if same price is not already present in completed orders
                      await  prisma.$transaction([

                        //decrementing seller quantity as it is more than buyer requirement
                            prisma.sell_Orders.update({
                                where:{
                                    id:samePricePendingSellerOrder.id
                                },data:{
                                    quantity:{
                                        decrement:Number(quantity)
                                    }
                                }
                            }),
                        //creating new buy order with order into complete order table
                            prisma.buy_Orders.create({
                                data:{
                                    price:price,
                                    quantity:quantity,
                                    isPending:false
                                }
                            })


                        ]);

                        return {
                            mess :" buy order done "
                        }

                    }

                //bug
                    //if buyer quantity is more than seller quantity,  seller quant < buyer quantity
                     if (samePricePendingSellerOrder.price===price && samePricePendingSellerOrder.quantity <quantity){


                       const isCompletedOrderPresent =  await checkCompletedOrdersPrice(price);

                       //if price is already present in complete order table
                       if(isCompletedOrderPresent){

                            if(isCompletedOrderPresent.type === "buy"){
                                await prisma.$transaction([

                                    prisma.buy_Orders.update({
                                        where:{
                                            id:isCompletedOrderPresent.data.id
                                        },data:{
                                            quantity:{
                                                increment:Number(samePricePendingSellerOrder.quantity)
                                            }
                                        }
                                    }),
                                            //make new row for buyer with remaining quantity
                                            prisma.buy_Orders.create({
                                                data:{
                                                    price:price,
                                                    quantity: Number(quantity - samePricePendingSellerOrder.quantity)
                                                }
                                            }),
                                            prisma.sell_Orders.delete({
                                                where:{
                                                    id:samePricePendingSellerOrder.id
                                                }
                                            })
                                    
                                ]);

                                return{
                                    mess:"buy order completed with updation of previous complete buy order with new buy order row with remaining quantity"
                                }
                            }else{
                                //completed price is in sell order
                                await prisma.$transaction([

                                    prisma.sell_Orders.update({
                                        where:{
                                            id:isCompletedOrderPresent.data.id
                                        },data:{
                                            quantity:{
                                                increment:Number(samePricePendingSellerOrder.quantity)
                                            }
                                        }
                                    }),
                                            //make new row for buyer with remaining quantity
                                            prisma.buy_Orders.create({
                                                data:{
                                                    price:price,
                                                    quantity: Number(quantity - samePricePendingSellerOrder.quantity)
                                                }
                                            }),
                                            prisma.sell_Orders.delete({
                                                where:{
                                                    id:samePricePendingSellerOrder.id
                                                }
                                            })
                                    
                                ]);

                                return{
                                    mess:"buy order completed with updation of previous complete sell order with new buy order row with remaining quantity"
                                }
                            }
                       }

                       //when no previous prices are present in complete order tables
                        await prisma.$transaction([
                            
                            //update seller to completed orders
                            prisma.sell_Orders.update({
                                where:{
                                    id:samePricePendingSellerOrder.id
                                },data:{
                                    isPending:false
                                }
                            }),

                            //make new row for buyer with remaining quantity
                            prisma.buy_Orders.create({
                                data:{
                                    price:price,
                                    quantity: Number(quantity - samePricePendingSellerOrder.quantity)
                                }
                            })
                        ])
                        return {
                            mess: "buy order done and remaining buy order quantity is created in table for pending "
                        }
                    }

                 
                }
            }

//-----------------------------------------------------------new pending buy order
                else{
                    //price is not present in pending seller order and buy order too , so create new pending buy order 
                    //we have to create new pending buy order 
                    const data = await prisma.buy_Orders.create({
                        data:{
                            price:Number(price),
                            quantity:Number(quantity)
                        }
                    });

                    return {
                        mess:"order created in pending buy order "
                    }
                }

               
     
            }
        }
        
        catch(e){
            console.log("error while creating buy order");
        }
    }


    //seller selling 1000, 2000, 3000
    // buyer wants to buy at => 5k
    

    //we can do 1 thing that get the seller amount <= 5k in descending order of price
    //we can get the decending order by order buy query
    //if empty order not match

    //if buyer of 5k wants quantity 100 > seller quantity
    // while loop till the quant is zero 
