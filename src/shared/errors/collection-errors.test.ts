import { describe, it, expect } from 'vitest';
import {
  CollectionError,
  MediaUploadError,
  DatabaseError,
  DeploymentError,
  InsufficientFundsError,
  UserRejectionError,
  isCollectionError,
  isRecoverableError,
  getCollectionErrorMessage,
} from './collection-errors';

describe('Collection Errors', () => {
  describe('Error Classes', () => {
    it('should create CollectionError with correct properties', () => {
      const error = new CollectionError('Test message', 'TEST_CODE', 'UPLOAD_MEDIA', true, { foo: 'bar' });
      expect(error.message).toBe('Test message');
      expect(error.code).toBe('TEST_CODE');
      expect(error.step).toBe('UPLOAD_MEDIA');
      expect(error.recoverable).toBe(true);
      expect(error.context).toEqual({ foo: 'bar' });
      expect(error.name).toBe('CollectionError');
    });

    it('should create MediaUploadError as recoverable', () => {
      const error = new MediaUploadError('Upload failed');
      expect(error.code).toBe('MEDIA_UPLOAD_FAILED');
      expect(error.step).toBe('UPLOAD_MEDIA');
      expect(error.recoverable).toBe(true);
    });

    it('should create DatabaseError with specified recoverability', () => {
      const recoverableError = new DatabaseError('DB error', true);
      expect(recoverableError.recoverable).toBe(true);

      const nonRecoverableError = new DatabaseError('DB error', false);
      expect(nonRecoverableError.recoverable).toBe(false);
    });

    it('should create DeploymentError as recoverable', () => {
      const error = new DeploymentError('Deployment failed');
      expect(error.code).toBe('CONTRACT_DEPLOYMENT_FAILED');
      expect(error.step).toBe('DEPLOY_CONTRACT');
      expect(error.recoverable).toBe(true);
    });

    it('should create InsufficientFundsError as non-recoverable', () => {
      const error = new InsufficientFundsError('1.0', '0.5');
      expect(error.code).toBe('INSUFFICIENT_FUNDS');
      expect(error.recoverable).toBe(false);
      expect(error.message).toContain('1.0');
      expect(error.message).toContain('0.5');
    });

    it('should create UserRejectionError as recoverable', () => {
      const error = new UserRejectionError();
      expect(error.code).toBe('USER_REJECTION');
      expect(error.recoverable).toBe(true);
    });
  });

  describe('Type Guards', () => {
    it('should identify CollectionError correctly', () => {
      const error = new CollectionError('Test', 'CODE', 'UPLOAD_MEDIA', true);
      expect(isCollectionError(error)).toBe(true);
      expect(isCollectionError(new Error('Regular'))).toBe(false);
      expect(isCollectionError('string')).toBe(false);
    });

    it('should identify recoverable errors correctly', () => {
      expect(isRecoverableError(new MediaUploadError('test'))).toBe(true);
      expect(isRecoverableError(new InsufficientFundsError('1', '0'))).toBe(false);
      expect(isRecoverableError(new Error('NETWORK_ERROR'))).toBe(true);
      expect(isRecoverableError(new Error('TIMEOUT'))).toBe(true);
      expect(isRecoverableError(new Error('Random'))).toBe(false);
    });
  });

  describe('Error Messages', () => {
    it('should return appropriate messages for each error type', () => {
      expect(getCollectionErrorMessage(new MediaUploadError('test'))).toContain('upload');
      expect(getCollectionErrorMessage(new DatabaseError('test', true))).toContain('save');
      expect(getCollectionErrorMessage(new InsufficientFundsError('1', '0'))).toContain('Insufficient');
      expect(getCollectionErrorMessage(new UserRejectionError())).toContain('rejected');
      expect(getCollectionErrorMessage(new DeploymentError('test'))).toContain('deployment');
      expect(getCollectionErrorMessage(new Error('Unknown'))).toBe('An unexpected error occurred. Please try again.');
    });
  });
});
