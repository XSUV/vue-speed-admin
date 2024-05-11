module.exports = {
  extends: ['speed/typescript/vue', 'plugin:prettier/recommended'],
  ignorePatterns: ['dist/*', 'public/*', 'src/assets/**', 'src/**/iconfont/**', '*.config.js'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'no-undef': 'off',
    'import/no-cycle': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'array-callback-return': 'off',
  },
};
