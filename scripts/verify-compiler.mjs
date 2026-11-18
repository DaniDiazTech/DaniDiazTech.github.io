import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { gunzipSync } from "node:zlib";
const root = new URL("../public/compiler/vendor/", import.meta.url);
const manifest = JSON.parse(
  readFileSync(new URL("manifest.json", root), "utf8"),
);
for (const [name, entry] of Object.entries(manifest.assets)) {
  const zipped = readFileSync(new URL(name + ".gz.bin", root));
  const raw = gunzipSync(zipped);
  const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
  if (
    raw.length !== entry.bytes ||
    zipped.length !== entry.gzipBytes ||
    hash(raw) !== entry.sha256 ||
    hash(zipped) !== entry.gzipSha256
  )
    throw new Error(`Compiler artifact failed integrity check: ${name}`);
  console.log(
    `${name}: verified raw and gzip SHA-256, ${zipped.length} download bytes`,
  );
}
