/**
 * Collection Creation Error Types
 * Comprehensive error hierarchy for create collection flow
 */

import { AppError } from '@/shared/lib/error-handler';

export type CreationStep =
  | 'UPLOAD_MEDIA'
  | 'CREATE_DB_RECORD'
  | 'ADD_ALLOWLIST'
  | 'DEPLOY_CONTRACT'
  | 'UPDATE_DB';

export class CollectionError extends AppError {
  constructor(
    message: string,
    public code: string,
    public step: CreationStep,
    public recoverable: boolean,
    public context?: Record<string, unknown>
  ) {
    super(message, code, undefined, context);
    this.name = 'CollectionError';
  }
}

export class MediaUploadError extends CollectionError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'MEDIA_UPLOAD_FAILED', 'UPLOAD_MEDIA', true, context);
    this.name = 'MediaUploadError';
  }
}

export class DatabaseError extends CollectionError {
  constructor(message: string, recoverable: boolean, context?: Record<string, unknown>) {
    super(message, 'DB_OPERATION_FAILED', 'CREATE_DB_RECORD', recoverable, context);
    this.name = 'DatabaseError';
  }
}

export class AllowlistError extends CollectionError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'ALLOWLIST_OPERATION_FAILED', 'ADD_ALLOWLIST', true, context);
    this.name = 'AllowlistError';
  }
}

export class DeploymentError extends CollectionError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'CONTRACT_DEPLOYMENT_FAILED', 'DEPLOY_CONTRACT', true, context);
    this.name = 'DeploymentError';
  }
}

export class InsufficientFundsError extends CollectionError {
  constructor(required: string, available: string) {
    super(
      `Insufficient funds. Required: ${required}, Available: ${available}`,
      'INSUFFICIENT_FUNDS',
      'DEPLOY_CONTRACT',
      false,
      { required, available }
    );
    this.name = 'InsufficientFundsError';
  }
}

export class UserRejectionError extends CollectionError {
  constructor() {
    super(
      'Transaction rejected by user',
      'USER_REJECTION',
      'DEPLOY_CONTRACT',
      true
    );
    this.name = 'UserRejectionError';
  }
}

export class NetworkSwitchError extends CollectionError {
  constructor(expectedChain: string, actualChain: string) {
    super(
      `Network switched during creation. Expected: ${expectedChain}, Actual: ${actualChain}`,
      'NETWORK_SWITCH',
      'DEPLOY_CONTRACT',
      true,
      { expectedChain, actualChain }
    );
    this.name = 'NetworkSwitchError';
  }
}

export class ContractVerificationError extends CollectionError {
  constructor(address: string, context?: Record<string, unknown>) {
    super(
      `Contract verification failed for address: ${address}`,
      'CONTRACT_VERIFICATION_FAILED',
      'DEPLOY_CONTRACT',
      true,
      { address, ...context }
    );
    this.name = 'ContractVerificationError';
  }
}

export function isCollectionError(error: unknown): error is CollectionError {
  return error instanceof CollectionError;
}

export function isRecoverableError(error: unknown): boolean {
  if (isCollectionError(error)) {
    return error.recoverable;
  }
  if (error instanceof Error) {
    const retryableCodes = ['TIMEOUT', 'NETWORK_ERROR', 'RATE_LIMITED', 'ECONNRESET'];
    return retryableCodes.some(code => error.message?.includes(code));
  }
  return false;
}

export function getCollectionErrorMessage(error: unknown): string {
  if (error instanceof MediaUploadError) {
    return 'Failed to upload media. Please check your file and try again.';
  }
  if (error instanceof DatabaseError) {
    return 'Failed to save collection data. Please try again.';
  }
  if (error instanceof AllowlistError) {
    return 'Failed to process allowlist. Please check the addresses and try again.';
  }
  if (error instanceof InsufficientFundsError) {
    return error.message;
  }
  if (error instanceof UserRejectionError) {
    return 'Transaction was rejected. You can try again when ready.';
  }
  if (error instanceof NetworkSwitchError) {
    return 'Please switch back to the correct network to continue.';
  }
  if (error instanceof DeploymentError) {
    return 'Contract deployment failed. You can retry this step.';
  }
  return 'An unexpected error occurred. Please try again.';
}
