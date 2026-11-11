import { app } from './app.js';
import { config } from './config/index.js';

const server = app.listen(config.port, () => {
  console.log(`[StudyFlow API] Server running on port ${config.port} (${config.nodeEnv})`);
  console.log(`[StudyFlow API] Health check at http://localhost:${config.port}/health`);
  console.log(`[StudyFlow API] Base API route at http://localhost:${config.port}/api/v1`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('[StudyFlow API] HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
