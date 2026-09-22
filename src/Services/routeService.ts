import api from './api';

// ============================================
// TYPES
// ============================================
export type StopStatus = 'pending' | 'completed' | 'skipped';

export type RouteStatus = 'pending' | 'in-progress' | 'completed' | 'delayed';

export interface RouteStop {
  id: string;
  routeId: string;
  sequence: number;
  address: string;
  suburb: string;
  latitude: number;
  longitude: number;
  status: StopStatus;
  completedAt?: string | null;
  skippedReason?: string | null;
  notes?: string | null;
  isComplaintStop: boolean;
  complaintType?: string | null;
  reportId?: string | null;
  beforePhoto?: string | null;
  afterPhoto?: string | null;
}

export interface Route {
  id: string;
  truckId: string;
  zone: string;
  suburb: string;
  scheduledDate: string;
  scheduledStart: string;
  scheduledEnd: string;
  estimatedDuration: number;
  status: RouteStatus;
  totalStops: number;
  completedStops: number;
  notes?: string | null;
  stops?: RouteStop[];
  truck?: {
    id: string;
    truckId: string;
    registrationNumber: string;
    zone: string;
  };
}

export interface CompleteStopResponse {
  message: string;
  stop: RouteStop;
  routeProgress: {
    completedStops: number;
    totalStops: number;
    progressPercent: number;
    routeStatus: RouteStatus;
  };
}

// ============================================
// ROUTE SERVICE
// ============================================
export const routeService = {
  // ----------------------------------------
  // GET TODAY'S ROUTE (driver)
  // ----------------------------------------
  getTodaysRoute: async (): Promise<{ route: Route }> => {
    const response = await api.get('/routes/today');
    return response.data;
  },

  // ----------------------------------------
  // GET ROUTE BY ID
  // ----------------------------------------
  getRouteById: async (id: string): Promise<{ route: Route }> => {
    const response = await api.get(`/routes/${id}`);
    return response.data;
  },

  // ----------------------------------------
  // COMPLETE A STOP
  // ----------------------------------------
  completeStop: async (
    routeId: string,
    stopId: string,
    data: {
      beforePhoto?: string;
      afterPhoto?: string;
      notes?: string;
    }
  ): Promise<CompleteStopResponse> => {
    const response = await api.patch(
      `/routes/${routeId}/stops/${stopId}/complete`,
      data
    );
    return response.data;
  },

  // ----------------------------------------
  // SKIP A STOP
  // ----------------------------------------
  skipStop: async (
    routeId: string,
    stopId: string,
    reason: string
  ): Promise<{ message: string; stop: RouteStop }> => {
    const response = await api.patch(
      `/routes/${routeId}/stops/${stopId}/skip`,
      { reason }
    );
    return response.data;
  },

  // ----------------------------------------
  // UPDATE STOP NOTES
  // ----------------------------------------
  updateStopNotes: async (
    routeId: string,
    stopId: string,
    notes: string
  ): Promise<{ message: string; stop: RouteStop }> => {
    const response = await api.patch(
      `/routes/${routeId}/stops/${stopId}/notes`,
      { notes }
    );
    return response.data;
  },

  // ----------------------------------------
  // UPDATE ROUTE STATUS
  // ----------------------------------------
  updateRouteStatus: async (
    routeId: string,
    status: RouteStatus
  ): Promise<{ message: string; route: Route }> => {
    const response = await api.patch(`/routes/${routeId}/status`, { status });
    return response.data;
  },
};