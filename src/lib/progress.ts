import { lessons } from "../content/curriculum";
import { challenges, type CodingRecord } from "../content/challenges";
export const STORAGE_KEY = "model-lab.progress.v1";
export type Progress = {
  version: 1;
  completed: string[];
  exercises: string[];
  bookmarks: string[];
  notes: Record<string, string>;
  opened: Record<string, string>;
  quizzes: Record<string, { choice: number; correct: boolean }>;
  lastLesson: string;
  pace: number;
  projects: number[];
  coding: Record<string, CodingRecord>;
};
export const freshProgress = (): Progress => ({
  version: 1,
  completed: [],
  exercises: [],
  bookmarks: [],
  notes: {},
  opened: {},
  quizzes: {},
  lastLesson: lessons[0].id,
  pace: 8,
  projects: [],
  coding: {},
});
const ids = new Set(lessons.map((l) => l.id));
export function parseProgress(raw: string): Progress {
  const p: unknown = JSON.parse(raw);
  if (!p || typeof p !== "object" || !("version" in p) || p.version !== 1)
    throw new Error("Unsupported backup version. Expected version 1.");
  const v = p as Record<string, unknown>,
    out = freshProgress();
  for (const key of ["completed", "exercises", "bookmarks"] as const) {
    if (v[key] !== undefined && !Array.isArray(v[key]))
      throw new Error(`Invalid ${key} list.`);
    out[key] = [
      ...new Set(
        ((v[key] as unknown[]) || []).filter(
          (x): x is string => typeof x === "string" && ids.has(x),
        ),
      ),
    ];
  }
  for (const key of ["notes", "opened"] as const) {
    if (
      v[key] !== undefined &&
      (!v[key] || typeof v[key] !== "object" || Array.isArray(v[key]))
    )
      throw new Error(`Invalid ${key}.`);
    out[key] = Object.fromEntries(
      Object.entries(v[key] || {}).filter(
        ([id, s]) => ids.has(id) && typeof s === "string" && s.length <= 200000,
      ),
    ) as Record<string, string>;
  }
  if (v.quizzes && typeof v.quizzes === "object")
    for (const [id, q] of Object.entries(v.quizzes)) {
      const l = lessons.find((l) => l.id === id);
      if (
        l &&
        q &&
        typeof q === "object" &&
        Number.isInteger(q.choice) &&
        q.choice >= 0 &&
        q.choice < l.options.length
      )
        out.quizzes[id] = { choice: q.choice, correct: q.choice === l.answer };
    }
  out.lastLesson =
    typeof v.lastLesson === "string" && ids.has(v.lastLesson)
      ? v.lastLesson
      : out.lastLesson;
  out.pace = [4, 8, 12].includes(Number(v.pace)) ? Number(v.pace) : 8;
  out.projects = Array.isArray(v.projects)
    ? [
        ...new Set(
          v.projects.filter(
            (n): n is number => Number.isInteger(n) && n >= 0 && n < 12,
          ),
        ),
      ]
    : [];
  if (v.coding !== undefined) {
    if (!v.coding || typeof v.coding !== "object" || Array.isArray(v.coding))
      throw new Error("Invalid coding drafts.");
    for (const [id, record] of Object.entries(v.coding)) {
      const challenge = challenges.find((c) => c.id === id);
      if (!challenge || !record || typeof record !== "object") continue;
      const r = record as Record<string, unknown>;
      if (
        typeof r.code !== "string" ||
        r.code.length > 50000 ||
        typeof r.testedCode !== "string" ||
        r.testedCode.length > 50000 ||
        !Number.isInteger(r.passedChecks) ||
        Number(r.passedChecks) < 0 ||
        Number(r.passedChecks) > challenge.tests.length ||
        r.totalChecks !== challenge.tests.length ||
        typeof r.updated !== "string"
      )
        continue;
      out.coding[id] = {
        code: r.code,
        testedCode: r.testedCode,
        passedChecks: Number(r.passedChecks),
        runSucceeded: r.runSucceeded === true,
        totalChecks: challenge.tests.length,
        updated: r.updated,
      };
    }
  }
  return out;
}
export function loadProgress(): { data: Progress; warning: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return { data: raw ? parseProgress(raw) : freshProgress(), warning: "" };
  } catch {
    return {
      data: freshProgress(),
      warning:
        "Saved progress could not be read. A fresh session is active; import a valid backup in Settings.",
    };
  }
}
export function stats(p: Progress) {
  const done = lessons.filter((l) => p.completed.includes(l.id));
  return {
    count: done.length,
    percent: Math.round((done.length / lessons.length) * 100),
    remaining: lessons
      .filter((l) => !p.completed.includes(l.id))
      .reduce((s, l) => s + l.minutes, 0),
    minutes: done.reduce((s, l) => s + l.minutes, 0),
  };
}
export function downloadJSON(p: Progress) {
  const blob = new Blob([JSON.stringify(p, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "model-lab-progress.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
