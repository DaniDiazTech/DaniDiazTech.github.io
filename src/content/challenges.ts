import data from "./challenges.json" with { type: "json" };
export type Challenge = {
  id: string;
  lessonIds: string[];
  stage: number;
  title: string;
  minutes: number;
  prompt: string;
  starter: string;
  solution: string;
  tests: { name: string; assertion: string; reason: string }[];
  hints: string[];
  explanation: string;
  transfer: string;
};
export const challenges: Challenge[] = data;
export const includes = `#include <cmath>\n#include <cstdio>\n#include <vector>\n#include <string>\n#include <algorithm>\n`;
export function fullSource(challenge: Challenge, code: string) {
  const checks = challenge.tests
    .map(
      (t, i) =>
        `    { const bool passed = (${t.assertion}); std::printf("ML_TEST\\t${i}\\t%d\\n", passed ? 1 : 0); if(!passed) ++failures; }`,
    )
    .join("\n");
  return `${includes}\n// Your implementation\n${code}\n// Visible verification harness, supplied by Model Lab\nnamespace {\nbool near(double a,double b){return std::isfinite(a)&&std::isfinite(b)&&std::abs(a-b)<=1e-6;}\nbool vector_near(const std::vector<double>& a,const std::vector<double>& b){if(a.size()!=b.size())return false;for(std::size_t i=0;i<a.size();++i)if(!near(a[i],b[i]))return false;return true;}\n}\nint main(){\n    int failures=0;\n${checks}\n    return failures ? 1 : 0;\n}\n`;
}
export type CodingRecord = {
  code: string;
  testedCode: string;
  passedChecks: number;
  runSucceeded: boolean;
  totalChecks: number;
  updated: string;
};
export function readChecks(stdout: string, count: number): (boolean | null)[] {
  const checks: Array<boolean | null> = Array(count).fill(null);
  for (const line of stdout.split("\n")) {
    const match = /^ML_TEST\t(\d+)\t([01])$/.exec(line);
    if (match) {
      const i = Number(match[1]);
      if (i < count) checks[i] = match[2] === "1";
    }
  }
  return checks;
}
export const isPassed = (record: CodingRecord | undefined) =>
  !!record &&
  record.code === record.testedCode &&
  record.runSucceeded &&
  record.totalChecks > 0 &&
  record.passedChecks === record.totalChecks;
