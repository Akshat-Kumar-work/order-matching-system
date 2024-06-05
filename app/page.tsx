import Header from "@/components/Header";
import { getCompleteOrder } from "./lib/getCompleteOrder";
import { getBuyPendingOrders } from "./lib/getBuyPendingOrder";
import { getSellPendingOrders } from "./lib/getSellPendingOrder";
import CompleteOrderTable from "@/components/CompleteTable";
import PendingOrdersTable from "@/components/PendingTable";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation'




export default async function Home() {
const session = await getServerSession(authOptions)

const data =  await getCompleteOrder();
const buyPendingData = await getBuyPendingOrders();
const sellPendingData = await getSellPendingOrders();

if(session?.user){
  return (
    <div>
            <Header/>
            <PendingOrdersTable buyPending={buyPendingData} sellPending={sellPendingData} />
            <CompleteOrderTable data={data}  />
    </div>
)
}else{
        redirect(`/api/auth/signin`);
}

}
