module.exports = {
    
    root: true,
    parser: '@typescript-eslint/parser',
    env: {
      browser: true,
      es6: true,
    },
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    parserOptions: {
      emacVersion: 6,
      project: './tsconfig.json',
      sourceType: 'module'
    },
    rules: {
      indent: [
        'error',
        4
      ],
      'linebreak-style': [
        'error',
        'unix'
      ],
      quotes: [
        'error',
        'single'
      ],
      semi: [
        'error',
        'never'
      ]
    }
  };