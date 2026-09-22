import api from './api';

// ============================================
// TYPES
// ============================================
export interface UploadResponse {
  message: string;
  url: string;
  path: string;
}

export interface MultipleUploadResponse {
  message: string;
  urls: string[];
  paths: string[];
  errors?: string[];
}

export interface BeforeAfterResponse {
  message: string;
  beforePhoto?: string;
  afterPhoto?: string;
  errors?: string[];
}

// ============================================
// UPLOAD SERVICE
// ============================================
export const uploadService = {
  // ----------------------------------------
  // UPLOAD SINGLE FILE
  // ----------------------------------------
  uploadSingle: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // ----------------------------------------
  // UPLOAD MULTIPLE FILES (max 5)
  // ----------------------------------------
  uploadMultiple: async (
    files: File[]
  ): Promise<MultipleUploadResponse> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await api.post<MultipleUploadResponse>(
      '/upload/multiple',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // ----------------------------------------
  // UPLOAD BEFORE/AFTER PHOTOS (driver)
  // ----------------------------------------
  uploadBeforeAfter: async (
    beforePhoto?: File,
    afterPhoto?: File
  ): Promise<BeforeAfterResponse> => {
    const formData = new FormData();
    if (beforePhoto) formData.append('beforePhoto', beforePhoto);
    if (afterPhoto) formData.append('afterPhoto', afterPhoto);

    const response = await api.post<BeforeAfterResponse>(
      '/upload/before-after',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // ----------------------------------------
  // DELETE FILE
  // ----------------------------------------
  deleteFile: async (fileUrl: string): Promise<{ message: string }> => {
    const response = await api.delete('/upload', {
      data: { fileUrl },
    });
    return response.data;
  },
};