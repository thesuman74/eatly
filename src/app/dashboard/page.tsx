import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Redirect to the default subpage
  redirect("/dashboard/r/products");

  // This component will never render anything because of the redirect
  return null;
}
