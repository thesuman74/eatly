import KitchenCardItem from "./KitchenItemCard";

export default function KitchenPage() {
  const orderData = [
    {
      order_number: 1,
      customer_name: "suman",
      created_at: "2026-01-06T12:12:00.000Z",
      items: [
        {
          id: "b2644791-7a10-47c0-a0c4-0b89bb3c7cdf",
          product_id: "6d2e195-a6f3-456a-a0ca-1ec194cd93a9",
          quantity: 1,
        },
        {
          id: "b2644791-7a10-47dc0-a0c4-0b89bb3c7cdf",
          product_id: "6de2se195-a6f3-456a-a0ca-1ec194cd93a9",
          quantity: 1,
        },
      ],
    },
    {
      order_number: 2,
      customer_name: "suman",
      created_at: "2026-01-06T12:12:00.000Z",
      items: [
        {
          id: "b2644791-7a10-47c0-a0c4-0b89bb3c7cdf",
          product_id: "6de2e195-a6f3-456a-a0ca-1ec194cd93a9",
          quantity: 1,
        },
      ],
    },
  ];

  return (
    <div className="p-10 bg-gray-100 min-h-screen flex flex-wrap w-full  items-start justify-center space-x-8 ">
      {orderData &&
        orderData?.map((order, index) => (
          <KitchenCardItem order={order} key={index} />
        ))}
    </div>
  );
}
