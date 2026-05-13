/**
 * 77 Marine — Local Dev Server
 * ----------------------------------------------------------------------
 * Tiny zero-dependency HTTP server for local development.
 *  - Serves static files from the project root (index.html, css/, js/, assets/)
 *  - Routes POST /api/contact to api/contact.js
 *
 * Usage:
 *   1. cp .env.example .env  (fill in SMTP credentials)
 *   2. npm install
 *   3. node server.js
 *
 * Production hosting (Vercel) uses api/contact.js directly via the
 * `functions` declaration in vercel.json — this file is only for local dev.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

// Load .env if present (no extra dependency)
try {
  const envPath = path.join(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, "utf8")
      .split("\n")
      .forEach((line) => {
        const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
        if (m && !process.env[m[1]]) {
          process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
        }
      });
  }
} catch (e) {
  // .env is optional in dev
}

const contactHandler = require("./api/contact");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
};

function safeJoin(root, urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const resolved = path.normalize(path.join(root, decoded));
  if (!resolved.startsWith(root)) return null;
  return resolved;
}

function serveStatic(req, res) {
  let urlPath = req.url.split("?")[0];
  if (urlPath === "/" || urlPath === "") urlPath = "/index.html";
  /* Directory index: /ar/ -> /ar/index.html */
  if (urlPath.endsWith("/")) urlPath += "index.html";

  let filePath = safeJoin(ROOT, urlPath);
  if (!filePath) {
    res.statusCode = 403;
    return res.end("Forbidden");
  }

  // Clean-URL: try .html extension
  if (!fs.existsSync(filePath) && !path.extname(filePath)) {
    if (fs.existsSync(filePath + ".html")) filePath = filePath + ".html";
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    const notFound = path.join(ROOT, "404.html");
    res.statusCode = 404;
    if (fs.existsSync(notFound)) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.end(fs.readFileSync(notFound));
    }
    return res.end("Not Found");
  }

  const ext = path.extname(filePath).toLowerCase();
  res.setHeader("Content-Type", MIME[ext] || "application/octet-stream");
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  /* Route the Node contact handler. Match exactly /api/contact or
     /api/contact?... — don't capture /api/contact.php (that's the PHP
     fallback used on shared hosts; it stays a static 404 in Node dev). */
  const pathOnly = req.url.split("?")[0];
  if (pathOnly === "/api/contact") {
    return contactHandler(req, res);
  }
  return serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`\n77 Marine — dev server running:`);
  console.log(`  http://localhost:${PORT}\n`);
  if (!process.env.SMTP_HOST) {
    console.log(
      "  ⚠  No .env detected — /api/contact will report a config error."
    );
    console.log(
      "     Copy .env.example to .env and fill in your SMTP credentials.\n"
    );
  }
});
