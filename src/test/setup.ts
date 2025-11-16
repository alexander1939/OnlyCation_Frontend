import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup después de cada test
afterEach(() => {
  cleanup();
});

// Mock de variables de entorno
vi.stubEnv('VITE_API_URL', 'http://localhost:8000/api');
vi.stubEnv('VITE_APP_NAME', 'OnlyCation');
vi.stubEnv('VITE_APP_VERSION', '1.0.0');

// Mock de fetch global
global.fetch = vi.fn();

// Mock de localStorage mejorado
const localStorageData: Record<string, string> = {};

const localStorageMock = {
  getItem: vi.fn((key: string) => localStorageData[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageData[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageData[key];
  }),
  clear: vi.fn(() => {
    Object.keys(localStorageData).forEach(key => delete localStorageData[key]);
  }),
};

global.localStorage = localStorageMock as any;

// Mock de IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;
