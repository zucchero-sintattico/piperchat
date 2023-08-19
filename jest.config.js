/** @type {import('ts-jest').JestConfigWithTsJest} */
const { compilerOptions } = require('./tsconfig.json')
const { pathsToModuleNameMapper } = require('ts-jest')
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // follow tsconfig.json compilerOptions paths
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  testMatch: ['<rootDir>/test/**/*.test.ts'],
}
