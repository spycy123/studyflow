#!/usr/bin/env node
/**
 * StudyFlow Unified Development Runner
 * Menjalankan Backend API dan Frontend Vite secara konkuren dalam satu terminal
 * dengan prefiks output berwarna dan graceful shutdown.
 */

import { spawn } from 'node:child_process';
import process from 'node:process';

// ANSI escape codes for coloring
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
};

console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}   StudyFlow — Unified Local Development Runner    ${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}`);
console.log(`${colors.green}● Backend API : http://localhost:4000 (Health: /health)${colors.reset}`);
console.log(`${colors.cyan}● Frontend App: http://localhost:5173${colors.reset}`);
console.log(`${colors.yellow}Tekan Ctrl+C untuk menghentikan kedua layanan.${colors.reset}\n`);

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// Spawn Backend and Frontend cleanly without deprecation warnings
const backendProc = spawn(npmCmd, ['run', 'dev:backend'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: isWindows,
  windowsHide: true,
  env: { ...process.env, FORCE_COLOR: '1' },
});

const frontendProc = spawn(npmCmd, ['run', 'dev:frontend'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: isWindows,
  windowsHide: true,
  env: { ...process.env, FORCE_COLOR: '1' },
});

const pipeWithPrefix = (stream, prefix, color) => {
  let buffer = '';
  stream.on('data', (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${color}[${prefix}]${colors.reset} ${line}`);
      }
    }
  });
};

pipeWithPrefix(backendProc.stdout, 'BACKEND', colors.green);
pipeWithPrefix(backendProc.stderr, 'BACKEND:ERR', colors.red);

pipeWithPrefix(frontendProc.stdout, 'FRONTEND', colors.cyan);
pipeWithPrefix(frontendProc.stderr, 'FRONTEND:ERR', colors.magenta);

let isShuttingDown = false;
const cleanExit = (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`\n${colors.yellow}[Runner] Menerima sinyal ${signal}. Mematikan semua layanan...${colors.reset}`);

  if (isWindows) {
    try {
      if (backendProc.pid) spawn('taskkill', ['/pid', backendProc.pid.toString(), '/f', '/t'], { stdio: 'ignore' });
      if (frontendProc.pid) spawn('taskkill', ['/pid', frontendProc.pid.toString(), '/f', '/t'], { stdio: 'ignore' });
    } catch {
      // ignore
    }
  } else {
    backendProc.kill('SIGTERM');
    frontendProc.kill('SIGTERM');
  }

  setTimeout(() => {
    console.log(`${colors.green}[Runner] Semua layanan berhasil dihentikan.${colors.reset}`);
    process.exit(0);
  }, 500);
};

process.on('SIGINT', () => cleanExit('SIGINT'));
process.on('SIGTERM', () => cleanExit('SIGTERM'));

backendProc.on('close', (code) => {
  if (!isShuttingDown && code !== 0 && code !== null) {
    console.error(`${colors.red}[BACKEND] Proses berhenti dengan kode ${code}${colors.reset}`);
  }
});

frontendProc.on('close', (code) => {
  if (!isShuttingDown && code !== 0 && code !== null) {
    console.error(`${colors.red}[FRONTEND] Proses berhenti dengan kode ${code}${colors.reset}`);
  }
});
