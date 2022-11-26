import type { Config } from 'jest';
import { defaults } from 'jest-config';

const config: Config = {
  verbose: true,
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts', 'ts'],
  testPathIgnorePatterns: ['build'],
  preset: 'ts-jest',
  testEnvironment: 'node',
};

export default config;
