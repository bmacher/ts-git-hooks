/**
 * @dependencies
 * npm add -D jest @types/jest ts-jest
 * 
 * package.json
 * "scripts": [
 *   "test": "jest",
 *   "test:verbose": "jest --verbose",
 *   "test:coverage": "jest --coverage"
 *  ]
 *
 * ts-config.js
 * "types": [
 *   "...", 
 *   "jest"
 * ],
 */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './src',
  testMatch: [
    '**/?(*.)+(spec|test).ts'
  ],
};