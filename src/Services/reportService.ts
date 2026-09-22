import api from './api';

// ============================================
// TYPES
// ============================================
export type IssueType =
  | 'missed-collection'
  | 'illegal-dumping'
  | 'overflowing-bin'
  | 'other';

export type ReportStatus = 'pending' | 'in-progress' | 'resolved' | 'rejected';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface ReportData {
  issueType: IssueType;
  description: string;
  address: string;
  latitude?: number;
  longitude?: number;
  photos?: string[];
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface Report extends ReportData {
  id: string;
  citizenId: string;
  status: ReportStatus;
  priority: Priority;
  assignedTo?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  citizen?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
}

export interface ReportStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  rejected: number;
}

export interface Comment {
  id: string;
  reportId: string;
  userId: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

// ============================================
// REPORT SERVICE
// ============================================
export const reportService = {
  // ----------------------------------------
  // CREATE REPORT
  // ----------------------------------------
  createReport: async (
    data: ReportData
  ): Promise<{ message: string; report: Report }> => {
    const response = await api.post('/reports', data);
    return response.data;
  },

  // ----------------------------------------
  // GET MY REPORTS (citizen)
  // ----------------------------------------
  getMyReports: async (): Promise<{ count: number; reports: Report[] }> => {
    const response = await api.get('/reports/my');
    return response.data;
  },

  // ----------------------------------------
  // GET MY STATS (citizen)
  // ----------------------------------------
  getMyStats: async (): Promise<{ stats: ReportStats }> => {
    const response = await api.get('/reports/stats');
    return response.data;
  },

  // ----------------------------------------
  // GET REPORT BY ID
  // ----------------------------------------
  getReportById: async (id: string): Promise<{ report: Report }> => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  // ----------------------------------------
  // GET ALL REPORTS (admin)
  // ----------------------------------------
  getAllReports: async (filters?: {
    status?: string;
    priority?: string;
    issueType?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ total: number; reports: Report[] }> => {
    const response = await api.get('/reports', { params: filters });
    return response.data;
  },

  // ----------------------------------------
  // GET REPORT COUNTS (admin)
  // ----------------------------------------
  getCounts: async (): Promise<{
    counts: {
      total: number;
      pending: number;
      inProgress: number;
      resolved: number;
      rejected: number;
    };
  }> => {
    const response = await api.get('/reports/counts');
    return response.data;
  },

  // ----------------------------------------
  // UPDATE REPORT STATUS (admin)
  // ----------------------------------------
  updateReportStatus: async (
    id: string,
    status: ReportStatus,
    assignedTo?: string
  ): Promise<{ message: string; report: Report }> => {
    const response = await api.patch(`/reports/${id}/status`, {
      status,
      assignedTo,
    });
    return response.data;
  },

  // ----------------------------------------
  // UPDATE REPORT (owner on pending, or admin)
  // ----------------------------------------
  updateReport: async (
    id: string,
    data: Partial<ReportData>
  ): Promise<{ message: string; report: Report }> => {
    const response = await api.put(`/reports/${id}`, data);
    return response.data;
  },

  // ----------------------------------------
  // DELETE REPORT
  // ----------------------------------------
  deleteReport: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },

  // ----------------------------------------
  // GET COMMENTS ON A REPORT
  // ----------------------------------------
  getComments: async (
    reportId: string
  ): Promise<{ count: number; comments: Comment[] }> => {
    const response = await api.get(`/reports/${reportId}/comments`);
    return response.data;
  },

  // ----------------------------------------
  // ADD COMMENT
  // ----------------------------------------
  addComment: async (
    reportId: string,
    content: string,
    isInternal: boolean = false
  ): Promise<{ message: string; comment: Comment }> => {
    const response = await api.post(`/reports/${reportId}/comments`, {
      content,
      isInternal,
    });
    return response.data;
  },
};