import { config as baseConfig } from '@workspace/eslint-config/base'

/**
 * Root ESLint configuration for the monorepo.
 * Individual apps and packages can extend this with their own configs.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
    // Apply base config to the entire workspace
    ...baseConfig,
    {
        // Global ignores for the monorepo
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/.next/**',
            '**/coverage/**',
            '**/.turbo/**',
            '**/pnpm-lock.yaml',
        ],
    },
    {
        // Root-level files configuration
        files: ['*.js', '*.ts', '*.mjs'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
    },
]
