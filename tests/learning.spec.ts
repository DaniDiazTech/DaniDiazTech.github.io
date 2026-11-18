import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
test("start, persist notes/bookmarks/completion, navigate, and export/import", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Build understanding/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Start learning", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "What you are building", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Bookmark lesson", exact: true })
    .click();
  await page.getByRole("tab", { name: "Notes", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Personal lesson notes" })
    .fill("My first model predicts a next-token distribution.");
  await page
    .getByRole("button", { name: "Mark complete", exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Completed · undo" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Remove bookmark" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Notes", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "Personal lesson notes" }),
  ).toHaveValue("My first model predicts a next-token distribution.");
  await page.getByRole("tab", { name: "Knowledge Check", exact: true }).click();
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Correct");
  await page.getByRole("link", { name: /NEXT LESSON/ }).click();
  await expect(page).toHaveURL(/00-02/);
  await page.getByRole("link", { name: /PREVIOUS LESSON/ }).click();
  await expect(page).toHaveURL(/00-01/);
  await page.goto("/#/settings");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export progress & notes" }).click();
  const file = await download;
  const dest = info.outputPath("backup.json");
  await file.saveAs(dest);
  const data = JSON.parse(fs.readFileSync(dest, "utf8"));
  expect(data.completed).toContain("00-01");
  expect(data.notes["00-01"]).toContain("next-token");
  await page.getByRole("button", { name: "4 hours" }).click();
  await page.getByLabel("Import JSON backup").setInputFiles(dest);
  await expect(page.getByRole("status")).toContainText("imported successfully");
  await expect(page.getByRole("button", { name: "8 hours" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByLabel("Import JSON backup").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":99}'),
  });
  await expect(page.getByRole("status")).toContainText("Import failed");
  expect(errors).toEqual([]);
});
test("search, filters, roadmap, bookmarks and deep refresh", async ({
  page,
}) => {
  await page.goto("/#/library");
  await page
    .getByRole("textbox", { name: "Search lessons", exact: true })
    .fill("RoPE");
  await expect(page.locator(".lesson-card").first()).toBeVisible();
  await page
    .getByRole("textbox", { name: "Search lessons", exact: true })
    .fill("");
  await page.getByLabel("Filter by stage").selectOption("1");
  await expect(page.locator(".lesson-card")).toHaveCount(5);
  await page.getByLabel("Filter by duration").selectOption("short");
  await expect(page.locator(".lesson-card")).toHaveCount(4);
  await page.getByLabel("Filter by completion").selectOption("complete");
  await expect(page.locator(".lesson-card")).toHaveCount(0);
  await page.goto("/#/roadmap");
  await expect(page.locator(".stage")).toHaveCount(12);
  await page.locator(".stage-lessons a").nth(8).click();
  await page.reload();
  await expect(
    page.getByRole("heading", {
      name: "Probability, logarithms & cross-entropy",
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Exercises", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "Download C++ lab bundle" }),
  ).toHaveAttribute("href", "/labs/model-lab-cpp.zip");
  await page.goto("/#/bookmarks");
  await expect(
    page.getByRole("heading", { name: "No matching bookmarks yet" }),
  ).toBeVisible();
});
test("interactive simulations perform observable calculations", async ({
  page,
}) => {
  await page.goto("/#/playground");
  const before = await page.getByTestId("parameter").textContent();
  await page.getByRole("button", { name: "Take a step" }).click();
  expect(await page.getByTestId("parameter").textContent()).not.toBe(before);
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.getByTestId("parameter")).toHaveText("-3.00000");
  await page.getByRole("button", { name: /Neural network Trace/ }).click();
  await page
    .getByRole("button", { name: "Train this weight · step 1" })
    .click();
  await expect(
    page.getByRole("button", { name: "Train this weight · step 2" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Tensor shapes Build/ }).click();
  await page.getByRole("spinbutton", { name: "B rows" }).fill("2");
  await expect(page.getByRole("status")).toContainText("Shape mismatch");
  await page.getByRole("button", { name: /Causal attention Inspect/ }).click();
  await expect(page.locator(".heatmap")).toContainText("—");
  await page.getByRole("checkbox", { name: "Causal mask" }).uncheck();
  await expect(page.locator(".heatmap")).not.toContainText("—");
  await page.getByRole("button", { name: /Tokenization Compare/ }).click();
  await page.getByRole("textbox", { name: "Tokenizer text" }).fill("é");
  await expect(page.locator(".tokens>span")).toHaveCount(1);
  await page.getByLabel("Representation").selectOption("bytes");
  await expect(page.locator(".tokens>span")).toHaveCount(2);
});
test("recovers invalid storage and supports responsive navigation", async ({
  page,
}, info) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("model-lab.progress.v1", "not json"),
  );
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("could not be read");
  await page.getByRole("button", { name: "Dismiss warning" }).click();
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .getByRole("link", { name: "Learning roadmap", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "From zero to your own GPT." }),
    ).toBeVisible();
    await expect(page.locator(".mobile-backdrop")).toHaveCount(0);
  }
  await page.goto("/#/week-one");
  await expect(page.locator(".session")).toHaveCount(5);
  await page.goto("/#/projects");
  await page.getByRole("checkbox").first().check();
  await page.reload();
  await expect(page.getByRole("checkbox").first()).toBeChecked();
  await page.goto("/");
  await expect(page.locator("body")).toHaveJSProperty(
    "scrollWidth",
    await page.evaluate(() => document.documentElement.clientWidth),
  );
  await page.screenshot({
    path: info.outputPath("dashboard.png"),
    fullPage: true,
  });
});
test("all authored lessons render and internal navigation resolves", async ({
  page,
}) => {
  const data = JSON.parse(
    fs.readFileSync(path.resolve("src/content/curriculum.json"), "utf8"),
  );
  for (const lesson of data.lessons) {
    await page.goto(`/#/lesson/${lesson.id}`);
    await expect(
      page.getByRole("heading", { name: lesson.title, exact: true }),
    ).toBeVisible();
    await expect(page.locator(".worked-example")).not.toBeEmpty();
    expect(await page.locator(".katex-error").count()).toBe(0);
  }
});

test("video fallback, keyboard tabs and progress evidence", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("https://www.youtube-nocookie.com/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<html><body>Embed integration fixture</body></html>",
    }),
  );
  await page.goto("/#/lesson/01-01");
  await expect(
    page.getByRole("link", { name: "Watch on YouTube" }),
  ).toHaveAttribute("href", "https://www.youtube.com/watch?v=fNk_zzaMoSs");
  await page.getByRole("button", { name: /Load YouTube player/ }).click();
  await expect(page.locator("iframe")).toHaveAttribute(
    "src",
    /embed\/fNk_zzaMoSs/,
  );
  await expect(page.locator("iframe")).toHaveAttribute(
    "title",
    "Vectors, what even are they?",
  );
  await page.getByRole("tab", { name: "Overview", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Notes", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.getByRole("tab", { name: "Overview", exact: true }).click();
  await page.screenshot({
    path: info.outputPath("lesson.png"),
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Mark complete", exact: true })
    .click();
  await page.goto("/#/progress");
  await expect(page.locator(".stat").first()).toContainText("1/60");
  await expect(page.locator(".stage-progress").nth(1)).toContainText("1/5");
  expect(errors).toEqual([]);
});
