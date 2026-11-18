import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import {
  challenges,
  fullSource,
  readChecks,
} from "../src/content/challenges.ts";
const directory = mkdtempSync(join(tmpdir(), "model-lab-challenges-"));
try {
  for (const c of challenges) {
    for (const [kind, source] of [
      ["solution", c.solution],
      ["starter", c.starter],
    ]) {
      const file = join(directory, c.id + ".cpp"),
        binary = join(directory, c.id);
      writeFileSync(file, fullSource(c, source));
      execFileSync("clang++", ["-std=c++20", "-O1", file, "-o", binary], {
        stdio: ["ignore", "pipe", "pipe"],
      });
      const run = spawnSync(binary, [], { encoding: "utf8", timeout: 3000 });
      const checks = readChecks(run.stdout || "", c.tests.length),
        passed = checks.every((v) => v === true) && run.status === 0;
      if (kind === "solution" && !passed)
        throw new Error(
          `${c.id} reference failed: ${run.stdout} ${run.stderr}`,
        );
      if (kind === "starter" && passed)
        throw new Error(`${c.id} starter already passes every check`);
    }
    console.log(
      `${c.id}: reference passes ${c.tests.length} checks; starter requires implementation`,
    );
  }
  console.log(`Verified ${challenges.length} C++ mini-labs with native Clang.`);
} finally {
  rmSync(directory, { recursive: true, force: true });
}
