/**
 * GraphQL Client Export
 *
 * Re-exports Apollo wrapper for backward compatibility
 * All existing code using `graphqlClient` will continue to work
 */

export { apolloWrapper as graphqlClient } from './apollo/apollo-wrapper';
