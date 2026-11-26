
import api from "./api";
import type { Activity } from "../types";

const activityService = {
  async getMyActivities(limit = 50): Promise<Activity[]> {
    const response = await api.get<Activity[]>(
      `/activities/my-activities?limit=${limit}`
    );

    return response.data;
  },

  async getProjectActivities(
    projectId: number,
    limit = 50
  ): Promise<Activity[]> {
    const response = await api.get<Activity[]>(
      `/activities/projects/${projectId}?limit=${limit}`
    );

    return response.data;
  },
};

export default activityService;
