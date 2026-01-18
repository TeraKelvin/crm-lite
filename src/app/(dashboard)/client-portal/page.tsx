"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import FileList from "@/components/FileList";

interface FileItem {
  id: string;
  filename: string;
  category: "INTERNAL" | "EXTERNAL";
  uploadedAt: string;
}

interface Deal {
  id: string;
  dealName: string;
  clientCompanyName: string;
  dealValue: number;
  grossProfit: number;
  stage: string;
  updatedAt: string;
  files?: FileItem[];
}

export default function ClientPortalPage() {
  const { data: session } = useSession();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeals() {
      try {
        const response = await fetch("/api/deals");
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
  }, []);

  const fetchDealDetails = async (dealId: string) => {
    try {
      const response = await fetch(`/api/deals/${dealId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedDeal(data);
      }
    } catch (error) {
      console.error("Error fetching deal:", error);
    }
  };

  if (!session || session.user.role !== "CLIENT") {
    return null;
  }

  const stageLabels: Record<string, string> = {
    QUOTED: "Proposal Sent",
    WON: "Accepted",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {session.user.name}
        </h1>
        <p className="text-gray-600">
          View proposals and accepted deals for {session.user.companyName}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : deals.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">
            No proposals or accepted deals available yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold text-gray-900 mb-4">Your Deals</h2>
              <div className="space-y-3">
                {deals.map((deal) => (
                  <button
                    key={deal.id}
                    onClick={() => fetchDealDetails(deal.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedDeal?.id === deal.id
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {deal.dealName}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${deal.dealValue.toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          deal.stage === "WON"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {stageLabels[deal.stage]}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedDeal ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedDeal.dealName}
                    </h2>
                    <p className="text-gray-600">
                      {selectedDeal.clientCompanyName}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedDeal.stage === "WON"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {stageLabels[selectedDeal.stage]}
                  </span>
                </div>

                <dl className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <dt className="text-sm text-gray-500">Deal Value</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ${selectedDeal.dealValue.toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Status</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stageLabels[selectedDeal.stage]}
                    </dd>
                  </div>
                </dl>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Documents
                  </h3>
                  {selectedDeal.files && selectedDeal.files.length > 0 ? (
                    <FileList files={selectedDeal.files} showCategory={false} />
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No documents shared for this deal yet.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500">
                  Select a deal to view details and documents
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
