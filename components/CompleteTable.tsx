const CompleteOrderTable = ({ data }: any) => {


  return (
    <div className="border-2 p-4 m-10">

      <h1 className="text-xl border-b pb-2 text-center">Completed Orders Table</h1>

      <div className="grid grid-cols-2 gap-2">

        <div>
          <h2 className="text-lg font-semibold border p-2">Quantity</h2>
          {data?.quantities?.map((quantity: number, index: number) => (
            <div className=" p-2 border" key={index}>{quantity}</div>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold border p-2">Prices</h2>
          {data?.prices?.map((price: number, index: number) => (
            <div className=" p-2 border" key={index}>{price}</div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CompleteOrderTable;
