#!/usr/bin/env node

// Re-export from the main server file
export { default } from './server/index.js';

// If this file is run directly, start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  await import('./server/index.js');
}