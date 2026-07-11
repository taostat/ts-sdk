module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    // Legacy smells in the hand-written tx/signing modules (stake/unstake/move,
    // http-client) surface as warnings in Phase 1 — fixing them means editing
    // signing logic, which is out of scope here. Tracked for a dedicated cleanup
    // PR. New code is still held to error-level formatting via prettier/prettier.
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-useless-catch': 'warn',
    'no-empty': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-empty-interface': 'off'
  },
  env: {
    node: true,
    jest: true,
  },
};

