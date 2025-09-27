// jest.config.js
module.exports = {
  testEnvironment: "node",       // Node.js environment
  testTimeout: 20000,            // Increase timeout for async DB tests
  verbose: true,                 // Show individual test results
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"], // Setup before tests
  collectCoverage: true,         // Enable coverage report
  coverageDirectory: "coverage", // Directory for coverage
  coverageReporters: ["text", "lcov"], // Coverage output formats
  testPathIgnorePatterns: ["/node_modules/", "/dist/"], // Ignore these folders
};
