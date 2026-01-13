// Test setup file
// This file is run before each test file

import { PrismaClient } from '@prisma/client';

// Mock Prisma Client for unit tests
export const mockPrismaClient = {
  task: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $transaction: jest.fn(),
} as unknown as jest.Mocked<PrismaClient>;

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Cleanup after all tests
afterAll(async () => {
  jest.resetAllMocks();
});

// Global test timeout
jest.setTimeout(10000);
