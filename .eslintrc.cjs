module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  ignorePatterns: ['dist', 'node_modules', '*.config.*', 'backups'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react-refresh', '@typescript-eslint'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // React
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/prop-types': 'off',

    // TypeScript
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'none',
        caughtErrors: 'none',
        ignoreRestSiblings: true,
      },
    ],

    // 基础规则
    'no-console': 'off',
    'no-debugger': 'error',
    'no-unused-vars': 'off',

    // React Hooks - 关闭依赖检查（项目中有意为之）
    'react-hooks/exhaustive-deps': 'off',

    // 风格规则由 Prettier 处理
    quotes: 'off',
    semi: 'off',
    indent: 'off',
  },
};
