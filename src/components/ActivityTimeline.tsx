"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

interface ActivityTimelineProps {
  activities: Activity[];
}

const activityIcons: Record<string, { icon: string; color: string; bg: string }> = {
  CALL: { icon: "📞", color: "text-green-600", bg: "bg-green-100" },
  EMAIL: { icon: "📧", color: "text-blue-600", bg: "bg-blue-100" },
  MEETING: { icon: "🤝", color: "text-purple-600", bg: "bg-purple-100" },
  DEMO: { icon: "💻", color: "text-orange-600", bg: "bg-orange-100" },
  NOTE: { icon: "📝", color: "text-gray-600", bg: "bg-gray-100" },
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDaysUntilDue(dateString: string) {
  const due = new Date(dateString);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (activityId: string) => {
    if (!confirm("Delete this activity?")) return;

    setDeletingId(activityId);
    try {
      const response = await fetch(`/api/activities/${activityId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete activity:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-4xl mb-2">📋</p>
        <p>No activities logged yet.</p>
        <p className="text-sm">Start tracking your interactions with this deal.</p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, idx) => {
          const typeInfo = activityIcons[activity.type] || activityIcons.NOTE;
          const isLast = idx === activities.length - 1;
          const daysUntilDue = activity.nextStepsDue
            ? getDaysUntilDue(activity.nextStepsDue)
            : null;

          return (
            <li key={activity.id}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute left-5 top-10 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start space-x-3">
                  <div
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full ${typeInfo.bg}`}
                  >
                    <span className="text-lg">{typeInfo.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {activity.subject}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(activity.activityDate)} at{" "}
                          {formatTime(activity.activityDate)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        disabled={deletingId === activity.id}
                        className="text-gray-400 hover:text-red-500 text-sm"
                      >
                        {deletingId === activity.id ? "..." : "×"}
                      </button>
                    </div>
                    {activity.notes && (
                      <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">
                        {activity.notes}
                      </p>
                    )}
                    {activity.nextSteps && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm font-medium text-yellow-800">
                          Next Steps:
                        </p>
                        <p className="text-sm text-yellow-700">{activity.nextSteps}</p>
                        {activity.nextStepsDue && (
                          <p
                            className={`text-xs mt-1 font-medium ${
                              daysUntilDue !== null && daysUntilDue < 0
                                ? "text-red-600"
                                : daysUntilDue !== null && daysUntilDue <= 3
                                ? "text-orange-600"
                                : "text-yellow-600"
                            }`}
                          >
                            Due: {formatDate(activity.nextStepsDue)}
                            {daysUntilDue !== null && daysUntilDue < 0 && " (Overdue!)"}
                            {daysUntilDue !== null && daysUntilDue === 0 && " (Today!)"}
                            {daysUntilDue !== null && daysUntilDue === 1 && " (Tomorrow)"}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
