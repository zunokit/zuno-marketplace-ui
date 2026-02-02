"use client";

import { useState, useCallback } from 'react';
import { uploadClient } from '@/shared/api/upload-client';
import { toast } from 'sonner';

interface UploadState {
  uploading: boolean;
  progress: number;
  error: Error | null;
}

export function useMediaUpload() {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
  });

  const validateFile = useCallback((file: File) => {
    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File too large. Maximum size is 10MB.');
    }

    // Allowed types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Allowed: JPG, PNG, GIF, WebP.');
    }
  }, []);

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    try {
      validateFile(file);

      setState({ uploading: true, progress: 10, error: null });

      const result = await uploadClient.uploadMedia(file, {
        folder: 'collections',
        tags: ['collection-media'],
      });

      setState({ uploading: false, progress: 100, error: null });

      return result.url;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Upload failed');
      setState({ uploading: false, progress: 0, error });
      toast.error(error.message);
      throw error;
    }
  }, [validateFile]);

  const uploadMultiple = useCallback(async (files: File[]): Promise<string[]> => {
    try {
      files.forEach(validateFile);

      setState({ uploading: true, progress: 10, error: null });

      const results = await uploadClient.uploadBatch(files, {
        folder: 'collections',
      });

      setState({ uploading: false, progress: 100, error: null });

      return results.map(r => r.url);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Batch upload failed');
      setState({ uploading: false, progress: 0, error });
      toast.error(error.message);
      throw error;
    }
  }, [validateFile]);

  const reset = useCallback(() => {
    setState({ uploading: false, progress: 0, error: null });
  }, []);

  return {
    ...state,
    uploadFile,
    uploadMultiple,
    reset,
  };
}
