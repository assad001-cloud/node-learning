module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js", "**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"], 
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  detectOpenHandles: true,
  forceExit: true,
};