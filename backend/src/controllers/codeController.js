import { ENV } from "../lib/env.js";

const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";
const LANGUAGE_IDS = {
  javascript: 63,
  java: 62,
  python: 71,
};
const RUN_LIMIT = 20;
const RUN_WINDOW_MS = 60_000;
const runWindows = new Map();

const rapidApiHeaders = () => ({
  "Content-Type": "application/json",
  "X-RapidAPI-Key": ENV.JUDGE0_RAPIDAPI_KEY,
  "X-RapidAPI-Host": ENV.JUDGE0_RAPIDAPI_HOST || "judge0-ce.p.rapidapi.com",
});

async function readJson(response) {
  return response.json().catch(() => ({}));
}

async function pollSubmission(token) {
  const waitIntervals = [500, 750, 1_000, 1_500, 2_000, 2_500, 3_000, 3_000];

  for (const waitMs of waitIntervals) {
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    const response = await fetch(`${JUDGE0_URL}/submissions/${encodeURIComponent(token)}?base64_encoded=false`, {
      headers: rapidApiHeaders(),
      signal: AbortSignal.timeout(8_000),
    });
    const result = await readJson(response);

    if (!response.ok) throw new Error(result.message || `Judge0 status request failed (${response.status})`);
    if (result.status && result.status.id > 2) return result;
  }

  return null;
}

export async function executeCode(req, res) {
  const { language, code } = req.body || {};
  const languageId = LANGUAGE_IDS[language];

  if (!languageId) {
    return res.status(400).json({ success: false, error: `Unsupported language: ${language || ""}` });
  }

  if (typeof code !== "string" || !code.trim()) {
    return res.status(400).json({ success: false, error: "Code is required" });
  }

  if (code.length > 20_000) {
    return res.status(413).json({ success: false, error: "Code must be 20,000 characters or less" });
  }

  if (!ENV.JUDGE0_RAPIDAPI_KEY) {
    return res.status(503).json({
      success: false,
      error: "Code execution is not configured. Add JUDGE0_RAPIDAPI_KEY to the Render environment.",
    });
  }

  const now = Date.now();
  const runWindow = runWindows.get(req.user.clerkId);
  if (!runWindow || now - runWindow.startedAt >= RUN_WINDOW_MS) {
    runWindows.set(req.user.clerkId, { startedAt: now, count: 1 });
  } else if (runWindow.count >= RUN_LIMIT) {
    res.set("Retry-After", String(Math.ceil((RUN_WINDOW_MS - (now - runWindow.startedAt)) / 1_000)));
    return res.status(429).json({ success: false, error: "Run limit reached. Please wait a minute before running more code." });
  } else {
    runWindow.count += 1;
  }

  try {
    let response = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
      method: "POST",
      headers: rapidApiHeaders(),
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        cpu_time_limit: 5,
        wall_time_limit: 10,
      }),
      signal: AbortSignal.timeout(25_000),
    });

    let result = await readJson(response);

    // Some Judge0 hosts disable wait=true. Retry once using the asynchronous API,
    // then poll the returned submission token.
    if (!response.ok && response.status === 400 && /wait/i.test(JSON.stringify(result))) {
      response = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`, {
        method: "POST",
        headers: rapidApiHeaders(),
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          cpu_time_limit: 5,
          wall_time_limit: 10,
        }),
        signal: AbortSignal.timeout(25_000),
      });
      result = await readJson(response);
    }

    if (!response.ok) {
      console.error("Judge0 request failed with status:", response.status);
      const error = response.status === 401 || response.status === 403
        ? "Judge0 rejected the RapidAPI credentials. Check the key and active Judge0 CE subscription in Render."
        : result.message || "Judge0 could not execute this request";
      return res.status(502).json({ success: false, error });
    }

    if (result.token && (!result.status || result.status.id === 1 || result.status.id === 2)) {
      result = await pollSubmission(result.token);
    }

    if (!result || !result.status || result.status.id === 1 || result.status.id === 2) {
      return res.status(504).json({
        success: false,
        error: "Judge0 did not finish running this submission in time. Please try again.",
      });
    }

    const output = result.stdout || "";
    const error = result.compile_output || result.stderr || result.message || result.status.description;
    const success = result.status.id === 3;

    return res.status(200).json({
      success,
      output: output || (success ? "No output" : ""),
      ...(success ? {} : { error: error || "Code execution failed" }),
    });
  } catch (error) {
    const timedOut = error.name === "TimeoutError" || error.name === "AbortError";
    console.error("Judge0 request error:", error.message);
    return res.status(timedOut ? 504 : 502).json({
      success: false,
      error: timedOut ? "Judge0 took too long to respond. Try again." : "Could not reach the code execution service.",
    });
  }
}
