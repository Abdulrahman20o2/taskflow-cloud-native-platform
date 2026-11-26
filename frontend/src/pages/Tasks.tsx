import { CheckSquare } from "lucide-react";

export default function Tasks() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <CheckSquare className="text-purple-400" size={28} />

        <h1 className="text-3xl font-bold text-white">
          Tasks
        </h1>
      </div>

      <p className="mt-3 text-gray-400">
        Track and manage tasks across your projects.
      </p>

      <div className="mt-8 rounded-xl border border-gray-800 bg-[#111827] p-10 text-center">
        <h2 className="text-lg font-semibold text-white">
          Task Management
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          Task management and filtering will be implemented in the next phase.
        </p>
      </div>
    </div>
  );
}