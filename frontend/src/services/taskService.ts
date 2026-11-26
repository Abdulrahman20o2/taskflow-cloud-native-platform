
import api from "./api";
import type { Task, TaskStatus, TaskPriority } from "../types";

export interface TaskCreate {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

const taskService = {
  async getTasks(projectId: number): Promise<Task[]> {
    const response = await api.get<Task[]>(
      `/projects/${projectId}/tasks`
    );

    return response.data;
  },

  async createTask(
    projectId: number,
    data: TaskCreate
  ): Promise<Task> {
    const response = await api.post<Task>(
      `/projects/${projectId}/tasks`,
      data
    );

    return response.data;
  },

  async updateTask(
    taskId: number,
    data: TaskUpdate
  ): Promise<Task> {
    const response = await api.put<Task>(
      `/tasks/${taskId}`,
      data
    );

    return response.data;
  },

  async deleteTask(taskId: number): Promise<void> {
    await api.delete(`/tasks/${taskId}`);
  },
};

export default taskService;
