const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.test.json');
const package = require('./package');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  displayName: package.name,
  name: package.name,
  rootDir: '.',
  moduleNameMapper: pathsToModuleNameMapper(
    compilerOptions.paths,
    { prefix: '<rootDir>/' }
  ),
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json'
    }
  }
};
