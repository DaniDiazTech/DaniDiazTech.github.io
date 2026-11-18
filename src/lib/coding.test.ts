import { describe, it, expect } from "vitest";
import {
  challenges,
  fullSource,
  readChecks,
  isPassed,
} from "../content/challenges";
import { lessons } from "../content/curriculum";
import { parseProgress, freshProgress } from "./progress";
describe("coding drafts and transparent checks", () => {
  it("has a related mini-lab for every lesson and meaningful case descriptions", () => {
    expect(challenges).toHaveLength(38);
    expect(new Set(challenges.map((c) => c.id)).size).toBe(38);
    for (const lesson of lessons)
      expect(
        challenges.some((c) => c.lessonIds.includes(lesson.id)),
        lesson.id,
      ).toBe(true);
    for (const c of challenges) {
      expect(c.tests.length).toBeGreaterThanOrEqual(3);
      expect(c.transfer.length).toBeGreaterThan(30);
      expect(c.hints).toHaveLength(2);
      expect(c.starter).not.toBe(c.solution);
      expect(fullSource(c, c.solution)).toContain("int main()");
    }
  });
  it("keeps missing check reports incomplete and accepts only complete markers", () => {
    expect(readChecks("ML_TEST\t0\t1\nML_TEST\t1\t0\n", 3)).toEqual([
      true,
      false,
      null,
    ]);
    expect(readChecks("fake ML_TEST\t0\t1\n", 1)).toEqual([null]);
  });
  it("invalidates a passed record when the current draft differs", () => {
    const r = {
      code: "return 1;",
      testedCode: "return 1;",
      passedChecks: 3,
      runSucceeded: true,
      totalChecks: 3,
      updated: "today",
    };
    expect(isPassed(r)).toBe(true);
    expect(isPassed({ ...r, runSucceeded: false })).toBe(false);
    expect(isPassed({ ...r, code: "return 0;" })).toBe(false);
  });
  it("imports older backups without losing notes and defaults missing coding state", () => {
    const old = { ...freshProgress(), notes: { "00-01": "keep me" } };
    delete (old as Partial<typeof old>).coding;
    const restored = parseProgress(JSON.stringify(old));
    expect(restored.notes["00-01"]).toBe("keep me");
    expect(restored.coding).toEqual({});
  });
  it("round trips drafts and rejects malformed or oversized coding records", () => {
    const p = freshProgress(),
      c = challenges[0];
    p.coding[c.id] = {
      code: c.solution,
      testedCode: c.solution,
      passedChecks: c.tests.length,
      runSucceeded: true,
      totalChecks: c.tests.length,
      updated: "2026-11-18",
    };
    expect(parseProgress(JSON.stringify(p)).coding).toEqual(p.coding);
    p.coding[c.id].code = "x".repeat(50001);
    expect(parseProgress(JSON.stringify(p)).coding).toEqual({});
    expect(() => parseProgress('{"version":1,"coding":[]}')).toThrow();
  });
});
