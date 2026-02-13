import { OnsiteDialog } from "../dialogs/OnSiteDialog";

// Define the valid types for the service buttons
type ServiceType = "On Site" | "Take Away" | "Delivery";

type CartFooterProps = {
  onServiceClick: (serviceType: ServiceType) => void;
};

const CartFooter = ({ onServiceClick }: CartFooterProps) => {
  // const serviceOptions: ServiceType[] = ["On Site", "Take Away", "Delivery"]; // Valid service types

  return (
    <footer className="fixed bottom-0 flex w-full flex-col items-center border border-input shadow-xl py-2">
      <div className="py-2">
        <span className="text-wrap text-gray-500 text-xs font-bold">
          Select the type of service:
        </span>
      </div>
      <div className="flex w-full max-w-5xl flex-wrap justify-center gap-2 py-2">
        <OnsiteDialog order_type="OnSite" active={true} />
        <OnsiteDialog order_type="Takeaway" active={false} />
        <OnsiteDialog order_type="Delivery" active={false} />
      </div>
    </footer>
  );
};

export default CartFooter;
