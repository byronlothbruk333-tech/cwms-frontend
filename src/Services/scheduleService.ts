import api from './api';

// ============================================
// TYPES
// ============================================
export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface Schedule {
  zone: string;
  electorate: string;
  suburb?: string;
  days: DayOfWeek[];
  timeWindow: {
    start: string;
    end: string;
  };
  notes: string;
  nextCollection: string;
}

export interface SuburbsResponse {
  count: number;
  suburbs: string[];
  suburbZones: Record<string, string>;
}

// ============================================
// SCHEDULE SERVICE
// ============================================
export const scheduleService = {
  getSuburbs: async (): Promise<SuburbsResponse> => {
    const response = await api.get<SuburbsResponse>('/schedules/suburbs');
    return response.data;
  },

  getSuburbSchedule: async (suburb: string): Promise<Schedule> => {
    const response = await api.get<Schedule>(
      `/schedules/suburb/${encodeURIComponent(suburb)}`
    );
    return response.data;
  },

  getZoneSchedule: async (
    zone: string
  ): Promise<Schedule & { suburbs: string[] }> => {
    const response = await api.get(
      `/schedules/zone/${encodeURIComponent(zone)}`
    );
    return response.data;
  },

  getAllSchedules: async (): Promise<{
    count: number;
    schedules: (Schedule & { suburbs: string[] })[];
  }> => {
    const response = await api.get('/schedules');
    return response.data;
  },
};