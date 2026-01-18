"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import DealCard from "@/components/DealCard";
import StageFilter from "@/components/StageFilter";

interface Deal {
  id: string;
  dealName: string;
  clientCompanyName: string;
  dealValue: number;
  grossProfit: number;
  stage: string;
  updatedAt: string;
}

export default function DealsPage() {
  const { data: session } = useSession();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState("");

  useEffect(() => {
    async function fetchDeals() {
      setLoading(true);
      try {
        const url = selectedStage
          ? `/api/deals?stage=${selectedStage}`
          : "/api/deals";
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setDeals(data);
        }
      } catch (error) {
        console.error("Error fetching deals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDeals();
  }, [selectedStage]);

  if (!session || session.user.role !== "SALES_REP") {
    return null;
  }

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
        <StageFilter
          selectedStage={selectedStage}
          onStageChange={setSelectedStage}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : deals.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">
            {selectedStage
              ? "No deals found in this stage."
              : "No deals yet."}
          </p>
          <Link
            href="/deals/new"
            className="text-blue-600 hover:underline"
          >
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
              updatedAt={new Date(deal.updatedAt)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
