import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, extname, relative } from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const outFile = "dist/server/index.js";
const staticExtensions = new Set([
  ".html",
  ".css",
  ".js",
  ".mjs",
  ".json",
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".ico",
  ".pdf",
]);
const staticRoots = ["assets/", "css/", "js/", "pic/"];
const rootStaticFiles = new Set([
  "about.html",
  "academic-calendar.html",
  "assistant.html",
  "dashboard.html",
  "detailed-roadmap.html",
  "early-graduation.html",
  "evidence.html",
  "index.html",
  "onboarding.html",
  "next-semester.html",
  "personal-roadmap.html",
  "programs.html",
  "requirements.html",
  "signup.html",
  "transcript-review.html",
  "vercel.json",
]);
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
};

function getTrackedFiles() {
  return execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" })
    .split(/\r?\n/)
    .filter(Boolean)
    .map((file) => file.replaceAll("\\", "/"));
}

function shouldBundle(file) {
  if (!staticExtensions.has(extname(file).toLowerCase())) return false;
  return rootStaticFiles.has(file) || staticRoots.some((prefix) => file.startsWith(prefix));
}

await rm("dist", { recursive: true, force: true });
await mkdir(dirname(outFile), { recursive: true });
await mkdir("dist/.openai", { recursive: true });

const assets = {};
for (const file of getTrackedFiles().filter(shouldBundle)) {
  const bytes = await readFile(file);
  assets[`/${file}`] = {
    mime: mimeTypes[extname(file).toLowerCase()] || "application/octet-stream",
    body: bytes.toString("base64"),
  };
}
if (assets["/index.html"]) assets["/"] = assets["/index.html"];

const workerSource = `const ASSETS = ${JSON.stringify(assets)};

function response(body, init = {}) {
  return new Response(body, init);
}

function notFoundFallback() {
  const fallback = ASSETS["/index.html"];
  return response(Uint8Array.from(atob(fallback.body), (char) => char.charCodeAt(0)), {
    headers: {
      "content-type": fallback.mime,
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin"
    }
  });
}

function assetResponse(asset) {
  return response(Uint8Array.from(atob(asset.body), (char) => char.charCodeAt(0)), {
    headers: {
      "content-type": asset.mime,
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin"
    }
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/__health") {
      return response(JSON.stringify({ ok: true, app: "GradQuest" }), {
        headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
      });
    }
    if (url.pathname === "/api/auth-config") {
      return response(JSON.stringify({}), {
        headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
      });
    }
    if (url.pathname === "/api/chat" || url.pathname === "/api/parse") {
      return response(JSON.stringify({ error: "This demo deployment does not include server-side AI keys." }), {
        status: 503,
        headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
      });
    }
    const cleanPath = decodeURIComponent(url.pathname).replace(/\\/+/g, "/");
    const asset = ASSETS[cleanPath] || ASSETS[cleanPath + ".html"];
    return asset ? assetResponse(asset) : notFoundFallback();
  }
};
`;

await writeFile(outFile, workerSource);
await writeFile("dist/.openai/hosting.json", await readFile(".openai/hosting.json", "utf8"));
console.log(relative(root, outFile));
