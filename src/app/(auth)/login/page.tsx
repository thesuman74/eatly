import { LoginForm } from "@/components/login-form";
import { ChefHat, GalleryVerticalEnd } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="w-9 h-9 bg-gradient-to-br from-accent via-accent/80 to-accent/60 rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 group-hover:shadow-accent/40 transition-all duration-300">
              <ChefHat className="w-5 h-5 text-background" />
            </div>
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Eatly
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className=" relative hidden lg:block">
        <img
          src="/Images/calling-waiter.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover  "
        />
      </div>
    </div>
  );
}
