module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/config/jest.config.js'],
  collectCoverage: true,
  coverageDirectory: './test/coverage',
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: [
    'Controllers/**/*.js',
    'Models/**/*.js',
    'Middleware/**/*.js',
    'Routes/**/*.js',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/server.js'],
  testPathIgnorePatterns: ['/node_modules/', '/test/coverage/'],
};
