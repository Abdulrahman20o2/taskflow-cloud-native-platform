
export interface User {
  id: number;
  full_name: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  owner_id: number;
  created_at: string;
}

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed";

export type TaskPriority =
  | "low"
  | "medium"
  | "high";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_projects: number;
  total_tasks: number;
  pending_tasks: number;
  in_progress_tasks: number;
  completed_tasks: number;
  completion_rate: number;
}

export interface AuthToken {
  access_token: string;
  token_type: "bearer";
}
