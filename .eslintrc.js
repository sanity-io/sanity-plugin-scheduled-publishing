module.exports = {
  env: {
    browser: true,
    node: false,
  },
  extends: [
    'sanity/react', // must come before sanity/typescript
    'sanity/typescript',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      files: ['*.{ts,tsx}'],
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },
  plugins: ['prettier'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    'react/display-name': 0,
    'react/jsx-no-bind': 0,
  },
  settings: {
    'import/ignore': ['\\.css$', '.*node_modules.*', '.*:.*'],
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
}
