"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DealForm from "@/components/DealForm";
import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";
import ActivityForm from "@/components/ActivityForm";
import ActivityTimeline from "@/components/ActivityTimeline";
import ContactList from "@/components/ContactList";
import CompetitorList from "@/components/CompetitorList";
import MEDDICForm from "@/components/MEDDICForm";
import ForecastingPanel from "@/components/ForecastingPanel";

interface FileItem {
  id: string;
  filename: string;
  category: "INTERNAL" | "EXTERNAL";
  uploadedAt: string;
}

interface Activity {
  id: string;
  type: string;
  subject: string;
  notes: string | null;
  activityDate: string;
  nextSteps: string | null;
  nextStepsDue: string | null;
  createdAt: string;
}

interface Contact {
  id: string;
  name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  notes: string | null;
  isPrimary: boolean;
}

interface Competitor {
  id: string;
  name: string;
  strengths: string | null;
  weaknesses: string | null;
  status: string;
  notes: string | null;
}

interface Deal {
  id: string;
  dealName: string;
  clientCompanyName: string;
  dealValue: number;
  grossProfit: number;
  stage: string;
  files: FileItem[];
  activities: Activity[];
  contacts: Contact[];
  competitors: Competitor[];
  updatedAt: string;
  // Forecasting
  expectedCloseDate: string | null;
  probability: number;
  forecastCategory: string;
  // MEDDIC
  meddic_metrics: string | null;
  meddic_economicBuyer: string | null;
  meddic_decisionCriteria: string | null;
  meddic_decisionProcess: string | null;
  meddic_identifyPain: string | null;
  meddic_champion: string | null;
}

function getDaysSinceLastActivity(activities: Activity[], updatedAt: string): number {
  let lastDate: Date;

  if (activities.length > 0) {
    lastDate = new Date(activities[0].activityDate);
  } else {
    lastDate = new Date(updatedAt);
  }

  const now = new Date();
  const diffTime = now.getTime() - lastDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export default function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);

  const fetchDeal = useCallback(async () => {
    try {
      const [dealResponse, activitiesResponse] = await Promise.all([
        fetch(`/api/deals/${id}`),
        fetch(`/api/deals/${id}/activities`),
      ]);

      if (dealResponse.ok) {
        const dealData = await dealResponse.json();
        const activitiesData = activitiesResponse.ok
          ? await activitiesResponse.json()
          : [];
        setDeal({ ...dealData, activities: activitiesData });
      } else if (dealResponse.status === 404) {
        setError("Deal not found");
      } else {
        setError("Failed to load deal");
      }
    } catch {
      setError("Failed to load deal");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDeal();
  }, [fetchDeal]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this deal?")) return;

    try {
      const response = await fetch(`/api/deals/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/deals");
      } else {
        alert("Failed to delete deal");
      }
    } catch {
      alert("Failed to delete deal");
    }
  };

  if (!session || session.user.role !== "SALES_REP") {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error || "Deal not found"}
      </div>
    );
  }

  const stageLabels: Record<string, string> = {
    COURTING: "Courting",
    REGISTERED: "Registered",
    QUOTED: "Quoted",
    WON: "Won",
    CLOSED_LOST: "Closed/Lost",
  };

  const stageColors: Record<string, string> = {
    COURTING: "bg-purple-100 text-purple-800",
    REGISTERED: "bg-blue-100 text-blue-800",
    QUOTED: "bg-yellow-100 text-yellow-800",
    WON: "bg-green-100 text-green-800",
    CLOSED_LOST: "bg-red-100 text-red-800",
  };

  const daysSinceActivity = getDaysSinceLastActivity(deal.activities, deal.updatedAt);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{deal.dealName}</h1>
          <p className="text-gray-600">{deal.clientCompanyName}</p>
        </div>
        <div className="flex items-center gap-3">
          {daysSinceActivity > 0 && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                daysSinceActivity > 14
                  ? "bg-red-100 text-red-700"
                  : daysSinceActivity > 7
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {daysSinceActivity === 1
                ? "1 day since activity"
                : `${daysSinceActivity} days since activity`}
            </span>
          )}
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              stageColors[deal.stage]
            }`}
          >
            {stageLabels[deal.stage]}
          </span>
        </div>
      </div>

      {isEditing ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Edit Deal
          </h2>
          <DealForm deal={deal} />
          <button
            onClick={() => setIsEditing(false)}
            className="mt-4 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Deal Details
            </h2>
            <div className="space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-600">Deal Value</dt>
              <dd className="text-lg font-semibold text-gray-900">
                ${deal.dealValue.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Gross Profit</dt>
              <dd className="text-lg font-semibold text-green-600">
                ${deal.grossProfit.toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Activity Timeline
          </h2>
          <button
            onClick={() => setShowActivityForm(!showActivityForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            {showActivityForm ? "Cancel" : "+ Log Activity"}
          </button>
        </div>

        {showActivityForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <ActivityForm
              dealId={deal.id}
              onSuccess={() => {
                setShowActivityForm(false);
                fetchDeal();
              }}
              onCancel={() => setShowActivityForm(false)}
            />
          </div>
        )}

        <ActivityTimeline activities={deal.activities} />
      </div>

      {/* Two-column layout for Stakeholders, Competitors, MEDDIC, Forecasting */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Stakeholders / Contacts */}
          <div className="bg-white rounded-lg shadow p-6">
            <ContactList contacts={deal.contacts || []} dealId={deal.id} />
          </div>

          {/* Competitors */}
          <div className="bg-white rounded-lg shadow p-6">
            <CompetitorList competitors={deal.competitors || []} dealId={deal.id} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Forecasting */}
          <div className="bg-white rounded-lg shadow p-6">
            <ForecastingPanel
              dealId={deal.id}
              dealValue={deal.dealValue}
              initialData={{
                expectedCloseDate: deal.expectedCloseDate,
                probability: deal.probability ?? 10,
                forecastCategory: deal.forecastCategory ?? "PIPELINE",
              }}
            />
          </div>

          {/* MEDDIC Qualification */}
          <div className="bg-white rounded-lg shadow p-6">
            <MEDDICForm
              dealId={deal.id}
              initialData={{
                meddic_metrics: deal.meddic_metrics,
                meddic_economicBuyer: deal.meddic_economicBuyer,
                meddic_decisionCriteria: deal.meddic_decisionCriteria,
                meddic_decisionProcess: deal.meddic_decisionProcess,
                meddic_identifyPain: deal.meddic_identifyPain,
                meddic_champion: deal.meddic_champion,
              }}
            />
          </div>
        </div>
      </div>

      {/* Files */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Files</h2>
        <FileUpload dealId={deal.id} onUploadComplete={fetchDeal} />
        <div className="mt-6">
          <FileList files={deal.files} />
        </div>
      </div>
    </div>
  );
}
