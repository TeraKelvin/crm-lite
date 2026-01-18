"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ForecastingPanelProps {
  dealId: string;
  dealValue: number;
  initialData: {
    expectedCloseDate: string | null;
    probability: number;
    forecastCategory: string;
  };
}

const forecastCategories = [
  { value: "COMMIT", label: "Commit", color: "bg-green-100 text-green-700", description: "High confidence, verbal agreement" },
  { value: "BEST_CASE", label: "Best Case", color: "bg-blue-100 text-blue-700", description: "Strong opportunity, may close" },
  { value: "PIPELINE", label: "Pipeline", color: "bg-gray-100 text-gray-700", description: "Standard opportunity" },
  { value: "OMIT", label: "Omit", color: "bg-red-100 text-red-700", description: "Unlikely to close this period" },
];

const probabilityPresets = [10, 25, 50, 75, 90];

export default function ForecastingPanel({ dealId, dealValue, initialData }: ForecastingPanelProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    expectedCloseDate: initialData.expectedCloseDate || "",
    probability: initialData.probability,
    forecastCategory: initialData.forecastCategory,
  });

  const weightedValue = (dealValue * formData.probability) / 100;

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
      console.error("Error saving forecast:", error);
    } finally {
      setSaving(false);
    }
  };

  const getDaysUntilClose = () => {
    if (!formData.expectedCloseDate) return null;
    const closeDate = new Date(formData.expectedCloseDate);
    const today = new Date();
    const diffTime = closeDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilClose = getDaysUntilClose();

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecasting</h3>

      {/* Weighted Value Display */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-medium text-gray-600 uppercase">Weighted Value</p>
            <p className="text-2xl font-bold text-blue-700">
              ${weightedValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-gray-600 uppercase">Full Value</p>
            <p className="text-lg text-gray-700">
              ${dealValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>

      {/* Expected Close Date */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-900 mb-1">
          Expected Close Date
        </label>
        <input
          type="date"
          value={formData.expectedCloseDate}
          onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
        {daysUntilClose !== null && (
          <p className={`text-xs mt-1 ${
            daysUntilClose < 0 ? "text-red-600 font-medium" :
            daysUntilClose <= 7 ? "text-orange-600" :
            daysUntilClose <= 30 ? "text-yellow-600" : "text-gray-600"
          }`}>
            {daysUntilClose < 0
              ? `${Math.abs(daysUntilClose)} days overdue`
              : daysUntilClose === 0
              ? "Closing today"
              : `${daysUntilClose} days until close`}
          </p>
        )}
      </div>

      {/* Probability Slider */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-900 mb-1">
          Probability: {formData.probability}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={formData.probability}
          onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-2">
          {probabilityPresets.map((preset) => (
            <button
              key={preset}
              onClick={() => setFormData({ ...formData, probability: preset })}
              className={`text-xs px-2 py-1 rounded ${
                formData.probability === preset
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {preset}%
            </button>
          ))}
        </div>
      </div>

      {/* Forecast Category */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Forecast Category
        </label>
        <div className="grid grid-cols-2 gap-2">
          {forecastCategories.map((category) => (
            <button
              key={category.value}
              onClick={() => setFormData({ ...formData, forecastCategory: category.value })}
              className={`p-3 rounded-lg border-2 text-left ${
                formData.forecastCategory === category.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${category.color}`}>
                {category.label}
              </span>
              <p className="text-xs text-gray-600 mt-1">{category.description}</p>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Update Forecast"}
      </button>
    </div>
  );
}
