import { ENV } from "../lib/env.js";

const ONLINE_COMPILER_URL = "https://api.onlinecompiler.io/api/run-code-sync/";
const COMPILERS = {
  javascript: "nodejs-24",
  java: "openjdk-25",
  python: "python-3.14",
};
const MAX_CODE_BYTES = 100_000;
const RUN_LIMIT = 25;
const RUN_WINDOW_MS = 60_000;
let runWindow = { startedAt: Date.now(), count: 0 };

export async function executeCode(req, res) {
  const { language, code } = req.body || {};
  const compiler = COMPILERS[language];

  if (!compiler) {
    return res.status(400).json({ success: false, error: `Unsupported language: ${language || ""}` });
  }

  if (typeof code !== "string" || !code.trim()) {
    return res.status(400).json({ success: false, error: "Code is required" });
  }

  if (Buffer.byteLength(code, "utf8") > MAX_CODE_BYTES) {
    return res.status(413).json({ success: false, error: "Code must be 100 KB or less" });
  }

  if (!ENV.ONLINECOMPILER_API_KEY) {
    return res.status(503).json({
      success: false,
      error: "Code execution is not configured. Add ONLINECOMPILER_API_KEY to the Render environment.",
    });
  }

  const now = Date.now();
  if (now - runWindow.startedAt >= RUN_WINDOW_MS) {
    runWindow = { startedAt: now, count: 0 };
  }
  if (runWindow.count >= RUN_LIMIT) {
    res.set("Retry-After", String(Math.ceil((RUN_WINDOW_MS - (now - runWindow.startedAt)) / 1_000)));
    return res.status(429).json({ success: false, error: "PeerCode is busy. Wait a minute and try again." });
  }
  runWindow.count += 1;

  try {
    const response = await fetch(ONLINE_COMPILER_URL, {
      method: "POST",
      headers: {
        Authorization: ENV.ONLINECOMPILER_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ compiler, code, time_limit: 10 }),
      signal: AbortSignal.timeout(25_000),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("OnlineCompiler request failed with status:", response.status);
      const error = response.status === 401 || response.status === 403
        ? "OnlineCompiler rejected the API key. Check ONLINECOMPILER_API_KEY in Render."
        : response.status === 429
          ? "OnlineCompiler's free usage limit or run capacity was reached. Try again later."
          : result.error || "OnlineCompiler could not execute this request";
      return res.status(response.status === 429 ? 429 : 502).json({ success: false, error });
    }

    const output = result.output || "";
    const success = result.status === "success" && result.exit_code === 0;

    return res.status(200).json({
      success,
      output: output || (success ? "No output" : ""),
      ...(success ? {} : { error: result.error || "Code execution failed" }),
    });
  } catch (error) {
    const timedOut = error.name === "TimeoutError" || error.name === "AbortError";
    console.error("OnlineCompiler request error:", error.message);
    return res.status(timedOut ? 504 : 502).json({
      success: false,
      error: timedOut ? "The code runner took too long to respond. Try again." : "Could not reach the code execution service.",
    });
  }
}
