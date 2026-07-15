import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const root = process.cwd();
const preferredPort = Number(process.argv[2] || process.env.PORT || 5177);
const host = "127.0.0.1";
let activePort = preferredPort;

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

function resolveRequestPath(url) {
  const pathname = decodeURIComponent(new URL(url, `http://${host}:${activePort}`).pathname);
  const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  let filePath = resolve(root, `.${safePath}`);
  if (!filePath.startsWith(root)) filePath = join(root, "index.html");
  if (existsSync(filePath) && statSync(filePath).isDirectory()) filePath = join(filePath, "index.html");
  return filePath;
}

const server = createServer(async (request, response) => {
  try {
    if (request.url === "/__health") {
      response.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
      response.end(JSON.stringify({ ok: true, app: "GradQuest", port: activePort }));
      return;
    }
    const filePath = resolveRequestPath(request.url || "/");
    const file = existsSync(filePath) ? filePath : join(root, "index.html");
    const data = await readFile(file);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(data);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`Local server error: ${error.message}`);
  }
});

function listen(port, attemptsLeft = 20) {
  activePort = port;
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && attemptsLeft > 0) {
      listen(port + 1, attemptsLeft - 1);
      return;
    }
    console.error(`GradQuest local server failed: ${error.message}`);
    process.exitCode = 1;
  });
  server.listen(port, host, () => {
    console.log(`GradQuest local server running at http://${host}:${port}/`);
    console.log(`Open http://${host}:${port}/dashboard.html`);
  });
}

listen(preferredPort);
