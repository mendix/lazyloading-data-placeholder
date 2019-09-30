const React = require('react');

const paths = require('./paths');

module.exports = {
  verbose: true,
  transform: { '^.+\\.[t|j]sx?$': 'babel-jest' },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  globals: {
    react: React,
  },
  coverageDirectory: paths.testCoverageDir,
  coverageReporters: ['lcov', 'text'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'jest tests',
        suiteNameTemplate: '{filepath}',
        output: 'reports/junit.xml',
        classNameTemplate: '{filename}',
        titleTemplate: '{title}',
        ancestorSeparator: ' > ',
      },
    ],
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    'src/**/*.jsx',
    'src/**/*.ts',
    'src/**/*.tsx',
  ],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
};
