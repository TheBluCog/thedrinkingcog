const url = process.argv[2] || process.env.SMOKE_URL;
const requiredText = process.env.SMOKE_REQUIRED_TEXT || 'The Drinking Cog';
const requiredMarker = process.env.SMOKE_REQUIRED_MARKER || 'home-ready';
const retries = Number(process.env.SMOKE_RETRIES || 20);
const intervalMs = Number(process.env.SMOKE_INTERVAL_MS || 3000);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

if (!url) {
  console.error('Missing URL. Pass one argument or set SMOKE_URL.');
  process.exitCode = 1;
} else {
  let passed = false;
  let lastError = '';

  for (let attempt = 1; attempt <= retries; attempt += 1) {
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
        console.log(`SMOKE PASS ${url}`);
        passed = true;
        break;
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    console.log(`SMOKE RETRY ${attempt}/${retries}: ${lastError}`);
    if (attempt < retries) {
      await wait(intervalMs);
    }
  }

  if (!passed) {
    console.error(`SMOKE FAIL ${url}: ${lastError}`);
    process.exitCode = 1;
  }
}
