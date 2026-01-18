import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getDashboardStats } from "@/lib/data";
import QuotaProgress from "@/components/QuotaProgress";
import DealCard from "@/components/DealCard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "CLIENT") {
    redirect("/client-portal");
  }

  const { ytdClosed, dealsByStage, recentDeals } = await getDashboardStats(
    session.user.id
  );

  const stageCounts = {
    COURTING: 0,
    REGISTERED: 0,
    QUOTED: 0,
    WON: 0,
    CLOSED_LOST: 0,
  };

  dealsByStage.forEach((item) => {
    stageCounts[item.stage as keyof typeof stageCounts] = item._count.stage;
  });

  const stageLabels = {
    COURTING: "Courting",
    REGISTERED: "Registered",
    QUOTED: "Quoted",
    WON: "Won",
    CLOSED_LOST: "Closed/Lost",
  };

  const stageColors = {
    COURTING: "bg-purple-500",
    REGISTERED: "bg-blue-500",
    QUOTED: "bg-yellow-500",
    WON: "bg-green-500",
    CLOSED_LOST: "bg-red-500",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {session.user.name}
        </h1>
        <Link
          href="/deals/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + New Deal
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuotaProgress
          ytdClosed={ytdClosed}
          salesGoal={session.user.salesGoal}
        />

        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pipeline Overview
          </h2>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(stageCounts).map(([stage, count]) => (
              <div
                key={stage}
                className="text-center p-3 rounded-lg bg-gray-50"
              >
                <div
                  className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                    stageColors[stage as keyof typeof stageColors]
                  }`}
                />
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-xs text-gray-500">
                  {stageLabels[stage as keyof typeof stageLabels]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Deals</h2>
          <Link
            href="/deals"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        {recentDeals.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No deals yet.{" "}
            <Link href="/deals/new" className="text-blue-600 hover:underline">
              Create your first deal
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentDeals.map((deal) => (
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
    </div>
  );
}
