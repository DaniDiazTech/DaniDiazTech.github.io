import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { challenges, fullSource } from "../src/content/challenges";
test.describe.configure({ mode: "serial" });

test("edit, compile and run real C++ checks, retain drafts, and export them", async ({
  page,
}, info) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const remote: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("godbolt") || r.url().includes("judge0"))
      remote.push(r.url());
  });
  await page.goto("/#/lesson/01-05");
  await page.getByRole("tab", { name: "Exercises", exact: true }).click();
  const editor = page.getByRole("textbox", {
    name: "C++ code editor",
    exact: true,
  });
  await expect(editor).toBeVisible();
  await page.getByRole("button", { name: "Run checks", exact: true }).click();
  await expect(page.locator(".run-status")).toContainText(
    "Inspect the failing examples",
    { timeout: 90000 },
  );
  await expect(page.locator(".test-failed")).not.toHaveCount(0);
  const c = challenges.find((c) => c.id === "gradient-step")!;
  await editor.fill(c.solution);
  await page.getByRole("button", { name: "Run checks", exact: true }).click();
  await expect(page.locator(".run-status")).toHaveText("All 5 checks passed.", {
    timeout: 60000,
  });
  await expect(page.locator(".test-passed")).toHaveCount(5);
  await expect(
    page.getByRole("button", { name: "Mark complete", exact: true }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("tab", { name: "Exercises", exact: true }).click();
  await expect(editor).toContainText("w-eta*2*(w-3)");
  await expect(page.locator(".coding-passed")).toContainText(
    "This version passed",
  );
  await page.screenshot({
    path: info.outputPath("coding-bench.png"),
    fullPage: true,
  });
  await editor.fill("double descent_step(double w, double eta) { return w; }");
  await expect(page.locator(".coding-passed")).toHaveCount(0);
  const backup = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("model-lab.progress.v1") || "{}"),
  );
  expect(backup.coding["gradient-step"].code).toContain("return w;");
  expect(backup.completed).not.toContain("01-05");
  expect(backup.coding["gradient-step"].testedCode).toContain("w-eta");
  await page.goto("/#/settings");
  const downloading = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export progress & notes" }).click();
  const downloaded = await downloading;
  const file = info.outputPath("coding-backup.json");
  await downloaded.saveAs(file);
  const exported = JSON.parse(fs.readFileSync(file, "utf8"));
  expect(exported.coding["gradient-step"]).toEqual(
    backup.coding["gradient-step"],
  );
  await page
    .getByRole("button", { name: "Reset progress…", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirm reset", exact: true })
    .click();
  await page.getByLabel("Import JSON backup").setInputFiles(file);
  await expect(page.getByRole("status")).toContainText("imported successfully");
  await page.goto("/#/lesson/01-05");
  await page.getByRole("tab", { name: "Exercises", exact: true }).click();
  await expect(editor).toContainText("return w;");
  await expect(page.locator(".coding-passed")).toHaveCount(0);
  expect(remote).toEqual([]);
  expect(errors).toEqual([]);
});

test("compiler handles syntax errors, bounded loops, stop, and retry", async ({
  page,
}) => {
  test.setTimeout(180000);
  await page.goto("/#/practice");
  const editor = page.getByRole("textbox", {
    name: "C++ code editor",
    exact: true,
  });
  await editor.fill(
    "double squared_error(double w, double x, double y) { this is broken; }",
  );
  await page.getByRole("button", { name: "Run checks", exact: true }).click();
  await expect(page.locator(".compiler-error")).toContainText("error:", {
    timeout: 90000,
  });
  await editor.fill(
    "double squared_error(double w, double x, double y) { volatile int n=1; while(n) {} return 0; }",
  );
  await page.getByRole("button", { name: "Run checks", exact: true }).click();
  await expect(page.locator(".compiler-error")).toContainText(
    "Time limit reached",
    { timeout: 60000 },
  );
  await editor.fill(challenges[0].solution);
  await page.getByRole("button", { name: "Run checks", exact: true }).click();
  await expect(page.locator(".run-status")).toContainText("checks passed", {
    timeout: 60000,
  });
  await page.getByRole("button", { name: "Run checks", exact: true }).click();
  await page.getByRole("button", { name: "Stop", exact: true }).click();
  await expect(page.locator(".compiler-error")).toContainText(
    "Execution stopped",
  );
  await expect(
    page.getByRole("button", { name: "Run checks", exact: true }),
  ).toBeEnabled();
});

test("representative C++ reference implementations execute in the browser worker", async ({
  page,
}, info) => {
  test.skip(
    info.project.name === "mobile",
    "The real editor flow already runs on mobile; run the broader compiler matrix once.",
  );
  test.setTimeout(180000);
  await page.goto("/#/practice");
  for (const id of [
    "dot-product",
    "stable-binary-loss",
    "cpu-matmul",
    "stable-softmax",
    "utf8-count",
    "causal-weights",
    "rank-one-lora",
    "rule-boundary",
  ]) {
    const c = challenges.find((c) => c.id === id)!;
    const result = await page.evaluate(
      (source) =>
        new Promise<{
          type: string;
          stdout: string;
          exitCode: number;
          trap?: string;
          message?: string;
        }>((resolve, reject) => {
          const w = new Worker("/compiler/worker.js", { type: "module" });
          const timer = setTimeout(() => {
            w.terminate();
            reject(new Error("Worker timed out"));
          }, 60000);
          w.onerror = (e) => {
            clearTimeout(timer);
            w.terminate();
            reject(new Error(e.message));
          };
          w.onmessage = ({ data }) => {
            if (data.type === "result" || data.type === "error") {
              clearTimeout(timer);
              w.terminate();
              resolve(data);
            }
          };
          w.postMessage({ source });
        }),
      fullSource(c, c.solution),
    );
    expect(result.type, `${id}: ${result.message || ""}`).toBe("result");
    expect(result.exitCode, id).toBe(0);
    expect(result.trap, id).toBeNull();
    expect(result.stdout.match(/ML_TEST\t\d+\t1/g), id).toHaveLength(
      c.tests.length,
    );
  }
});
