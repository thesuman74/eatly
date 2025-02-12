type CartItemProps = {
  item: {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
  };
};

const CartItem = ({ item }: CartItemProps) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-8 py-4 text-sm">
      <div className="flex items-center space-x-4">
        <img src={item.image} alt={item.name} className="size-14 rounded-xl" />
        <div className="flex flex-col text-sm">
          <span className="line-clamp-1">{item.name}</span>
          <span className="font-bold">Rs {item.price}</span>
        </div>
      </div>

      <div className="space-x-2">
        <span>🗑️</span>
        <span>{item.quantity}</span>
        <span>+</span>
      </div>
    </div>
  );
};

export default CartItem;
