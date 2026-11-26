
import { useEffect, useState } from "react";
import { Activity, CheckCircle2, Cloud } from "lucide-react";
import api from "./services/api";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/health")
      .then((response) => {
        setBackendStatus(response.data.status);
      })
      .catch(() => {
        setBackendStatus("Unavailable");
        setError("Could not connect to TaskFlow API");
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#0b1120] text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-2">
            <Cloud size={24} />
          </div>

          <span className="text-xl font-bold">
            TaskFlow
          </span>
        </div>

        <span className="text-sm text-gray-400">
          Cloud-Native Team Platform
        </span>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
          <Activity size={16} />
          Development Environment
        </div>

        <h1 className="max-w-3xl text-5xl font-bold leading-tight">
          Manage your team's work.
          <span className="block text-blue-400">
            Build better projects.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
          TaskFlow brings your projects, tasks, and team
          activities together in one organized workspace.
        </p>

        <div className="mt-12 max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-400" />

            <h2 className="font-semibold">
              Backend Connection
            </h2>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            API Status:
            <span className="ml-2 font-semibold text-white">
              {backendStatus}
            </span>
          </p>

          {error && (
            <p className="mt-3 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
