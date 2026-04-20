import eslint from "@eslint/js";
import eslintPluginNoSecret from "eslint-plugin-no-secrets";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: [
      "dist",
      "node_modules",
      "test",
      "migration",
      ".*",
      "**/*.config.cjs",
      "**/*.config.msj",
      "eslint.config.mjs",
      "**/*.spec.ts",
      "**/*.test.ts",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
      sourceType: "module",
      ecmaVersion: 2023,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-floating-promises": ["warn", { ignoreVoid: true, ignoreIIFE: true }],
      "prettier/prettier": ["error", { endOfLine: "lf" }],
    },
  },
  {
    plugins: { "no-secrets": eslintPluginNoSecret },
    rules: { "no-secrets/no-secrets": "error" },
  },
);
