
import { useCallback, useEffect, useState } from "react";
import { Plus, FolderKanban, RefreshCw } from "lucide-react";
import axios from "axios";

import type { Project } from "../types";
import { useAuth } from "../context/AuthContext";
import projectService from "../services/projectService";

import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";

export default function Projects() {
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err) {
      console.error("Projects loading error:", err);

      setError("Unable to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  function openCreateModal() {
    setSelectedProject(null);
    setModalOpen(true);
  }

  function openEditModal(project: Project) {
    setSelectedProject(project);
    setModalOpen(true);
  }

  async function handleSave(data: {
    name: string;
    description: string;
  }) {
    if (selectedProject) {
      await projectService.updateProject(
        selectedProject.id,
        data
      );
    } else {
      await projectService.createProject(data);
    }

    await loadProjects();
  }

  async function handleDelete(project: Project) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await projectService.deleteProject(project.id);

      await loadProjects();
    } catch (err) {
      console.error("Project deletion error:", err);

      if (
        axios.isAxiosError(err) &&
        err.response?.status === 403
      ) {
        setError("Only the project owner can delete this project.");
      } else {
        setError("Unable to delete project. Please try again.");
      }
    }
  }

  return (
    <div className="space-y-8">

      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">
            Projects
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Manage your workspace projects and teams.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          <Plus size={19} />
          New Project
        </button>
      </div>

      {/* Project Summary */}
      <div className="flex items-center gap-4 rounded-xl border border-gray-800 bg-[#111827] p-5">
        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
          <FolderKanban size={25} />
        </div>

        <div>
          <p className="text-sm text-gray-400">
            Total Projects
          </p>

          <p className="text-2xl font-bold text-white">
            {projects.length}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <p>{error}</p>

          <button
            onClick={loadProjects}
            className="flex shrink-0 items-center gap-2"
          >
            <RefreshCw size={15} />
            Retry
          </button>
        </div>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="py-16 text-center text-gray-400">
          Loading projects...
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const isOwner = project.owner_id === user?.id;

            return (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={
                  isOwner
                    ? openEditModal
                    : () => setError(
                        "Only the project owner can edit this project."
                      )
                }
                onDelete={
                  isOwner
                    ? handleDelete
                    : () => setError(
                        "Only the project owner can delete this project."
                      )
                }
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-700 bg-[#111827] px-6 py-16 text-center">
          <FolderKanban
            size={42}
            className="mx-auto text-gray-500"
          />

          <h2 className="mt-4 text-lg font-semibold text-white">
            No Projects Yet
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Create your first project to get started.
          </p>

          <button
            onClick={openCreateModal}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500"
          >
            Create Your First Project
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
