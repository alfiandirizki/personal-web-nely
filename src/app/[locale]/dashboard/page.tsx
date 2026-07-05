import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardContent from "@/components/dashboard/DashboardContent";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/id/login");
  }

  return <DashboardContent user={user} />;
}
