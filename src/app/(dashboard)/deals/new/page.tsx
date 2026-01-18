import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DealForm from "@/components/DealForm";

export default async function NewDealPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "SALES_REP") {
    redirect("/client-portal");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Deal</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <DealForm />
      </div>
    </div>
  );
}
