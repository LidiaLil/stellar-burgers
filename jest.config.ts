/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',// Можно убрать, если есть transform
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  roots: [
    "<rootDir>/src"
  ],

  testEnvironment: "jsdom", // или "jest-environment-jsdom" для React компонентов
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],

  testPathIgnorePatterns: [
    "/node_modules/"
  ],

  transform: {
    // Используем ts-jest для обработки TypeScript файлов
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // настройки для ts-jest (опционально)
        tsconfig: 'tsconfig.json',
        // Дополнительные опции если нужно:
        // useESM: false,
        // isolatedModules: true,
      },
    ],
    // Для JavaScript файлов (если они есть)
    '^.+\\.jsx?$': 'babel-jest',
  },

  transformIgnorePatterns: [
    "/node_modules/",
    "\\.pnp\\.[^\\/]+$"
  ],

  moduleNameMapper: {
    // Алиасы из tsconfig.json
    '^@components$': '<rootDir>/src/components',
    '^@store$': '<rootDir>/src/store',
    '^@pages$': '<rootDir>/src/pages',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@ui$': '<rootDir>/src/components/ui',
    '^@ui-pages$': '<rootDir>/src/components/ui/pages',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@slices$': '<rootDir>/src/services/slices',
    '^@selectors': '<rootDir>/src/services/selectors',
    '^@reducers/(.*)$': '<rootDir>/src/services/reducers',

    // Для обработки модулей (CSS, SCSS, изображения и т.д.)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },

  verbose: true,
};

export default config;