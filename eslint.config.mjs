const eslintConfig = [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/dist/**",
      "**/.cache/**",
      "**/coverage/**",
      "**/.turbo/**",
      "**/public/**",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    rules: {
      // Add custom rules as needed
    },
  },
];

export default eslintConfig;
