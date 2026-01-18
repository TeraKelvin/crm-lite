"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface MEDDICFormProps {
  dealId: string;
  initialData: {
    meddic_metrics: string | null;
    meddic_economicBuyer: string | null;
    meddic_decisionCriteria: string | null;
    meddic_decisionProcess: string | null;
    meddic_identifyPain: string | null;
    meddic_champion: string | null;
  };
}

const meddicFields = [
  {
    key: "meddic_metrics",
    label: "Metrics",
    letter: "M",
    description: "Quantifiable measures of success",
    placeholder: "e.g., Reduce costs by 20%, increase efficiency by 30%...",
  },
  {
    key: "meddic_economicBuyer",
    label: "Economic Buyer",
    letter: "E",
    description: "Person with budget authority",
    placeholder: "e.g., CFO Sarah Johnson - controls IT budget...",
  },
  {
    key: "meddic_decisionCriteria",
    label: "Decision Criteria",
    letter: "D",
    description: "What they'll evaluate solutions on",
    placeholder: "e.g., ROI, ease of implementation, vendor support...",
  },
  {
    key: "meddic_decisionProcess",
    label: "Decision Process",
    letter: "D",
    description: "Steps to make a purchase decision",
    placeholder: "e.g., IT review → Legal → CFO sign-off → Board approval...",
  },
  {
    key: "meddic_identifyPain",
    label: "Identify Pain",
    letter: "I",
    description: "Business problems driving the purchase",
    placeholder: "e.g., Manual processes costing 40 hours/week...",
  },
  {
    key: "meddic_champion",
    label: "Champion",
    letter: "C",
    description: "Internal advocate for your solution",
    placeholder: "e.g., VP Ops Mike Chen - personally invested in success...",
  },
];

export default function MEDDICForm({ dealId, initialData }: MEDDICFormProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    meddic_metrics: initialData.meddic_metrics || "",
    meddic_economicBuyer: initialData.meddic_economicBuyer || "",
    meddic_decisionCriteria: initialData.meddic_decisionCriteria || "",
    meddic_decisionProcess: initialData.meddic_decisionProcess || "",
    meddic_identifyPain: initialData.meddic_identifyPain || "",
    meddic_champion: initialData.meddic_champion || "",
  });

  const calculateScore = () => {
    let filled = 0;
    if (formData.meddic_metrics) filled++;
    if (formData.meddic_economicBuyer) filled++;
    if (formData.meddic_decisionCriteria) filled++;
    if (formData.meddic_decisionProcess) filled++;
    if (formData.meddic_identifyPain) filled++;
    if (formData.meddic_champion) filled++;
    return filled;
  };

  const score = calculateScore();
  const scoreColor =
    score <= 2 ? "text-red-600" : score <= 4 ? "text-yellow-600" : "text-green-600";
  const scoreBg =
    score <= 2 ? "bg-red-100" : score <= 4 ? "bg-yellow-100" : "bg-green-100";

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/deals/${dealId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      router.refresh();
    } catch (error) {
      console.error("Error saving MEDDIC:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">MEDDIC Qualification</h3>
          <span className={`text-sm font-medium px-2 py-1 rounded ${scoreBg} ${scoreColor}`}>
            {score}/6
          </span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>

      {/* Score bar visualization */}
      <div className="flex gap-1 mb-4">
        {meddicFields.map((field) => {
          const isFilled = formData[field.key as keyof typeof formData];
          return (
            <div
              key={field.key}
              className={`flex-1 h-2 rounded ${
                isFilled ? "bg-green-500" : "bg-gray-200"
              }`}
              title={`${field.label}: ${isFilled ? "Complete" : "Incomplete"}`}
            />
          );
        })}
      </div>

      {/* Quick summary when collapsed */}
      {!expanded && (
        <div className="flex flex-wrap gap-2">
          {meddicFields.map((field) => {
            const value = formData[field.key as keyof typeof formData];
            return (
              <span
                key={field.key}
                className={`text-xs px-2 py-1 rounded font-medium ${
                  value
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {field.letter}
              </span>
            );
          })}
        </div>
      )}

      {/* Expanded form */}
      {expanded && (
        <div className="space-y-4">
          {meddicFields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                <span className="inline-block w-6 h-6 text-center leading-6 rounded bg-blue-100 text-blue-700 text-xs font-bold mr-2">
                  {field.letter}
                </span>
                {field.label}
              </label>
              <p className="text-xs text-gray-600 mb-2">{field.description}</p>
              <textarea
                value={formData[field.key as keyof typeof formData]}
                onChange={(e) =>
                  setFormData({ ...formData, [field.key]: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                rows={2}
                placeholder={field.placeholder}
              />
            </div>
          ))}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save MEDDIC"}
          </button>
        </div>
      )}
    </div>
  );
}
