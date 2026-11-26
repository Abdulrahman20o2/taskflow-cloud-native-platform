
import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  ListTodo,
  RefreshCw,
  Pencil,
  Trash2,
  CalendarDays,
} from "lucide-react";
import axios from "axios";

import type {
  Project,
  Task,
  TaskStatus,
  TaskPriority,
} from "../types";

import projectService from "../services/projectService";
import taskService from "../services/taskService";
import TaskModal from "../components/TaskModal";

const columns: {
  status: TaskStatus;
  title: string;
  color: string;
  dot: string;
}[] = [
  {
    status: "pending",
    title: "Pending",
    color: "text-amber-400",
    dot: "bg-amber-400",
  },
  {
    status: "in_progress",
    title: "In Progress",
    color: "text-blue-400",
    dot: "bg-blue-400",
  },
  {
    status: "completed",
    title: "Completed",
    color: "text-green-400",
    dot: "bg-green-400",
  },
];

const priorityStyles: Record<TaskPriority, string> = {
  low: "bg-gray-500/10 text-gray-400",
  medium: "bg-blue-500/10 text-blue-400",
  high: "bg-red-500/10 text-red-400",
};

export default function Tasks() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoadingProjects(true);
      setError("");

      const data = await projectService.getProjects();

      setProjects(data);

      if (data.length > 0) {
        setSelectedProjectId((current) => {
          const stillExists = data.some(
            (project) => String(project.id) === current
          );

          return stillExists ? current : String(data[0].id);
        });
      } else {
        setSelectedProjectId("");
        setTasks([]);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load projects.");
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  const loadTasks = useCallback(async (projectId: number) => {
    try {
      setLoadingTasks(true);
      setError("");

      const data = await taskService.getTasks(projectId);

      setTasks(data);
    } catch (err) {
      console.error(err);
      setTasks([]);
      setError("Unable to load tasks for this project.");
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (selectedProjectId) {
      loadTasks(Number(selectedProjectId));
    } else {
      setTasks([]);
    }
  }, [selectedProjectId, loadTasks]);

  function openCreateModal() {
    setSelectedTask(null);
    setModalOpen(true);
  }

  function openEditModal(task: Task) {
    setSelectedTask(task);
    setModalOpen(true);
  }

  async function handleSave(data: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
  }) {
    if (selectedTask) {
      await taskService.updateTask(selectedTask.id, data);
    } else {
      await taskService.createTask(
        Number(selectedProjectId),
        data
      );
    }

    await loadTasks(Number(selectedProjectId));
  }

  async function handleDelete(task: Task) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await taskService.deleteTask(task.id);

      await loadTasks(Number(selectedProjectId));
    } catch (err) {
      console.error("Task deletion error:", err);

      if (
        axios.isAxiosError(err) &&
        err.response?.status === 403
      ) {
        setError("You do not have permission to delete this task.");
      } else {
        setError("Unable to delete task. Please try again.");
      }
    }
  }

  function getTasksByStatus(status: TaskStatus) {
    return tasks.filter((task) => task.status === status);
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (loadingProjects) {
    return (
      <div className="py-16 text-center text-gray-400">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">
            Task Management
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Organize and track your project tasks.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          disabled={!selectedProjectId}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={19} />
          New Task
        </button>
      </div>

      {/* Project Selector */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-800 bg-[#111827] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-white">
            Select Project
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Choose a project to view its tasks.
          </p>
        </div>

        <select
          value={selectedProjectId}
          onChange={(event) => setSelectedProjectId(event.target.value)}
          disabled={projects.length === 0}
          className="w-full rounded-lg border border-gray-700 bg-[#0b1120] px-4 py-3 text-sm text-white outline-none focus:border-blue-500 sm:max-w-xs"
        >
          {projects.length === 0 && (
            <option value="">No projects available</option>
          )}

          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <p>{error}</p>

          <button
            onClick={() => {
              if (selectedProjectId) {
                loadTasks(Number(selectedProjectId));
              } else {
                loadProjects();
              }
            }}
            className="flex shrink-0 items-center gap-2"
          >
            <RefreshCw size={15} />
            Retry
          </button>
        </div>
      )}

      {/* No Projects */}
      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-700 bg-[#111827] px-6 py-16 text-center">
          <FolderKanbanIcon />

          <h2 className="mt-4 text-lg font-semibold text-white">
            No Projects Available
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Create a project before adding tasks.
          </p>
        </div>
      ) : (

        <>
          {/* Task Summary */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {columns.map((column) => (
              <div
                key={column.status}
                className="rounded-xl border border-gray-800 bg-[#111827] p-4"
              >
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${column.dot}`} />

                  <p className="text-sm text-gray-400">
                    {column.title}
                  </p>
                </div>

                <p className="mt-3 text-2xl font-bold text-white">
                  {getTasksByStatus(column.status).length}
                </p>
              </div>
            ))}
          </div>

          {/* Kanban Board */}
          {loadingTasks ? (
            <div className="py-16 text-center text-gray-400">
              Loading tasks...
            </div>
          ) : (
            <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-3">
              {columns.map((column) => {
                const columnTasks = getTasksByStatus(column.status);

                return (
                  <section
                    key={column.status}
                    className="min-w-0 rounded-xl border border-gray-800 bg-[#111827] p-4"
                  >
                    {/* Column Heading */}
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${column.dot}`}
                        />

                        <h2 className={`font-semibold ${column.color}`}>
                          {column.title}
                        </h2>
                      </div>

                      <span className="rounded-md bg-gray-800 px-2.5 py-1 text-xs text-gray-300">
                        {columnTasks.length}
                      </span>
                    </div>

                    {/* Task Cards */}
                    <div className="space-y-3">
                      {columnTasks.map((task) => (
                        <article
                          key={task.id}
                          className="rounded-lg border border-gray-700 bg-[#0b1120] p-4 transition hover:border-gray-600"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium leading-6 text-white">
                              {task.title}
                            </h3>

                            <div className="flex shrink-0 gap-1">
                              <button
                                onClick={() => openEditModal(task)}
                                aria-label="Edit task"
                                className="rounded-md p-1.5 text-gray-400 hover:bg-blue-500/10 hover:text-blue-400"
                              >
                                <Pencil size={15} />
                              </button>

                              <button
                                onClick={() => handleDelete(task)}
                                aria-label="Delete task"
                                className="rounded-md p-1.5 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>

                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-400">
                            {task.description || "No description provided."}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                            <span
                              className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize ${priorityStyles[task.priority]}`}
                            >
                              {task.priority} priority
                            </span>

                            <span className="flex items-center gap-1.5 text-xs text-gray-500">
                              <CalendarDays size={13} />
                              {formatDate(task.created_at)}
                            </span>
                          </div>

                          {/* Quick Status Change */}
                          <div className="mt-4 border-t border-gray-800 pt-3">
                            <label className="mb-2 block text-xs text-gray-500">
                              Change Status
                            </label>

                            <select
                              value={task.status}
                              onChange={async (event) => {
                                const newStatus =
                                  event.target.value as TaskStatus;

                                try {
                                  await taskService.updateTask(task.id, {
                                    status: newStatus,
                                  });

                                  await loadTasks(Number(selectedProjectId));
                                } catch (err) {
                                  console.error(err);
                                  setError("Unable to update task status.");
                                }
                              }}
                              className="w-full rounded-md border border-gray-700 bg-[#111827] px-3 py-2 text-xs text-gray-300 outline-none focus:border-blue-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </article>
                      ))}

                      {columnTasks.length === 0 && (
                        <div className="rounded-lg border border-dashed border-gray-700 px-3 py-8 text-center">
                          <p className="text-xs text-gray-500">
                            No tasks in this column.
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <TaskModal
          task={selectedTask}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function FolderKanbanIcon() {
  return (
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
      <ListTodo size={26} />
    </div>
  );
}
