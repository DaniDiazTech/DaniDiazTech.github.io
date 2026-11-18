import { describe, it, expect, beforeEach } from "vitest";
import {
  parseProgress,
  freshProgress,
  loadProgress,
  stats,
  STORAGE_KEY,
} from "./progress";
import { lessons, totalMinutes, stages } from "../content/curriculum";
import { videos } from "../content/resources";
import { softmax } from "../components/Playgrounds";
describe("backup validation and progress", () => {
  beforeEach(() => localStorage.clear());
  it("round trips actual notes, pace, history and completion", () => {
    const p = freshProgress();
    p.completed = ["00-01"];
    p.notes["00-01"] = "Chain rule → sum paths";
    p.pace = 4;
    p.bookmarks = ["01-03"];
    p.opened["00-01"] = "2026-11-18";
    expect(parseProgress(JSON.stringify(p))).toEqual(p);
  });
  it("handles corrupt storage without crashing", () => {
    localStorage.setItem(STORAGE_KEY, "{broken");
    expect(loadProgress().data).toEqual(freshProgress());
    expect(loadProgress().warning).toContain("could not be read");
  });
  it("rejects unsupported and malformed backups", () => {
    expect(() => parseProgress('{"version":3}')).toThrow();
    expect(() => parseProgress('{"version":1,"notes":[]}')).toThrow();
    expect(() => parseProgress("null")).toThrow();
  });
  it("filters unknown IDs, deduplicates and recomputes quiz correctness", () => {
    const p = parseProgress(
      JSON.stringify({
        ...freshProgress(),
        completed: ["00-01", "00-01", "bad"],
        quizzes: { "00-01": { choice: 1, correct: true } },
      }),
    );
    expect(p.completed).toEqual(["00-01"]);
    expect(p.quizzes["00-01"].correct).toBe(false);
  });
  it("calculates authored remaining time and completion", () => {
    const p = freshProgress();
    expect(stats(p).remaining).toBe(totalMinutes);
    p.completed = ["00-01"];
    expect(stats(p).remaining).toBe(totalMinutes - lessons[0].minutes);
    p.completed = lessons.map((l) => l.id);
    expect(stats(p).percent).toBe(100);
    expect(stats(p).remaining).toBe(0);
  });
});
describe("curriculum integrity", () => {
  it("contains sixty complete units and resolved prerequisites in order", () => {
    expect(stages).toHaveLength(12);
    expect(lessons).toHaveLength(60);
    const seen = new Set<string>();
    for (const l of lessons) {
      expect(seen.has(l.id)).toBe(false);
      for (const id of l.prerequisites) expect(seen.has(id)).toBe(true);
      seen.add(l.id);
      for (const key of [
        "why",
        "equation",
        "example",
        "exercise",
        "guidance",
        "expected",
        "validation",
        "mistake",
        "question",
        "connection",
      ] as const)
        expect(l[key].length).toBeGreaterThan(10);
      expect(l.resources.length).toBeGreaterThan(0);
      expect(l.options[l.answer]).toBeTruthy();
      expect(videos[l.video]).toBeTruthy();
      expect(l.completion).toHaveLength(3);
    }
  });
  it("provides fuller explanatory foundations", () => {
    for (const l of lessons.slice(0, 25)) expect(l.explanation).toHaveLength(3);
  });
  it("uses valid verified IDs for embedded videos", () => {
    for (const v of Object.values(videos))
      if (v.id) {
        expect(v.id).toMatch(/^[A-Za-z0-9_-]{11}$/);
        expect(v.url).toContain(v.id);
        expect(v.verified).toContain("2026-11-18");
      }
  });
});
describe("attention arithmetic", () => {
  it("normalizes stable shifted scores and masks future entries", () => {
    const a = softmax([1000, 1001, -Infinity]),
      b = softmax([0, 1, -Infinity]);
    expect(a[0]).toBeCloseTo(b[0], 12);
    expect(a[2]).toBe(0);
    expect(a.reduce((s, v) => s + v, 0)).toBeCloseTo(1, 12);
  });
});
