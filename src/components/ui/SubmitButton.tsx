import Image from "next/image";
import { Button } from "./button";
import { Loader } from "lucide-react";

interface ButtonProps {
  isLoading: boolean;
  disabled?: boolean; // Optional disabled prop
  className?: string;
  children: React.ReactNode;
  loadingText?: string;
}

const SubmitButton = ({
  isLoading,
  disabled = false, // Default to false
  className,
  children,
  loadingText,
}: ButtonProps) => {
  const isDisabled = isLoading || disabled; // Disable if loading or explicitly disabled

  return (
    <Button
      type="submit"
      disabled={isDisabled}
      className={` ${className ?? "bg-blue-500 hover:bg-blue-600 w-full"} ${
        isDisabled ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Loader
            className="animate-spin"
            width={24}
            height={24}
            aria-label="loader"
          />
          {loadingText ? loadingText : "Loading ..."}
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
