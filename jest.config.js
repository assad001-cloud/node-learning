module.exports = {
  testEnvironment: "node",
  testTimeout: 20000,
  verbose: true,
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"],
  setupFiles: ["dotenv/config"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"]
};
