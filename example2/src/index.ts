/**
 * Application Entry Point
 * Per ARCHITECTURE.md
 */

import { createApp } from './app';
import { getPrismaClient, disconnectPrisma, logger } from './utils';

const PORT = process.env.PORT || 3000;

function main(): void {
  const prisma = getPrismaClient();
  const app = createApp(prisma);

  // Start server
  const server = app.listen(PORT, () => {
    logger.info('server.started', { message: `Server running on port ${PORT}` });
  });

  // Graceful shutdown
  const shutdown = (): void => {
    logger.info('server.shutdown', { message: 'Shutting down gracefully...' });
    server.close(() => {
      disconnectPrisma()
        .then(() => {
          logger.info('server.shutdown.complete', { message: 'Server shut down complete' });
          process.exit(0);
        })
        .catch((err: unknown) => {
          logger.error('server.shutdown.error', err instanceof Error ? err : new Error(String(err)));
          process.exit(1);
        });
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

try {
  main();
} catch (error: unknown) {
  logger.error('server.fatal', error instanceof Error ? error : new Error(String(error)));
  process.exit(1);
}
