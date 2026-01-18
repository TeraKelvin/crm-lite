"use client";

import { formatCurrency, formatPercent } from "@/lib/utils";

interface QuotaProgressProps {
  ytdClosed: number;
  salesGoal: number;
}

export default function QuotaProgress({
  ytdClosed,
  salesGoal,
}: QuotaProgressProps) {
  const percentage = salesGoal > 0 ? (ytdClosed / salesGoal) * 100 : 0;
  const cappedPercentage = Math.min(percentage, 100);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Quota Attainment
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">YTD Closed</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(ytdClosed)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Annual Goal</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(salesGoal)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${
              percentage >= 100
                ? "bg-green-500"
                : percentage >= 75
                ? "bg-blue-500"
                : percentage >= 50
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${cappedPercentage}%` }}
          />
        </div>
        <div className="text-center">
          <span
            className={`text-2xl font-bold ${
              percentage >= 100
                ? "text-green-600"
                : percentage >= 75
                ? "text-blue-600"
                : percentage >= 50
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {formatPercent(percentage)}
          </span>
          <span className="text-gray-500 text-sm ml-1">of goal</span>
        </div>
      </div>
    </div>
  );
}
