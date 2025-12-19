"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GrRestaurant } from "react-icons/gr";
import { MdLocalCafe } from "react-icons/md";
import { IoBeerOutline } from "react-icons/io5";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { addRestaurantAPI } from "@/services/restaurantServices";
import SubmitButton from "@/components/ui/SubmitButton";

const OnboardingPage = () => {
  const router = useRouter();

  const businessType = [
    { id: 1, name: "restaurant", logo: <GrRestaurant /> },
    { id: 2, name: "bar", logo: <IoBeerOutline /> },
    { id: 3, name: "cafe", logo: <MdLocalCafe /> },
    { id: 4, name: "other", logo: <Plus /> },
  ];

  const [selectedBusiness, setSelectedBusiness] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    if (!businessName.trim() || !selectedBusiness) return;

    try {
      setIsLoading(true);
      const restaurant = await addRestaurantAPI({
        restaurantName: businessName,
        type: selectedBusiness,
      });
      toast.success("Restaurant created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="h-screen flex items-center justify-center bg-gray-50">
      <div>
        <h1 className="text-4xl font-bold">Welcome to Digital Menus 👋</h1>
        <p className="text-gray-500 mb-4">Let's get your account ready</p>

        <Card className="w-[600px] p-6">
          <CardHeader>
            <CardTitle className="text-2xl">Business Details</CardTitle>
            <CardDescription>
              Select your business type and name
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col space-y-4">
            <Label>Business Name</Label>
            <Input
              placeholder="Business Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />

            <Label>Business Type</Label>
            <div className="flex space-x-4">
              {businessType.map((type) => (
                <div
                  key={type.id}
                  className={`flex items-center space-x-2 border p-2 rounded cursor-pointer ${
                    selectedBusiness === type.name
                      ? "border-2 border-blue-700"
                      : "border-gray-300"
                  } hover:border-2 hover:border-blue-500 transition-all`}
                  onClick={() => setSelectedBusiness(type.name)}
                >
                  {type.logo}
                  <span>{type.name}</span>
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <div onClick={handleNext} className="">
              <SubmitButton
                isLoading={isLoading}
                disabled={!selectedBusiness || !businessName}
              >
                Next
              </SubmitButton>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default OnboardingPage;
