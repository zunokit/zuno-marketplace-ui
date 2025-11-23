import { CodegenConfig } from '@graphql-codegen/cli';

const GRAPHQL_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`;

const config: CodegenConfig = {
  // Fetch schema from remote GraphQL endpoint (from env)
  schema: GRAPHQL_URL,

  // Source .graphql files and TypeScript files with inline graphql`` calls
  // Exclude the graphql directory itself to avoid circular dependencies
  documents: ['src/shared/graphql/schemas/**/*.graphql', 'src/**/*.{ts,tsx}', '!src/shared/graphql/gql.ts', '!src/shared/graphql/graphql.ts', '!src/shared/graphql/index.ts'],
  ignoreNoDocuments: true,

  // Use client preset for Apollo Client 4
  generates: {
    './src/shared/graphql/': {
      preset: 'client',
      presetConfig: {
        // Disable fragment masking for easier data access
        fragmentMasking: false,
      },
      config: {
        // Type safety
        strictScalars: true,
        scalars: {
          DateTime: 'string',
          JSON: 'Record<string, any>',
        },
        // Avoid optional fields
        avoidOptionals: {
          field: true,
        },
        // Documentation
        addDocBlocks: true,
      },
    },
  },

  // Watch mode support
  watch: false,

  // Verbose error messages
  verbose: true,
};

export default config;
