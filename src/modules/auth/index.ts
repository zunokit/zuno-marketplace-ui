/**
 * Authentication Module
 *
 * Exports all authentication-related utilities, hooks, and services
 */

export { authService } from '@/shared/services/auth.service';
export { useAuth } from '@/shared/hooks/useAuth';
export { graphqlClient } from '@/shared/lib/graphql-client';
export * from '@/shared/types/auth';
