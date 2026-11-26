
import { useEffect, useState, type FormEvent } from "react";
import { X, ListTodo } from "lucide-react";

import type {
  Task,
  TaskStatus,
  TaskPriority,
} from "../types";

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
  }) => Promise<void>;
}

export default function TaskModal({
  task,
  onClose,
  onSave,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("pending");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = task !== null;

  useEffect(() => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setStatus(task?.status ?? "pending");
    setPriority(task?.priority ?? "medium");
    setError("");
  }, [task]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (title.trim().length < 2) {
      setError("Task title must contain at least 2 characters.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onSave({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
      });

      onClose();
    } catch {
      setError("Unable to save task. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-700 bg-[#111827] p-6 shadow-2xl">

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400">
              <ListTodo size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                {isEditing ? "Edit Task" : "Create Task"}
              </h2>

              <p className="text-xs text-gray-400">
                {isEditing
                  ? "Update task information"
                  : "Add a new task to your project"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Task Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Configure Kubernetes"
              required
              minLength={2}
              maxLength={200}
              className="w-full rounded-lg border border-gray-700 bg-[#0b1120] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe this task..."
              rows={3}
              maxLength={3000}
              className="w-full resize-none rounded-lg border border-gray-700 bg-[#0b1120] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as TaskStatus)
                }
                className="w-full rounded-lg border border-gray-700 bg-[#0b1120] px-3 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Priority
              </label>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as TaskPriority)
                }
                className="w-full rounded-lg border border-gray-700 bg-[#0b1120] px-3 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-700 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Task"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
