/**
 * Database client singleton
 * Per ADR-001 - Use Prisma ORM for Data Access
 */

import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

/**
 * Get the Prisma client instance
 * Uses singleton pattern to prevent multiple connections
 */
export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    });
  }
  return prisma;
}

/**
 * Disconnect from the database
 * Call this during graceful shutdown
 */
export async function disconnectPrisma(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
  }
}
