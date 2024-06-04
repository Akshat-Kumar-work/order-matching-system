import Header from "@/components/Header";
import { getCompleteOrder } from "./lib/getCompleteOrder";
import { getBuyPendingOrders } from "./lib/getBuyPendingOrder";
import { getSellPendingOrders } from "./lib/getSellPendingOrder";
import CompleteOrderTable from "@/components/CompleteTable";
import PendingOrdersTable from "@/components/PendingTable";

export default async function Home() {
const data =  await getCompleteOrder();
const buyPendingData = await getBuyPendingOrders();
const sellPendingData = await getSellPendingOrders();
  return (
      <div>
              <Header/>
              <PendingOrdersTable buyPending={buyPendingData} sellPending={sellPendingData} />
              <CompleteOrderTable data={data}  />
      </div>
  );
}
