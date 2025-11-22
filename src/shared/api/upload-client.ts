import { graphqlClient } from '@/shared/lib/graphql-client';

interface MediaUploadResponse {
  success: boolean;
  data: {
    id: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    url: string;
    thumbnailUrl?: string;
    width?: number;
    height?: number;
    ipfsHash?: string;
    ipfsUrl?: string;
  };
}

interface BatchUploadResponse {
  success: boolean;
  data: MediaUploadResponse['data'][];
}

export class UploadClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';
    this.timeout = 60000; // 60s for large files
  }

  /**
   * Upload single media file
   * Returns ImageKit URL immediately (IPFS pinning is async)
   */
  async uploadMedia(
    file: File,
    options?: { folder?: string; tags?: string[] }
  ): Promise<MediaUploadResponse['data']> {
    const formData = new FormData();
    formData.append('file', file);

    if (options?.folder) {
      formData.append('folder', options.folder);
    }
    if (options?.tags) {
      options.tags.forEach(tag => formData.append('tags', tag));
    }

    const token = graphqlClient.getAccessToken();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/api/upload/media`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Upload failed' }));
        throw new Error(error.message || `Upload failed with status ${response.status}`);
      }

      const result: MediaUploadResponse = await response.json();
      return result.data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Upload timeout - file may be too large');
      }
      throw error;
    }
  }

  /**
   * Upload multiple files (max 20)
   */
  async uploadBatch(
    files: File[],
    options?: { folder?: string }
  ): Promise<MediaUploadResponse['data'][]> {
    if (files.length > 20) {
      throw new Error('Maximum 20 files per batch');
    }

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    if (options?.folder) {
      formData.append('folder', options.folder);
    }

    const token = graphqlClient.getAccessToken();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/api/upload/batch`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Batch upload failed' }));
        throw new Error(error.message || `Batch upload failed with status ${response.status}`);
      }

      const result: BatchUploadResponse = await response.json();
      return result.data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Upload timeout - files may be too large');
      }
      throw error;
    }
  }
}

export const uploadClient = new UploadClient();
