"use client";

import React, { useActionState, useState } from "react";
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
import { Loader2, Plus } from "lucide-react";
import { addRestaurantAPI } from "@/services/restaurantServices";
import SubmitButton from "@/components/ui/SubmitButton";
import { protocol, rootDomain } from "@/lib/utils";
import { checkSubdomainAvailabilityAction } from "@/lib/actions/checkSubdomainAction";
import { createSubdomainAction } from "@/lib/actions/createSubdomainAction";

type CheckState = {
  available?: boolean;
  error?: string;
};

const OnboardingPage = () => {
  const router = useRouter();

  const businessType = [
    { id: 1, name: "restaurant", logo: <GrRestaurant /> },
    { id: 2, name: "bar", logo: <IoBeerOutline /> },
    { id: 3, name: "cafe", logo: <MdLocalCafe /> },
    { id: 4, name: "other", logo: <Plus /> },
  ];

  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [checkState, checkAction, isChecking] = useActionState<
    CheckState,
    FormData
  >(checkSubdomainAvailabilityAction, {});

  const sanitizeSubdomain = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-");

  const handleBusinessNameChange = (value: string) => {
    setBusinessName(value);
    setSubdomain(sanitizeSubdomain(value));
  };

  const handleNext = async () => {
    if (checkState?.available !== true) {
      toast.error("Please choose an available subdomain.");
      return;
    }

    try {
      setIsLoading(true);
      // 1. Create restaurant in DB
      const response = await addRestaurantAPI({
        restaurantName: businessName,
        type: selectedBusiness,
      });
      const restaurant = response.restaurant;
      console.log("restaurant", restaurant);
      // 2. Reserve subdomain in Redis (server action)
      await createSubdomainAction({
        subdomain,
        restaurantId: restaurant.id,
      });

      router.push(
        `${protocol}//${subdomain}.${rootDomain}/dashboard/${restaurant.id}`
      );
      // router.push(`${protocol}//${rootDomain}/dashboard/${restaurant.id}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[600px] p-6">
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
          <CardDescription>Select business info</CardDescription>
        </CardHeader>

        <form action={checkAction} className="space-y-4">
          <CardContent className="space-y-4">
            <div>
              <Label>Business Name</Label>
              <Input
                value={businessName}
                onChange={(e) => handleBusinessNameChange(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Subdomain</Label>
              <div className="flex items-center gap-2">
                <Input
                  name="subdomain"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  required
                />
                {/* <span>.{rootDomain}</span> */}
                <Button
                  type="submit"
                  size="sm"
                  disabled={!subdomain || isChecking}
                >
                  {isChecking ? "Checking..." : "Check"}
                </Button>
              </div>
            </div>

            <span
              className={`text-sm ${
                checkState?.available === undefined
                  ? "text-gray-400" // default before checking
                  : checkState.available
                  ? "text-green-600" // available
                  : "text-red-500" // taken
              }`}
            >
              {subdomain && ` ${subdomain}.${rootDomain}`}
              {checkState?.available !== undefined &&
                (checkState.available ? " is Available" : " is Taken")}
            </span>
            <div>
              <Label className=" ">Business Type</Label>
              <div className="flex gap-4">
                {businessType.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setSelectedBusiness(type.name)}
                    className={`flex items-center gap-2 border p-2 rounded cursor-pointer ${
                      selectedBusiness === type.name
                        ? "border-blue-700"
                        : "border-gray-300"
                    }`}
                  >
                    {type.logo} {type.name}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="justify-end">
            <Button
              onClick={handleNext}
              disabled={
                !businessName ||
                !selectedBusiness ||
                checkState?.available !== true
              }
            >
              {isLoading && <Loader2 className="animate-spin" />}
              Next
            </Button>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
};

export default OnboardingPage;
