
import { useEffect, useState } from "react";
import {
  FolderKanban,
  ListTodo,
  Clock,
  CheckCircle2,
  Activity as ActivityIcon,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import api from "../services/api";
import StatCard from "../components/StatCard";

import type {
  DashboardStats,
  Activity,
} from "../types";

const chartColors = ["#f59e0b", "#3b82f6", "#22c55e"];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [statsResponse, activitiesResponse] =
          await Promise.all([
            api.get<DashboardStats>("/dashboard/stats"),
            api.get<Activity[]>("/activities/my-activities?limit=5"),
          ]);

        setStats(statsResponse.data);
        setActivities(activitiesResponse.data);
      } catch (err) {
        console.error("Dashboard loading error:", err);
        setError(
          "Unable to load dashboard data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="animate-pulse text-gray-400">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-red-400">
        {error || "Dashboard data is unavailable."}
      </div>
    );
  }

  const chartData = [
    { name: "Pending", value: stats.pending_tasks },
    { name: "In Progress", value: stats.in_progress_tasks },
    { name: "Completed", value: stats.completed_tasks },
  ];

  const hasTasks = stats.total_tasks > 0;

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="space-y-8">

      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold text-white lg:text-3xl">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Here's an overview of your workspace and team activity.
        </p>
      </div>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={stats.total_projects}
          icon={FolderKanban}
          color="bg-blue-500/10 text-blue-400"
          description="Projects you can access"
        />

        <StatCard
          title="Total Tasks"
          value={stats.total_tasks}
          icon={ListTodo}
          color="bg-purple-500/10 text-purple-400"
          description="Tasks across your projects"
        />

        <StatCard
          title="In Progress"
          value={stats.in_progress_tasks}
          icon={Clock}
          color="bg-amber-500/10 text-amber-400"
          description="Tasks currently being worked on"
        />

        <StatCard
          title="Completed"
          value={stats.completed_tasks}
          icon={CheckCircle2}
          color="bg-green-500/10 text-green-400"
          description="Successfully completed tasks"
        />
      </section>

      {/* Charts and Completion */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        <div className="rounded-xl border border-gray-800 bg-[#111827] p-6 xl:col-span-2">
          <div className="mb-6">
            <h2 className="font-semibold text-white">
              Tasks Overview
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Distribution of tasks by status
            </p>
          </div>

          {hasTasks ? (
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <div className="h-64 w-full sm:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={chartColors[index]}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full space-y-5 sm:w-1/2">
                {chartData.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: chartColors[index],
                        }}
                      />

                      <span className="text-sm text-gray-400">
                        {item.name}
                      </span>
                    </div>

                    <span className="font-semibold text-white">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-center">
              <p className="text-sm text-gray-500">
                No tasks available yet. Create a project and add tasks to see your chart.
              </p>
            </div>
          )}
        </div>

        {/* Completion Rate */}
        <div className="rounded-xl border border-gray-800 bg-[#111827] p-6">
          <h2 className="font-semibold text-white">
            Completion Rate
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Overall task progress
          </p>

          <div className="mt-10 flex flex-col items-center">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-12 border-gray-700">
              <div
                className="absolute -inset-3 rounded-full border-12 border-green-500"
                style={{
                  clipPath: `inset(0 ${100 - Math.min(stats.completion_rate, 100)}% 0 0)`,
                }}
              />

              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {Math.round(stats.completion_rate)}%
                </p>

                <p className="text-xs text-gray-400">
                  Completed
                </p>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-400">
              {stats.completed_tasks} out of {stats.total_tasks} tasks completed
            </p>
          </div>
        </div>
      </section>

      {/* Recent Activities */}
      <section className="rounded-xl border border-gray-800 bg-[#111827] p-6">
        <div className="mb-6 flex items-center gap-3">
          <ActivityIcon className="text-blue-400" size={21} />

          <div>
            <h2 className="font-semibold text-white">
              Recent Activities
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Latest updates from your workspace
            </p>
          </div>
        </div>

        {activities.length > 0 ? (
          <div className="space-y-5">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-4 border-b border-gray-800 pb-5 last:border-0 last:pb-0"
              >
                <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-200">
                    {activity.description}
                  </p>

                  <p className="mt-2 text-xs text-gray-500">
                    {activity.action.replaceAll("_", " ")}
                    {" · "}
                    {formatDate(activity.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-gray-500">
            No recent activities yet.
          </p>
        )}
      </section>
    </div>
  );
}
