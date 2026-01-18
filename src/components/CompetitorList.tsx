"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Competitor {
  id: string;
  name: string;
  strengths: string | null;
  weaknesses: string | null;
  status: string;
  notes: string | null;
}

interface CompetitorListProps {
  competitors: Competitor[];
  dealId: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Active", color: "bg-red-100 text-red-700" },
  ELIMINATED: { label: "Eliminated", color: "bg-green-100 text-green-700" },
  UNKNOWN: { label: "Unknown", color: "bg-gray-100 text-gray-700" },
};

export default function CompetitorList({ competitors, dealId }: CompetitorListProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    strengths: "",
    weaknesses: "",
    status: "ACTIVE",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/deals/${dealId}/competitors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          name: "",
          strengths: "",
          weaknesses: "",
          status: "ACTIVE",
          notes: "",
        });
        setShowForm(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Error adding competitor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (competitorId: string) => {
    if (!confirm("Remove this competitor?")) return;

    try {
      await fetch(`/api/competitors/${competitorId}`, { method: "DELETE" });
      router.refresh();
    } catch (error) {
      console.error("Error deleting competitor:", error);
    }
  };

  const handleStatusChange = async (competitorId: string, newStatus: string) => {
    try {
      await fetch(`/api/competitors/${competitorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } catch (error) {
      console.error("Error updating competitor:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Competitors ({competitors.length})
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showForm ? "Cancel" : "+ Add Competitor"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Competitor Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Competitor Inc."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Their Strengths
              </label>
              <textarea
                value={formData.strengths}
                onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                rows={2}
                placeholder="What they do well..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Their Weaknesses
              </label>
              <textarea
                value={formData.weaknesses}
                onChange={(e) => setFormData({ ...formData, weaknesses: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                rows={2}
                placeholder="Where we can win..."
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="ACTIVE">Active - Still competing</option>
              <option value="ELIMINATED">Eliminated - No longer in deal</option>
              <option value="UNKNOWN">Unknown - Unclear status</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              rows={2}
              placeholder="Competitive strategy notes..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Competitor"}
          </button>
        </form>
      )}

      {competitors.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No competitors tracked yet.
        </p>
      ) : (
        <div className="space-y-3">
          {competitors.map((competitor) => {
            const statusInfo = statusLabels[competitor.status] || statusLabels.UNKNOWN;
            return (
              <div
                key={competitor.id}
                className={`p-3 rounded-lg border ${
                  competitor.status === "ELIMINATED"
                    ? "border-green-200 bg-green-50"
                    : competitor.status === "ACTIVE"
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">{competitor.name}</span>
                      <select
                        value={competitor.status}
                        onChange={(e) => handleStatusChange(competitor.id, e.target.value)}
                        className={`text-xs px-2 py-0.5 rounded border-0 ${statusInfo.color}`}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="ELIMINATED">Eliminated</option>
                        <option value="UNKNOWN">Unknown</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {competitor.strengths && (
                        <div>
                          <span className="font-medium text-red-600">Strengths: </span>
                          <span className="text-gray-600">{competitor.strengths}</span>
                        </div>
                      )}
                      {competitor.weaknesses && (
                        <div>
                          <span className="font-medium text-green-600">Weaknesses: </span>
                          <span className="text-gray-600">{competitor.weaknesses}</span>
                        </div>
                      )}
                    </div>
                    {competitor.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">{competitor.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(competitor.id)}
                    className="text-gray-400 hover:text-red-500 ml-2"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
