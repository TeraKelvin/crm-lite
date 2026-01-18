import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getDeals } from "@/lib/data";
import DealCard from "@/components/DealCard";
import StageFilter from "@/components/StageFilter";

interface DealsPageProps {
  searchParams: Promise<{ stage?: string }>;
}

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "SALES_REP") {
    redirect("/");
  }

  const { stage } = await searchParams;
  const selectedStage = stage || "";
  const deals = await getDeals(session.user.id, selectedStage || undefined);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
        <Link
          href="/deals/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + New Deal
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <StageFilter selectedStage={selectedStage} />
      </div>

      {deals.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">
            {selectedStage
              ? "No deals found in this stage."
              : "No deals yet."}
          </p>
          <Link href="/deals/new" className="text-blue-600 hover:underline">
            Create your first deal
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              id={deal.id}
              dealName={deal.dealName}
              clientCompanyName={deal.clientCompanyName}
              dealValue={deal.dealValue}
              grossProfit={deal.grossProfit}
              stage={deal.stage}
              updatedAt={deal.updatedAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
