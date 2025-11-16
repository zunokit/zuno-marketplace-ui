import { CodegenConfig } from '@graphql-codegen/cli';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8081/graphql';

const config: CodegenConfig = {
  // Fetch schema from remote GraphQL endpoint (from env)
  schema: GRAPHQL_URL,

  // Source .graphql files (only the ones we need)
  documents: ['src/shared/graphql/schemas/**/*.graphql'],

  // Generate typed document nodes
  generates: {
    './src/shared/graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typed-document-node',
      ],
      config: {
        // Emit types compatible with graphql-request
        rawRequest: false,
        // Skip typename for cleaner types
        skipTypename: false,
        // Use exact types
        strictScalars: true,
        scalars: {
          DateTime: 'string',
          JSON: 'Record<string, any>',
        },
      },
    },
  },

  // Watch mode support
  watch: false,

  // Verbose error messages
  verbose: true,
};

export default config;
