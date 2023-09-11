/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  ignorePatterns: ['node_modules/', 'dist/', '*jest.config.js'],
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
