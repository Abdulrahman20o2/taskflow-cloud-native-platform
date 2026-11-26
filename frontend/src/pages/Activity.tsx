
import { useEffect, useState } from "react";
import {
  Activity as ActivityIcon,
  FolderKanban,
  ListTodo,
  Pencil,
  Trash2,
  RefreshCw,
  Clock,
} from "lucide-react";

import type { Activity } from "../types";
import activityService from "../services/activityService";

function getActivityIcon(action: string) {
  if (action.includes("project")) {
    if (action.includes("deleted")) return Trash2;
    if (action.includes("updated")) return Pencil;
    return FolderKanban;
  }

  if (action.includes("task")) {
    if (action.includes("deleted")) return Trash2;
    if (action.includes("updated")) return Pencil;
    return ListTodo;
  }

  return ActivityIcon;
}

function getActivityColor(action: string) {
  if (action.includes("deleted")) {
    return "bg-red-500/10 text-red-400";
  }

  if (action.includes("updated")) {
    return "bg-amber-500/10 text-amber-400";
  }

  if (action.includes("created")) {
    return "bg-green-500/10 text-green-400";
  }

  return "bg-blue-500/10 text-blue-400";
}

function formatDate(date: string) {
  return new Date(date).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Activity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadActivities() {
    try {
      setLoading(true);
      setError("");

      const data = await activityService.getMyActivities(50);
      setActivities(data);
    } catch (err) {
      console.error("Activity loading error:", err);
      setError("Unable to load activities. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadActivities();
  }, []);

  return (
    <div className="space-y-8">

      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">
            Activity Log
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Keep track of changes and updates in your workspace.
          </p>
        </div>

        <button
          onClick={loadActivities}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-700 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-gray-800 bg-[#111827] p-5">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
            <ActivityIcon size={25} />
          </div>

          <div>
            <p className="text-sm text-gray-400">
              Recorded Activities
            </p>

            <p className="mt-1 text-2xl font-bold text-white">
              {activities.length}
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <p>{error}</p>

          <button
            onClick={loadActivities}
            className="flex items-center gap-2"
          >
            <RefreshCw size={15} />
            Retry
          </button>
        </div>
      )}

      {/* Activity List */}
      <section className="rounded-xl border border-gray-800 bg-[#111827] p-5 sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <Clock className="text-blue-400" size={21} />

          <h2 className="font-semibold text-white">
            Recent Updates
          </h2>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-400">
            Loading activities...
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-5">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.action);

              return (
                <div
                  key={activity.id}
                  className="flex gap-4 border-b border-gray-800 pb-5 last:border-0 last:pb-0"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${getActivityColor(activity.action)}`}
                  >
                    <Icon size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-6 text-gray-200">
                      {activity.description}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span className="capitalize">
                        {activity.action.replaceAll("_", " ")}
                      </span>

                      <span>•</span>

                      <span>
                        {formatDate(activity.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center">
            <ActivityIcon
              size={40}
              className="mx-auto text-gray-600"
            />

            <h3 className="mt-4 font-medium text-white">
              No Activities Yet
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              Your project and task updates will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
