
import api from "./api";
import type { Project } from "../types";

export interface ProjectCreate {
  name: string;
  description: string;
}

export interface ProjectUpdate {
  name: string;
  description: string;
}

const projectService = {
  async getProjects(): Promise<Project[]> {
    const response = await api.get<Project[]>("/projects");
    return response.data;
  },

  async createProject(data: ProjectCreate): Promise<Project> {
    const response = await api.post<Project>("/projects", data);
    return response.data;
  },

  async updateProject(
    projectId: number,
    data: ProjectUpdate
  ): Promise<Project> {
    const response = await api.put<Project>(
      `/projects/${projectId}`,
      data
    );

    return response.data;
  },

  async deleteProject(projectId: number): Promise<void> {
    await api.delete(`/projects/${projectId}`);
  },
};

export default projectService;
