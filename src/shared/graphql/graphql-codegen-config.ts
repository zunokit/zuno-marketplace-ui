import { CodegenConfig } from '@graphql-codegen/cli';

const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://localhost:8081/graphql';

const config: CodegenConfig = {
  // ============================================
  // SCHEMA SOURCE
  // ============================================
  // Use remote schema if available, otherwise skip schema fetch
  // Note: When backend is not running, generated hooks may be incomplete
  schema: GRAPHQL_URL,

  // ============================================
  // OPERATION DOCUMENTS (.graphql files)
  // ============================================
  documents: [
    'src/shared/graphql/schemas/**/*.graphql',
    'src/**/*.graphql', // Support co-located queries
  ],
  ignoreNoDocuments: true,

  // ============================================
  // CODE GENERATION
  // ============================================
  generates: {
    // --------------------------------------------
    // 1. Client Preset (Types + gql function)
    // --------------------------------------------
    './src/shared/graphql/': {
      preset: 'client',
      presetConfig: {
        // Disable fragment masking for easier use
        fragmentMasking: false,

        // Custom gql tag name
        gqlTagName: 'gql',
      },
      config: {
        // Scalar types
        strictScalars: true,
        scalars: {
          DateTime: 'string',
          JSON: 'Record<string, any>',
          BigInt: 'string',
        },

        // Avoid optional fields (use | null instead)
        avoidOptionals: {
          field: true,
          inputValue: false,
          object: false,
        },

        // Enums as types (not enums)
        enumsAsTypes: true,
        futureProofEnums: true,

        // Add JSDoc comments
        addDocBlocks: true,

        // Skip typename in operations
        skipTypename: false,
      },
    },

    // --------------------------------------------
    // 2. React Apollo Hooks (Separate file)
    // --------------------------------------------
    './src/shared/graphql/hooks.generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        // React hooks generation
        withHooks: true,
        withComponent: false,
        withHOC: false,
        withMutationFn: true,

        // Scalars (same as above)
        strictScalars: true,
        scalars: {
          DateTime: 'string',
          JSON: 'Record<string, any>',
          BigInt: 'string',
        },

        // Avoid optionals
        avoidOptionals: {
          field: true,
          inputValue: false,
          object: false,
        },

        // Naming conventions
        enumsAsTypes: true,
        futureProofEnums: true,

        // Fragments
        exportFragmentSpreadSubTypes: true,
        dedupeFragments: true,

        // Documentation
        addDocBlocks: true,

        // React Apollo specific
        reactApolloVersion: 4,
        withResultType: true,
        withMutationOptionsType: true,

        // Add __typename to all types
        skipTypename: false,
      },
    },

    // --------------------------------------------
    // 3. Schema Types (introspection)
    // --------------------------------------------
    './src/shared/graphql/schema.generated.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        strictScalars: true,
        scalars: {
          DateTime: 'string',
          JSON: 'Record<string, any>',
          BigInt: 'string',
        },
        avoidOptionals: {
          field: true,
          inputValue: false,
          object: false,
        },
        enumsAsTypes: true,
        addDocBlocks: true,
        skipTypename: false,
      },
    },
  },

  // ============================================
  // HOOKS (Post-generation)
  // ============================================
  hooks: {
    afterAllFileWrite: [
      // Format generated files
      'prettier --write',
    ],
  },
};

export default config;
