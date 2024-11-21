import globals from 'globals';
import jsConfig from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    ignores: ['node_modules', 'dist'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        process: 'readonly',
      },
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  jsConfig.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': tsEslintPlugin,
      prettier,
    },
    rules: {
      ...tsEslintPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'off',
      // 'no-unused-vars': 'error',
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      'no-unused-expressions': 'error',
      'prefer-const': 'error',
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      'no-undef': 'error',
      // semi: ["warn", "always"],
      // '@typescript-eslint/no-unused-vars': 'error',
      // '@typescript-eslint/no-unused-expressions': 'error',
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/consistent-type-imports": ["warn", { "prefer": "type-imports" }]
      // "@typescript-eslint/no-unused-vars": ["error", { 'argsIgnorePattern': '^_' }]
    },
  },
  {
    files: ["src/server.ts", "src/configs/**/*.ts"],
    rules: {
      "no-console": "off",
    },
  },
];
