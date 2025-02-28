module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/*.test.ts',
    '**/*.spec.ts',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: false,
  coverageReporters: ['json', 'lcov', 'clover'],
};
