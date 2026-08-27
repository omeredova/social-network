import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig(
  globalIgnores(['dist', '.vite', '.tanstack', 'src/app/router/routeTree.gen.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/entities/**', '@/features/**', '@/widgets/**', '@/pages/**', '@/app/**'],
              message: 'The shared layer cannot depend on higher FSD layers.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/entities/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/**', '@/widgets/**', '@/pages/**', '@/app/**'],
              message: 'Entities cannot depend on higher FSD layers.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/widgets/**',
                '@/pages/**',
                '@/app/**',
                '@/entities/*/api/**',
                '@/entities/*/model/**',
                '@/entities/*/ui/**',
              ],
              message: 'Respect FSD layer direction and entity public APIs.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/widgets/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/pages/**',
                '@/app/**',
                '@/features/*/api/**',
                '@/features/*/model/**',
                '@/features/*/ui/**',
                '@/entities/*/api/**',
                '@/entities/*/model/**',
                '@/entities/*/ui/**',
              ],
              message: 'Respect FSD layer direction and slice public APIs.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/pages/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/app/**',
                '@/widgets/*/model/**',
                '@/widgets/*/ui/**',
                '@/features/*/api/**',
                '@/features/*/model/**',
                '@/features/*/ui/**',
                '@/entities/*/api/**',
                '@/entities/*/model/**',
                '@/entities/*/ui/**',
              ],
              message: 'Respect FSD layer direction and slice public APIs.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/app/**/*.{ts,tsx}', 'src/main.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/features/*/api/**',
                '@/features/*/model/**',
                '@/features/*/ui/**',
                '@/entities/*/api/**',
                '@/entities/*/model/**',
                '@/entities/*/ui/**',
                '@/widgets/*/model/**',
                '@/widgets/*/ui/**',
              ],
              message: 'Import the slice through its public index API.',
            },
          ],
        },
      ],
    },
  },
)
