
import { FolderKanban, CalendarDays, Pencil, Trash2 } from "lucide-react";
import type { Project } from "../types";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  return (
    <div className="rounded-xl border border-gray-800 bg-[#111827] p-5 transition hover:border-blue-500/50">

      <div className="flex items-start justify-between">
        <div className="rounded-lg bg-blue-500/10 p-3 text-blue-400">
          <FolderKanban size={23} />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(project)}
            aria-label="Edit project"
            className="rounded-lg p-2 text-gray-400 hover:bg-blue-500/10 hover:text-blue-400"
          >
            <Pencil size={17} />
          </button>

          <button
            onClick={() => onDelete(project)}
            aria-label="Delete project"
            className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-white">
        {project.name}
      </h3>

      <p className="mt-2 min-h-10 text-sm leading-6 text-gray-400">
        {project.description || "No description provided."}
      </p>

      <div className="mt-5 flex items-center gap-2 border-t border-gray-800 pt-4 text-xs text-gray-500">
        <CalendarDays size={15} />
        Created {new Date(project.created_at).toLocaleDateString()}
      </div>
    </div>
  );
}
