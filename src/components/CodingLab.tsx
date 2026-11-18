import { useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  Play,
  Square,
  RotateCcw,
  Download,
  CheckCircle2,
  Code2,
  ChevronRight,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import {
  challenges,
  fullSource,
  includes,
  isPassed,
  readChecks,
  type CodingRecord,
  type Challenge,
} from "../content/challenges";
import { runCpp, type CompileResult } from "../lib/compiler";
import { stages } from "../content/curriculum";

type Props = {
  lessonId?: string;
  records: Record<string, CodingRecord>;
  onSave: (id: string, value: CodingRecord) => void;
};
function download(name: string, source: string) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([source], { type: "text/plain" }));
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
function Workspace({
  challenge: c,
  records,
  onSave,
}: Props & { challenge: Challenge }) {
  const [code, setCode] = useState(records[c.id]?.code ?? c.starter),
    [busy, setBusy] = useState(false),
    [status, setStatus] = useState(
      isPassed(records[c.id])
        ? "Restored a previously passing version. Run again to recheck it."
        : "Ready when you are.",
    ),
    [result, setResult] = useState<CompileResult | null>(null),
    [error, setError] = useState(""),
    [hints, setHints] = useState(0),
    [revealed, setRevealed] = useState(false),
    [reset, setReset] = useState(false),
    [attempted, setAttempted] = useState(!!records[c.id]?.testedCode);
  const cancel = useRef<(() => void) | null>(null),
    generation = useRef(0);
  useEffect(
    () => () => {
      generation.current++;
      cancel.current?.();
    },
    [],
  );
  // Backup import can replace a draft while the selected challenge stays mounted.
  useEffect(() => {
    const saved = records[c.id];
    if (saved && saved.code !== code && !busy) setCode(saved.code);
  }, [records[c.id]?.updated]);
  const record = records[c.id],
    passed = isPassed(record) && record?.code === code,
    checks = result
      ? readChecks(result.stdout, c.tests.length)
      : c.tests.map(() => (passed ? true : null));
  const save = (next: string) => {
    setCode(next);
    setResult(null);
    setError("");
    setStatus("Draft saved on this device. Run checks to test this version.");
    onSave(c.id, {
      code: next,
      testedCode: record?.testedCode || "",
      passedChecks: record?.passedChecks || 0,
      runSucceeded: record?.runSucceeded || false,
      totalChecks: c.tests.length,
      updated: new Date().toISOString(),
    });
  };
  async function run() {
    if (busy) return;
    const token = ++generation.current,
      snapshot = code;
    setBusy(true);
    setError("");
    setResult(null);
    setAttempted(true);
    setStatus("Starting the browser compiler…");
    const task = runCpp(fullSource(c, snapshot), (event) => {
      if (token !== generation.current) return;
      if (event.type === "phase")
        setStatus(
          (
            {
              loading: "Loading compiler assets…",
              compiling: "Compiling C++20…",
              linking: "Linking WebAssembly…",
              running: "Running the checks…",
            } as Record<string, string>
          )[event.phase] || event.phase,
        );
      else
        setStatus(
          `Loading ${event.name}: ${(event.loaded / 1e6).toFixed(1)}${event.total ? ` / ${(event.total / 1e6).toFixed(1)}` : ""} MB`,
        );
    });
    cancel.current = task.cancel;
    try {
      const output = await task.promise;
      if (token !== generation.current) return;
      setResult(output);
      const statuses = readChecks(output.stdout, c.tests.length),
        count = statuses.filter((v) => v === true).length;
      const valid =
        output.exitCode === 0 &&
        !output.trap &&
        statuses.every((v) => v === true);
      onSave(c.id, {
        code: snapshot,
        testedCode: snapshot,
        passedChecks: count,
        runSucceeded: output.exitCode === 0 && !output.trap,
        totalChecks: c.tests.length,
        updated: new Date().toISOString(),
      });
      setStatus(
        valid
          ? `All ${c.tests.length} checks passed.`
          : output.trap
            ? `Runtime failure: ${output.trap}`
            : `${count} of ${c.tests.length} checks passed. Inspect the failing examples.`,
      );
    } catch (e) {
      if (token !== generation.current) return;
      setError(e instanceof Error ? e.message : String(e));
      setStatus("Run did not finish. Read the diagnostic below.");
    } finally {
      if (token === generation.current) {
        setBusy(false);
        cancel.current = null;
      }
    }
  }
  return (
    <section
      className="coding-workspace"
      aria-label="C++ implementation exercise"
    >
      <div className="coding-heading">
        <div>
          <div className="eyebrow">IMPLEMENT → TEST → EXPLAIN</div>
          <h2>{c.title}</h2>
        </div>
        <span className="tag">≈ {c.minutes} min</span>
      </div>
      <p className="coding-prompt">{c.prompt}</p>
      <div className="compiler-note">
        <Code2 size={18} />
        <div>
          <strong>Real C++20. Runs on your device.</strong>
          <p>
            The first run downloads about 28 MB of compiler and standard-library
            assets. Loading is opt-in. Compilation and execution run in an
            isolated worker; your code is not sent to a compiler service.
            Browser memory use can be substantial.
          </p>
          <p>
            CPU snippets only: no Metal, networking, threads, CMake, or C++
            exceptions in this runner. Run the larger labs locally.
          </p>
        </div>
      </div>
      <div className="editor-shell">
        <div className="editor-file">
          <span>
            <Code2 size={15} /> implementation.cpp
          </span>
          <span>Clang 22 · WASI · C++20</span>
        </div>
        <div className="editor-includes">
          <details>
            <summary>Available standard headers</summary>
            <pre>{includes}</pre>
          </details>
        </div>
        <CodeMirror
          value={code}
          height="310px"
          theme={oneDark}
          extensions={[
            cpp(),
            EditorView.contentAttributes.of({
              "aria-label": "C++ code editor",
            }),
          ]}
          editable={!busy}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
          }}
          indentWithTab={false}
          onChange={save}
          aria-label="C++ code editor"
        />
      </div>
      <div className="editor-toolbar">
        <button className="primary" onClick={run} disabled={busy}>
          <Play size={15} />
          {busy ? "Running…" : "Run checks"}
        </button>
        {busy && (
          <button onClick={() => cancel.current?.()}>
            <Square size={14} /> Stop
          </button>
        )}
        <button
          disabled={busy}
          onClick={() => download(c.id + ".cpp", fullSource(c, code))}
        >
          <Download size={15} /> Download with tests
        </button>
        <button disabled={busy} onClick={() => setReset(true)}>
          <RotateCcw size={15} /> Reset
        </button>
        {passed && (
          <span className="coding-passed">
            <CheckCircle2 size={16} /> This version passed
          </span>
        )}
      </div>
      {reset && (
        <div className="reset-draft">
          <p>
            Replace this draft with the starter? Download your version first if
            you want to keep it.
          </p>
          <button
            onClick={() => {
              save(c.starter);
              setReset(false);
            }}
          >
            Replace draft
          </button>
          <button onClick={() => setReset(false)}>Keep draft</button>
        </div>
      )}
      <p className="run-status" role="status" aria-live="polite">
        {status}
      </p>
      {error && (
        <pre className="compiler-error" role="alert">
          {error}
        </pre>
      )}
      <div className="coding-checks">
        <h3>Visible checks</h3>
        <p>
          Every check compiles and calls your function. These are learning
          fixtures, not hidden grading or proof that the implementation works
          for all inputs.
        </p>
        {c.tests.map((t, i) => (
          <div
            className={`coding-test ${checks[i] === false ? "test-failed" : checks[i] === true ? "test-passed" : ""}`}
            key={t.name}
          >
            <span className="test-icon">
              {checks[i] === true ? "✓" : checks[i] === false ? "×" : i + 1}
            </span>
            <div>
              <strong>{t.name}</strong>
              <code>{t.assertion}</code>
              <p>
                {checks[i] === false ? "Revisit: " : ""}
                {t.reason}
              </p>
            </div>
            <span className="test-result">
              {checks[i] === true
                ? "PASS"
                : checks[i] === false
                  ? "FAIL"
                  : "NOT RUN"}
            </span>
          </div>
        ))}
      </div>
      {result && (
        <details className="compiler-output">
          <summary>
            Program output & compiler diagnostics · exit {result.exitCode}
            {result.trap ? " · runtime trap" : ""}
          </summary>
          <pre>
            {result.stdout.replace(/\x1b\[[0-9;]*m/g, "") || "(No output)"}
          </pre>
          <pre>{result.diagnostics}</pre>
        </details>
      )}
      <div className="coding-hints">
        <h3>
          <Lightbulb size={17} /> Think before revealing
        </h3>
        {c.hints.slice(0, hints).map((hint, i) => (
          <p key={hint}>
            <strong>Hint {i + 1}.</strong> {hint}
          </p>
        ))}
        {hints < c.hints.length && (
          <button onClick={() => setHints((v) => v + 1)}>
            Reveal hint {hints + 1}
          </button>
        )}
        <details
          onToggle={(e) => {
            if (e.currentTarget.open) setRevealed(true);
          }}
        >
          <summary>
            Reference implementation{" "}
            {attempted
              ? "· compare after your attempt"
              : "· try the starter before opening"}
          </summary>
          {revealed && (
            <>
              <pre>
                <code>{c.solution}</code>
              </pre>
              <p>{c.explanation}</p>
              <button disabled={busy} onClick={() => save(c.solution)}>
                Load reference into editor
              </button>
              <p>
                Running the reference is useful for comparison; it is not
                evidence that you can implement the concept independently.
              </p>
            </>
          )}
        </details>
      </div>
      <div className="transfer-task">
        <strong>Now transfer the idea</strong>
        <p>{c.transfer}</p>
        <p>
          After passing, explain one failing case in your own words and make the
          extension locally. Mini-lab checks do not automatically complete the
          lesson or its larger assignment.
        </p>
      </div>
      <p className="compiler-credits">
        <a href="/compiler/README.md" target="_blank" rel="noreferrer">
          Runtime, limits & licenses <ExternalLink size={12} />
        </a>
      </p>
    </section>
  );
}
export default function CodingLab(props: Props) {
  const relevant = props.lessonId
    ? challenges.filter((c) => c.lessonIds.includes(props.lessonId!))
    : challenges;
  const [active, setActive] = useState(relevant[0]?.id || challenges[0].id),
    [stage, setStage] = useState("all"),
    [query, setQuery] = useState("");
  const selected = relevant.find((c) => c.id === active) || relevant[0];
  const shown = relevant.filter(
    (c) =>
      (stage === "all" || c.stage === +stage) &&
      (c.title + " " + c.prompt).toLowerCase().includes(query.toLowerCase()),
  );
  if (!selected)
    return (
      <p>
        This lesson’s full implementation is a local lab. Browse the coding
        practice bench for smaller prerequisite drills.
      </p>
    );
  const workspace = (
    <Workspace key={selected.id} {...props} challenge={selected} />
  );
  if (props.lessonId)
    return (
      <div className="lesson-coding">
        <div className="eyebrow">QUICK SKILL DRILL · BEFORE THE LARGER LAB</div>
        {workspace}
      </div>
    );
  return (
    <>
      <div className="eyebrow">A SMALL IMPLEMENTATION, A REAL RESULT</div>
      <h1>The coding bench.</h1>
      <p className="lede">
        38 focused C++ challenges. Write a function, run the visible checks,
        inspect a counterexample, then extend it.{" "}
        {challenges.filter((c) => isPassed(props.records[c.id])).length} of{" "}
        {challenges.length} current drafts passed.
      </p>
      <div className="practice-layout">
        <aside className="practice-library">
          <label>
            Find a skill
            <input
              aria-label="Search coding challenges"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Gradients, softmax, shapes…"
            />
          </label>
          <label>
            Stage
            <select
              aria-label="Filter coding stage"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
            >
              <option value="all">All stages</option>
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} · {s.short}
                </option>
              ))}
            </select>
          </label>
          <div className="practice-list">
            {shown.map((c) => (
              <button
                className={selected.id === c.id ? "active" : ""}
                key={c.id}
                onClick={() => setActive(c.id)}
              >
                <span>
                  {isPassed(props.records[c.id]) ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <Code2 size={15} />
                  )}
                </span>
                <span>
                  <small>
                    STAGE {c.stage} · {c.minutes} MIN
                  </small>
                  <strong>{c.title}</strong>
                </span>
                <ChevronRight size={14} />
              </button>
            ))}
            {!shown.length && <p>No matching drills. Try another concept.</p>}
          </div>
        </aside>
        {workspace}
      </div>
    </>
  );
}
