import api from './api';

// ============================================
// TYPES
// ============================================
export interface KPIs {
  completionRate: number;
  fuelEfficiency: number;
  punctuality: number;
  citizenSatisfaction: number;
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  inProgressReports: number;
  totalCollections: number;
  totalTrucks: number;
  activeTrucks: number;
  availableTrucks: number;
  totalCitizens: number;
  totalDrivers: number;
  avgTruckCompletion: number;
}

export interface FleetTruck {
  id: string;
  truckId: string;
  registrationNumber: string;
  driver: {
    id: string;
    name: string;
    email: string;
  } | null;
  driverName: string;
  zone: string;
  status: string;
  completion: number;
  capacity: number;
  lastUpdate: string;
}

export interface RoutePerformance {
  id: number;
  route: string;
  driver: string;
  truckId: string;
  duration: string;
  stops: number;
  completed: number;
  efficiency: number;
  status: string;
}

export interface RoutePerformanceResponse {
  routes: RoutePerformance[];
  stats: {
    totalRoutes: number;
    completedRoutes: number;
    avgEfficiency: number;
    avgDuration: number;
  };
}

// ============================================
// KPI SERVICE
// ============================================
export const kpiService = {
  // ----------------------------------------
  // GET KPIs
  // ----------------------------------------
  getKPIs: async (): Promise<{ kpis: KPIs }> => {
    const response = await api.get('/kpis');
    return response.data;
  },

  // ----------------------------------------
  // GET FLEET STATUS
  // ----------------------------------------
  getFleetStatus: async (): Promise<{ fleet: FleetTruck[] }> => {
    const response = await api.get('/kpis/fleet');
    return response.data;
  },

  // ----------------------------------------
  // GET ROUTE PERFORMANCE
  // ----------------------------------------
  getRoutePerformance: async (): Promise<RoutePerformanceResponse> => {
    const response = await api.get('/kpis/routes');
    return response.data;
  },
};