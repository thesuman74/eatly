type ServiceType = "On Site" | "Take Away" | "Delivery"; // Defining the type of valid service strings

type ServiceButtonProps = {
  serviceType: ServiceType; // Use the ServiceType here
  onClick: (serviceType: ServiceType) => void;
};

const ServiceButton = ({ serviceType, onClick }: ServiceButtonProps) => {
  // Now icons is typed correctly based on the valid serviceType
  const icons: { [key in ServiceType]: string } = {
    "On Site": "🛄",
    "Take Away": "🍱",
    Delivery: "🚚",
  };

  return (
    <button
      className="mx-2 min-w-fit flex-1 rounded-sm bg-blue-500 py-2 text-white"
      onClick={() => onClick(serviceType)}
    >
      <span>{icons[serviceType]}</span>
      <span>{serviceType}</span>
    </button>
  );
};

export default ServiceButton;
