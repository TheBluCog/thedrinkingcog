const repository = process.env.GITHUB_REPOSITORY;
const sha = process.env.GITHUB_SHA;
const githubToken = process.env.GITHUB_TOKEN;
const contextName = process.env.VERCEL_STATUS_CONTEXT || 'Vercel';
const retries = Number(process.env.VERCEL_STATUS_RETRIES || 40);
const intervalMs = Number(process.env.VERCEL_STATUS_INTERVAL_MS || 15000);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

if (!repository || !sha || !githubToken) {
  console.error('Missing GITHUB_REPOSITORY, GITHUB_SHA, or GITHUB_TOKEN.');
  process.exit(1);
}

const apiUrl = `https://api.github.com/repos/${repository}/commits/${sha}/status`;

let lastState = 'missing';
let lastTargetUrl = '';
let lastDescription = '';

for (let attempt = 1; attempt <= retries; attempt += 1) {
  const response = await fetch(apiUrl, {
    headers: {
      authorization: `Bearer ${githubToken}`,
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28'
    }
  });

  if (!response.ok) {
    console.error(`GitHub status API failed with HTTP ${response.status}`);
    process.exit(1);
  }

  const payload = await response.json();
  const status = payload.statuses?.find((item) => item.context === contextName);

  if (status) {
    lastState = status.state;
    lastTargetUrl = status.target_url || '';
    lastDescription = status.description || '';
  }

  console.log(
    JSON.stringify({
      attempt,
      contextName,
      state: lastState,
      targetUrl: lastTargetUrl,
      description: lastDescription
    })
  );

  if (lastState === 'success') {
    console.log(`VERCEL STATUS PASS ${sha}`);
    process.exit(0);
  }

  if (lastState === 'failure' || lastState === 'error') {
    console.error(`VERCEL STATUS FAIL ${sha}: ${lastState} ${lastDescription}`);
    process.exit(1);
  }

  if (attempt < retries) {
    await wait(intervalMs);
  }
}

console.error(`VERCEL STATUS TIMEOUT ${sha}: ${lastState} ${lastDescription}`);
process.exit(1);
