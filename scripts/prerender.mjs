/**
 * Prerender the built SPA to static HTML.
 *
 * Without this, every unfurl (WhatsApp, X, Slack) and every archiver receives
 * an empty <div id="root">. Puppeteer loads each route from a local static
 * server, waits for React to paint, and writes the resulting DOM back over the
 * built file — so the crawler sees prose and the browser still hydrates.
 */
import { createServer } from "node:http";
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import puppeteer from "puppeteer";

const DIST = new URL("../dist/", import.meta.url).pathname;
const PORT = 45671;

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png" };

async function routes() {
  const raw = JSON.parse(await readFile(join(DIST, "assets", "data.json"), "utf8").catch(() => "null"))
    ?? JSON.parse(await readFile(new URL("../src/lib/data.json", import.meta.url), "utf8"));
  const ids = [...raw.tier1, ...raw.tier2, ...raw.untestable].map((x) => x.id);
  return ["/", "/read", "/modi", "/everyday", ...ids.map((id) => `/indicator/${id}`)];
}

const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = join(DIST, p);
  if (!extname(file) || !existsSync(file)) file = join(DIST, "index.html");
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404); res.end("nf"); }
});

await new Promise((r) => server.listen(PORT, r));
const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage();
const list = await routes();
let n = 0;

for (const route of list) {
  await page.goto(`http://localhost:${PORT}${route}`,
    { waitUntil: "networkidle0", timeout: 45000 });
  await page.waitForSelector("#root > *", { timeout: 20000 });
  const html = await page.content();
  const out = route === "/" ? join(DIST, "index.html") : join(DIST, route.slice(1), "index.html");
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html);
  n++;
}

// 404.html keeps deep links working on Pages; give it the prerendered home shell
await writeFile(join(DIST, "404.html"), await readFile(join(DIST, "index.html")));

await browser.close();
server.close();
console.log(`prerendered ${n} routes`);
