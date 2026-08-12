import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the portfolio and its core hiring content", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Phạm Xuân Phúc \| Frontend Developer<\/title>/i);
  assert.match(html, /I build digital products/);
  assert.match(html, /Straumann APAC/);
  assert.match(html, /BLive/);
  assert.match(html, /K-Life/);
  assert.match(html, /Code lab/);
  assert.match(html, /Pham_Xuan_Phuc_Frontend_Developer_CV\.pdf/);
  assert.match(html, /og-card\.png/);
});

test("ships the portfolio assets", async () => {
  await Promise.all([
    access(new URL("../public/projects/straumann.webp", import.meta.url)),
    access(new URL("../public/projects/blive.webp", import.meta.url)),
    access(new URL("../public/projects/klife.webp", import.meta.url)),
    access(new URL("../public/og-card.png", import.meta.url)),
    access(new URL("../public/docs/Pham_Xuan_Phuc_Frontend_Developer_CV.pdf", import.meta.url)),
  ]);
});
