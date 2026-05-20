import { spawn } from 'node:child_process';

const port = process.env.SMOKE_PORT || '4173';
const url = process.env.SMOKE_URL || `http://127.0.0.1:${port}`;
const requiredText = process.env.SMOKE_REQUIRED_TEXT || 'The Drinking Cog';
const requiredMarker = process.env.SMOKE_REQUIRED_MARKER || 'home-ready';
const retries = Number(process.env.SMOKE_RETRIES || 30);
const intervalMs = Number(process.env.SMOKE_INTERVAL_MS || 2000);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const server = spawn('pnpm', ['start', '--', '-p', port], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: process.env
});

server.stdout.on('data', (chunk) => process.stdout.write(chunk));
server.stderr.on('data', (chunk) => process.stderr.write(chunk));

let serverExited = false;
server.on('exit', (code) => {
  serverExited = true;
  if (code !== 0) {
    console.error(`Local server exited with code ${code}`);
  }
});

async function stopServer() {
  if (!server.killed) {
    server.kill('SIGTERM');
    await wait(1000);
  }
}

let passed = false;
let lastError = '';

try {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    if (serverExited) {
      lastError = 'Local server exited before smoke check passed.';
      break;
    }

    try {
      const response = await fetch(url, { redirect: 'follow' });
      const body = await response.text();

      if (!response.ok) {
        lastError = `HTTP ${response.status}`;
      } else if (!body.includes(requiredText)) {
        lastError = `Missing text: ${requiredText}`;
      } else if (!body.includes(requiredMarker)) {
        lastError = `Missing marker: ${requiredMarker}`;
      } else {
        console.log(`LOCAL SMOKE PASS ${url}`);
        passed = true;
        break;
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    console.log(`LOCAL SMOKE RETRY ${attempt}/${retries}: ${lastError}`);
    await wait(intervalMs);
  }
} finally {
  await stopServer();
}

if (!passed) {
  console.error(`LOCAL SMOKE FAIL ${url}: ${lastError}`);
  process.exitCode = 1;
}
