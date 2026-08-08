// Quick manual check that media-core actually talks to Pexels.
// Run: PEXELS_API_KEY=your_key_here npx tsx smoke-test.ts
// (or: npm install -D tsx   then run the same command)

import { MediaClient, attachDefaultLogger } from "./src/index";

async function main() {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.error("Set PEXELS_API_KEY env var first.");
    process.exit(1);
  }

  const client = new MediaClient({ apiKey });
  attachDefaultLogger(client.events); // logs view/download events to console

  console.log("Searching for 'mountains'...");
  const results = await client.search({ query: "mountains", perPage: 5 });
  console.log(`Got ${results.items.length} items, total available: ${results.totalResults}`);
  console.log("First item:", results.items[0]);

  // Fire a test event to confirm the emitter works end-to-end
  client.trackView(results.items[0].id);

  console.log("\nSearching curated feed...");
  const curated = await client.curated(1, 3);
  console.log(`Curated: ${curated.items.length} items`);
}

main().catch((err) => {
  console.error("Smoke test failed:", err);
  process.exit(1);
});
