import React from "react";
import OnboardingPage from "./_components/onboardingPage";
import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "@/lib/supabase/getUserOnboardingStatus";

const page = async () => {
  const { completed: isOnboarded } = await getUserOnboardingStatus();

  if (isOnboarded) {
    redirect("/dashboard/r/products");
  }
  return (
    <div>
      <OnboardingPage />
    </div>
  );
};

export default page;
