"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DealFormProps {
  deal?: {
    id: string;
    dealName: string;
    clientCompanyName: string;
    dealValue: number;
    grossProfit: number;
    stage: string;
  };
}

const stages = [
  { value: "COURTING", label: "Courting" },
  { value: "REGISTERED", label: "Registered" },
  { value: "QUOTED", label: "Quoted" },
  { value: "WON", label: "Won" },
  { value: "CLOSED_LOST", label: "Closed/Lost" },
];

export default function DealForm({ deal }: DealFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    dealName: deal?.dealName || "",
    clientCompanyName: deal?.clientCompanyName || "",
    dealValue: deal?.dealValue?.toString() || "",
    grossProfit: deal?.grossProfit?.toString() || "",
    stage: deal?.stage || "COURTING",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = deal ? `/api/deals/${deal.id}` : "/api/deals";
      const method = deal ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealName: formData.dealName,
          clientCompanyName: formData.clientCompanyName,
          dealValue: parseFloat(formData.dealValue),
          grossProfit: parseFloat(formData.grossProfit),
          stage: formData.stage,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save deal");
      }

      const savedDeal = await response.json();
      router.push(`/deals/${savedDeal.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="dealName"
          className="block text-sm font-medium text-gray-700"
        >
          Deal Name
        </label>
        <input
          type="text"
          id="dealName"
          name="dealName"
          required
          value={formData.dealName}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="clientCompanyName"
          className="block text-sm font-medium text-gray-700"
        >
          Client Company Name
        </label>
        <input
          type="text"
          id="clientCompanyName"
          name="clientCompanyName"
          required
          value={formData.clientCompanyName}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="dealValue"
            className="block text-sm font-medium text-gray-700"
          >
            Deal Value ($)
          </label>
          <input
            type="number"
            id="dealValue"
            name="dealValue"
            required
            min="0"
            step="0.01"
            value={formData.dealValue}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="grossProfit"
            className="block text-sm font-medium text-gray-700"
          >
            Gross Profit ($)
          </label>
          <input
            type="number"
            id="grossProfit"
            name="grossProfit"
            required
            min="0"
            step="0.01"
            value={formData.grossProfit}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="stage"
          className="block text-sm font-medium text-gray-700"
        >
          Stage
        </label>
        <select
          id="stage"
          name="stage"
          value={formData.stage}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {stages.map((stage) => (
            <option key={stage.value} value={stage.value}>
              {stage.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? "Saving..." : deal ? "Update Deal" : "Create Deal"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
