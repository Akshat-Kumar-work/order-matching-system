import Header from "@/components/Header";
import { getCompleteOrder } from "./lib/getCompleteOrder";
import { getPendingOrder } from "./lib/getPendingOrder";
import CompleteOrderTable from "@/components/CompleteTable";
import PendingOrdersTable from "@/components/PendingTable";

export default async function Home() {
const data =  await getCompleteOrder();
  // getPendingOrder();
  return (
      <div>
              <Header/>
              <CompleteOrderTable data={data}  />
              {/* <PendingOrdersTable/> */}
      </div>
  );
}
