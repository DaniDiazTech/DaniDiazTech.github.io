import {
  useEffect,
  useState,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import {
  HashRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  Download,
  ExternalLink,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  Map,
  Menu,
  PanelLeftClose,
  Play,
  Search,
  Settings,
  Target,
  TrendingUp,
  X,
  FileText,
  Monitor,
  Copy,
  Layers,
  Command,
} from "lucide-react";
import katex from "katex";
import {
  lessons,
  stages,
  lessonById,
  weekOne,
  totalMinutes,
} from "./content/curriculum";
import { videos } from "./content/resources";
import type { Lesson } from "./content/types";
import {
  loadProgress,
  stats,
  STORAGE_KEY,
  parseProgress,
  downloadJSON,
  type Progress,
} from "./lib/progress";
import { Playgrounds, Gradient } from "./components/Playgrounds";
type Store = { p: Progress; update: (fn: (p: Progress) => Progress) => void };
const Context = createContext<Store>(null!);
const useProgress = () => useContext(Context);
const toggle = (items: string[], id: string) =>
  items.includes(id) ? items.filter((x) => x !== id) : [...items, id];
const hour = (m: number) => `${Math.round((m / 60) * 10) / 10}h`;
const lessonURL = (l: Lesson | string) =>
  `/lesson/${typeof l === "string" ? l : l.id}`;
function Tag({ children }: { children: ReactNode }) {
  return <span className="tag">{children}</span>;
}
function MathBlock({ value }: { value: string }) {
  return (
    <div
      className="equation"
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(value, {
          throwOnError: false,
          displayMode: true,
        }),
      }}
    />
  );
}
function LessonCard({ lesson, index }: { lesson: Lesson; index?: number }) {
  const { p } = useProgress();
  return (
    <Link className="lesson-card" to={lessonURL(lesson)}>
      <div className="lesson-art">
        <span className="art-symbol">
          {
            ["⟨x, w⟩", "∂L / ∂w", "Σ exp(x)", "Q Kᵀ", "[B,T,C]"][
              lesson.stage % 5
            ]
          }
        </span>
        <span className="play-disc">
          <Play size={18} fill="currentColor" />
        </span>
        <span className="art-label">{stages[lesson.stage].short}</span>
        {p.completed.includes(lesson.id) && (
          <span className="complete-badge">
            <Check size={14} /> Complete
          </span>
        )}
      </div>
      <div className="lesson-card-body">
        <div className="eyebrow">
          STAGE {String(lesson.stage).padStart(2, "0")} <span>•</span>{" "}
          {lesson.difficulty}
        </div>
        <h3>
          {index !== undefined ? `${index + 1}. ` : ""}
          {lesson.title}
        </h3>
        <p>{lesson.why}</p>
        <div className="card-meta">
          <span>
            <Clock size={13} />
            {lesson.minutes} min
          </span>
          <span>{videos[lesson.video].creator}</span>
          <ArrowUpRight size={16} />
        </div>
      </div>
    </Link>
  );
}
function Dashboard() {
  const { p } = useProgress();
  const s = stats(p);
  const next =
    lessons.find((l) => !p.completed.includes(l.id)) ||
    lessons[lessons.length - 1];
  const current = lessonById(p.lastLesson) || next;
  const recommended = lessons
    .filter((l) => !p.completed.includes(l.id))
    .slice(0, 3);
  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">YOUR PERSONAL LEARNING WORKSPACE</div>
          <h1>
            Build understanding.
            <br />
            <span>Then build your GPT.</span>
          </h1>
        </div>
        <Link className="quiet-link" to="/week-one">
          Your first week <ArrowUpRight size={15} />
        </Link>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <div className="live-label">
            <span /> FROM FIRST PRINCIPLES TO APPLE SILICON
          </div>
          <h2>
            A small model.
            <br />A deep understanding.
          </h2>
          <p>
            From your first gradient in C++ to a Transformer you can train,
            inspect, and run on your Mac. One working experiment at a time.
          </p>
          <Link
            className="primary"
            to={lessonURL(p.completed.includes(current.id) ? next : current)}
          >
            <Play size={16} fill="currentColor" />
            {s.count ? "Continue learning" : "Start learning"}
            <ArrowRight size={17} />
          </Link>
          <div className="hero-foot">
            <span>
              <Code2 size={14} /> C++20 first
            </span>
            <span>
              <Monitor size={14} /> Apple Silicon
            </span>
            <span>
              <Layers size={14} /> 12 stages
            </span>
          </div>
        </div>
        <div className="hero-diagram" aria-label="Language model pipeline">
          <div className="diagram-top">
            <span>YOUR MODEL, FROM SCRATCH</span>
            <Code2 size={17} />
          </div>
          <div className="diagram-tokens">
            <span>the</span>
            <span>model</span>
            <span>learns</span>
            <span className="outlined">?</span>
          </div>
          <div className="connector">↓</div>
          <div className="transformer">
            <span>DECODER BLOCK</span>
            <div>
              Self-attention <span>Q · Kᵀ → V</span>
            </div>
            <div>
              Feed-forward <span>σ(XW + b)</span>
            </div>
            <small>+ residual connections</small>
          </div>
          <div className="connector">↓</div>
          <div className="prob-bars">
            {[
              ["patterns", 82],
              ["language", 58],
              ["slowly", 34],
            ].map(([word, width]) => (
              <div key={word}>
                <span>{word}</span>
                <i style={{ width: `${width}%` }} />
              </div>
            ))}
          </div>
          <div className="diagram-caption">
            Predict. Measure. Backpropagate. Repeat.
          </div>
        </div>
      </section>
      <div className="stat-grid">
        <div className="stat">
          <span>
            YOUR PROGRESS <TrendingUp size={16} />
          </span>
          <strong>
            {s.percent}
            <small>%</small>
          </strong>
          <div className="progress-bar">
            <i style={{ width: `${s.percent}%` }} />
          </div>
          <p>
            {s.count} of {lessons.length} lessons complete
          </p>
        </div>
        <div className="stat">
          <span>
            CURRENT STAGE <Map size={16} />
          </span>
          <strong>
            {String(next.stage).padStart(2, "0")}
            <small> / 11</small>
          </strong>
          <p>{stages[next.stage].title}</p>
        </div>
        <div className="stat">
          <span>
            STUDY RHYTHM <Clock size={16} />
          </span>
          <strong>
            {p.pace}
            <small> h / week</small>
          </strong>
          <p>
            ≈ {Math.ceil(s.remaining / 60 / p.pace)} weeks remaining ·{" "}
            <Link to="/settings">Adjust pace</Link>
          </p>
        </div>
        <div className="stat">
          <span>
            PROJECTS BUILT <Target size={16} />
          </span>
          <strong>
            {p.projects.length}
            <small> / 12</small>
          </strong>
          <p>Evidence matters more than watch time</p>
        </div>
      </div>
      <div className="section-heading">
        <div>
          <span className="eyebrow">THE NEXT SMALL STEP</span>
          <h2>
            {s.count ? "Keep your momentum" : "Begin with the foundations"}
          </h2>
        </div>
        <Link to="/library">
          All lessons <ArrowRight size={16} />
        </Link>
      </div>
      <div className="lesson-grid">
        {recommended.map((l) => (
          <LessonCard key={l.id} lesson={l} />
        ))}
      </div>
      <div className="section-heading">
        <div>
          <span className="eyebrow">A PATH WITH PURPOSE</span>
          <h2>Your roadmap to a working model</h2>
        </div>
        <Link to="/roadmap">
          Explore roadmap <ArrowRight size={16} />
        </Link>
      </div>
      <div className="roadmap-strip">
        {stages.map((st) => (
          <Link key={st.id} to={`/roadmap#stage-${st.id}`}>
            <span
              className={
                st.id === next.stage ? "stage-dot current" : "stage-dot"
              }
            >
              {p.projects.includes(st.id) ? (
                <Check size={15} />
              ) : (
                String(st.id).padStart(2, "0")
              )}
            </span>
            <strong>{st.short}</strong>
            <small>
              {
                lessons.filter(
                  (l) => l.stage === st.id && p.completed.includes(l.id),
                ).length
              }
              /5 lessons
            </small>
          </Link>
        ))}
      </div>
      <div className="two-col">
        <section className="panel">
          <div className="eyebrow">LEARN IT BY BUILDING IT</div>
          <h2>
            Less passive watching.
            <br />
            More “I made this work.”
          </h2>
          <p>
            Change a learning rate. Trace a forward pass. Break a tensor shape.
            Five interactive tools connect the equations to observable behavior.
          </p>
          <Link className="secondary" to="/playground">
            <FlaskConical size={16} /> Open the playground{" "}
            <ArrowRight size={16} />
          </Link>
        </section>
        <section className="panel distinction">
          <div className="eyebrow">TWO GOALS, CLEAR EXPECTATIONS</div>
          <h3>Understand a GPT. Build a useful assistant.</h3>
          <p>
            A tiny model trained from scratch is an achievable engineering
            education. A capable assistant usually benefits from pretrained
            weights, retrieval, and a narrow task.
          </p>
          <p>
            We build both paths and evaluate them on held-out results. Parameter
            count and plausible text are not success metrics.
          </p>
          <Link to="/projects">
            See project outcomes <ArrowRight size={15} />
          </Link>
        </section>
      </div>
    </>
  );
}
function Roadmap() {
  const { p } = useProgress();
  const location = useLocation();
  useEffect(() => {
    if (location.hash)
      document
        .getElementById(location.hash.slice(1))
        ?.scrollIntoView({ behavior: "instant" });
  }, [location]);
  return (
    <>
      <div className="eyebrow">THE COMPLETE LEARNING PATH</div>
      <h1>From zero to your own GPT.</h1>
      <p className="lede">
        12 stages. 60 lessons. {hour(totalMinutes)} of estimated study and lab
        time, with room to go deeper. Browse freely; prerequisites guide the
        order.
      </p>
      <div className="roadmap-list">
        {stages.map((st) => {
          const group = lessons.filter((l) => l.stage === st.id),
            done = group.filter((l) => p.completed.includes(l.id)).length;
          return (
            <section className="stage panel" key={st.id} id={`stage-${st.id}`}>
              <div className="stage-heading">
                <span className="stage-number">
                  {String(st.id).padStart(2, "0")}
                </span>
                <div>
                  <div className="eyebrow">
                    {done}/5 COMPLETE ·{" "}
                    {hour(group.reduce((s, l) => s + l.minutes, 0))}
                  </div>
                  <h2>{st.title}</h2>
                  <p>{st.description}</p>
                </div>
                <Tag>
                  {st.id < 3
                    ? "Foundation"
                    : st.id < 7
                      ? "Intermediate"
                      : "Advanced"}
                </Tag>
              </div>
              <p className="prereq">
                Prerequisite:{" "}
                {st.id ? (
                  <Link to={`/roadmap#stage-${st.id - 1}`}>
                    {stages[st.id - 1].title}
                  </Link>
                ) : (
                  "General programming; no ML experience required"
                )}
              </p>
              <div className="stage-lessons">
                {group.map((l) => (
                  <Link to={lessonURL(l)} key={l.id}>
                    <span>
                      {p.completed.includes(l.id) ? (
                        <CheckCircle2 size={17} className="accent" />
                      ) : (
                        <Play size={16} />
                      )}
                    </span>
                    <strong>{l.title}</strong>
                    <span>{l.minutes} min</span>
                    <ChevronRight size={15} />
                  </Link>
                ))}
              </div>
              <div className="stage-outcome">
                <Target size={20} />
                <div>
                  <strong>Build milestone {st.id + 1}</strong>
                  <p>{st.outcome}</p>
                  <small>Required assignment: {st.assignment}</small>
                </div>
                <Link to={`/projects#project-${st.id}`}>
                  View project <ArrowUpRight size={15} />
                </Link>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
function Library({ bookmarks = false }: { bookmarks?: boolean }) {
  const { p } = useProgress();
  const loc = useLocation();
  const [q, setQ] = useState(new URLSearchParams(loc.search).get("q") || ""),
    [stage, setStage] = useState("all"),
    [level, setLevel] = useState("all"),
    [duration, setDuration] = useState("all"),
    [status, setStatus] = useState("all");
  useEffect(
    () => setQ(new URLSearchParams(loc.search).get("q") || ""),
    [loc.search],
  );
  const found = lessons.filter((l) => {
    const search = [
      l.title,
      l.explanation.join(" "),
      stages[l.stage].title,
      videos[l.video].creator,
      ...l.concepts,
      ...l.resources.map((r) => r.category + " " + r.title),
    ]
      .join(" ")
      .toLowerCase();
    return (
      (!bookmarks || p.bookmarks.includes(l.id)) &&
      search.includes(q.toLowerCase()) &&
      (stage === "all" || l.stage === +stage) &&
      (level === "all" || l.difficulty === level) &&
      (duration === "all" ||
        (duration === "short" ? l.minutes <= 60 : l.minutes > 60)) &&
      (status === "all" ||
        p.completed.includes(l.id) === (status === "complete"))
    );
  });
  return (
    <>
      <div className="eyebrow">
        {bookmarks ? "YOUR SAVED LESSONS" : "THE COURSE LIBRARY"}
      </div>
      <h1>
        {bookmarks
          ? "Keep the useful things close."
          : "Find your next discovery."}
      </h1>
      <p className="lede">
        Search concepts, educators, stages, and resource types. Every lesson
        leads to a working experiment.
      </p>
      <div className="filters">
        <label className="search-field">
          <Search size={18} />
          <input
            aria-label="Search lessons"
            placeholder="Search lessons, concepts, creators…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <label>
          Stage
          <select
            aria-label="Filter by stage"
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
        <label>
          Level
          <select
            aria-label="Filter by difficulty"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="all">All levels</option>
            {["Foundation", "Intermediate", "Advanced"].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </label>
        <label>
          Duration
          <select
            aria-label="Filter by duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="all">Any length</option>
            <option value="short">60 min or less</option>
            <option value="long">Over 60 min</option>
          </select>
        </label>
        <label>
          Status
          <select
            aria-label="Filter by completion"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">Any status</option>
            <option value="complete">Complete</option>
            <option value="incomplete">Not complete</option>
          </select>
        </label>
      </div>
      <p className="muted">{found.length} lessons</p>
      <div className="lesson-grid">
        {found.map((l) => (
          <LessonCard lesson={l} key={l.id} />
        ))}
      </div>
      {!found.length && (
        <div className="empty">
          <Bookmark size={28} />
          <h2>
            {bookmarks
              ? "No matching bookmarks yet"
              : "No lessons match these filters"}
          </h2>
          <p>
            {bookmarks
              ? "Save a lesson using its bookmark control."
              : "Try a broader concept or reset the filters."}
          </p>
          <button
            onClick={() => {
              setQ("");
              setStage("all");
              setLevel("all");
              setDuration("all");
              setStatus("all");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
function Code({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="code-wrap">
      <button
        aria-label="Copy code"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {
            setCopied(false);
          }
        }}
      >
        <Copy size={14} />
        {copied ? "Copied" : "Copy"}
      </button>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}
const starter = `#include <cmath>\n#include <iostream>\n\nint main() {\n    double w = 0.0;\n    constexpr double rate = 0.1;\n    for (int step = 0; step < 50; ++step) {\n        const double gradient = 2.0 * (w - 3.0);\n        w -= rate * gradient;\n        std::cout << step << " " << w << " "\n                  << std::pow(w - 3.0, 2) << "\\n";\n    }\n}`;
function Exercises({ lesson: l }: { lesson: Lesson }) {
  const { p, update } = useProgress();
  const reference =
    l.id === "03-05"
      ? "xor"
      : [
          "orientation",
          "gradient",
          "gradient",
          "autodiff",
          "tensor",
          "bigram",
          "attention",
        ][l.stage] || "attention";
  return (
    <div className="prose">
      <div className="eyebrow">BUILD SOMETHING YOU CAN TEST</div>
      <h2>Your assignment</h2>
      <p>{l.exercise}</p>
      <h3>Implementation constraints</h3>
      <p>{l.guidance}</p>
      <h3>Suggested workspace</h3>
      <Code>{`model-lab-experiments/\n  ${l.lab}/\n    main.cpp\n    tests.cpp\n    CMakeLists.txt\n    results.md`}</Code>
      <h3>Run on macOS</h3>
      <p>
        Download the bundle and extract it. These commands run the CPU reference
        suite; your lesson assignment may extend it. The GPU units require the
        linked Metal-cpp or MLX setup first.
      </p>
      <a className="secondary" href="/labs/model-lab-cpp.zip" download>
        <Download size={16} /> Download C++ lab bundle
      </a>
      <Code>{`# From the extracted labs directory: run this CPU reference first\nclang++ -std=c++20 -O2 -Wall -Wextra ${reference}.cpp -o ${reference}\n./${reference}\n\n# Optional CMake route (install with: brew install cmake)\ncmake -S . -B build -DCMAKE_BUILD_TYPE=Release\ncmake --build build\nctest --test-dir build --output-on-failure`}</Code>
      <h3>Expected observations & validation</h3>
      <p>{l.expected}</p>
      <h3>Keep an experiment record</h3>
      <p>
        In results.md record your hypothesis, command, input, actual output,
        seed, and explanation of any discrepancy. Completion is based on your
        work; this browser does not compile or inspect local C++.
      </p>
      <details>
        <summary>Hint: how to start</summary>
        <p>
          {l.stage < 5
            ? "First reproduce the worked example with constants. Then extract a pure function and test a second input before writing a training loop."
            : "Start with the smallest configuration and a known numerical fixture. Compare against your earlier baseline before scaling."}
        </p>
      </details>
      <details>
        <summary>Reveal solution explanation</summary>
        <p>{l.example}</p>
        <p>{l.mistake}</p>
        <p>For this assignment, the acceptance evidence is: {l.validation}</p>
        {l.stage < 3 && (
          <>
            <p>
              The scalar descent example below illustrates the update. It is a
              reference for gradient descent, not a solution to every
              assignment.
            </p>
            <Code>{starter}</Code>
          </>
        )}
      </details>
      <label className="completion-check">
        <input
          type="checkbox"
          checked={p.exercises.includes(l.id)}
          onChange={() =>
            update((p) => ({ ...p, exercises: toggle(p.exercises, l.id) }))
          }
        />{" "}
        I completed the exercise and recorded the validation evidence.
      </label>
    </div>
  );
}
function Quiz({ lesson: l }: { lesson: Lesson }) {
  const { p, update } = useProgress();
  const [result, setResult] = useState<
    { choice: number; correct: boolean } | undefined
  >(p.quizzes[l.id]);
  const [choice, setChoice] = useState<number | undefined>(result?.choice);
  return (
    <div className="prose">
      <div className="eyebrow">CHECK UNDERSTANDING, NOT MEMORY</div>
      <h2>{l.question}</h2>
      <fieldset className="quiz">
        <legend className="sr-only">Choose an answer</legend>
        {l.options.map((o, i) => (
          <label key={i} className={choice === i ? "selected" : ""}>
            <input
              type="radio"
              name={l.id}
              checked={choice === i}
              onChange={() => {
                setChoice(i);
                setResult(undefined);
              }}
            />
            {o}
          </label>
        ))}
      </fieldset>
      <button
        className="primary"
        disabled={choice === undefined}
        onClick={() => {
          if (choice !== undefined) {
            const q = { choice, correct: choice === l.answer };
            setResult(q);
            update((p) => ({ ...p, quizzes: { ...p.quizzes, [l.id]: q } }));
          }
        }}
      >
        Check answer <ArrowRight size={16} />
      </button>
      {result && (
        <div
          className={`feedback ${result.correct ? "success" : "error"}`}
          role="status"
        >
          <strong>
            {result.correct
              ? "Correct — now explain why."
              : "Revisit the worked example."}
          </strong>
          <p>{l.feedback}</p>
        </div>
      )}
      <p>
        One question is a checkpoint, not proof of mastery. Complete and
        validate the exercise before marking the lesson done.
      </p>
    </div>
  );
}
function Watch() {
  const { id } = useParams(),
    l = lessonById(id || "");
  return l ? <LessonView key={l.id} lesson={l} /> : <NotFound />;
}
function LessonView({ lesson: l }: { lesson: Lesson }) {
  const { p, update } = useProgress();
  const [tab, setTab] = useState("Overview"),
    [videoOpen, setVideoOpen] = useState(false),
    [noteStatus, setNoteStatus] = useState(""),
    [playlist, setPlaylist] = useState(
      () => window.matchMedia("(min-width: 1001px)").matches,
    );
  const v = videos[l.video],
    idx = lessons.findIndex((x) => x.id === l.id);
  useEffect(() => {
    update((p) => ({
      ...p,
      lastLesson: l.id,
      opened: { ...p.opened, [l.id]: new Date().toISOString() },
    }));
  }, [l.id]);
  const completed = p.completed.includes(l.id);
  return (
    <>
      <div className="breadcrumbs">
        <Link to="/roadmap">Curriculum</Link>
        <ChevronRight size={13} />
        <Link to={`/roadmap#stage-${l.stage}`}>{stages[l.stage].short}</Link>
        <ChevronRight size={13} />
        <span>Lesson {idx + 1}</span>
      </div>
      <div className="watch-grid">
        <div className="watch-main">
          <div className="video-player">
            {v.id ? (
              videoOpen ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${v.id}?rel=0`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <button
                  className="video-cover"
                  aria-label={`Load YouTube player: ${v.title}`}
                  onClick={() => setVideoOpen(true)}
                >
                  <img
                    src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                    alt=""
                  />
                  <span className="video-scrim" />
                  <span className="big-play">
                    <Play size={30} fill="currentColor" />
                  </span>
                  <span className="video-cover-caption">
                    <small>{v.creator}</small>
                    <strong>{v.title}</strong>
                    <span>Load YouTube player</span>
                  </span>
                </button>
              )
            ) : (
              <div className="video-resource">
                <BookOpen size={35} />
                <h2>{v.title}</h2>
                <p>This unit uses an official provider resource.</p>
                <a
                  className="primary"
                  href={v.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open primary resource <ExternalLink size={16} />
                </a>
              </div>
            )}
          </div>
          <div className="video-info">
            <span>
              {v.creator} ·{" "}
              {v.id ? "Original video" : "Official provider resource"}
            </span>
            <a href={v.url} target="_blank" rel="noreferrer">
              {v.id ? "Watch on YouTube" : "Open provider"}{" "}
              <ExternalLink size={13} />
            </a>
          </div>
          <div className="watch-heading">
            <div>
              <div className="eyebrow">
                STAGE {l.stage} · LESSON {idx + 1}
              </div>
              <h1>{l.title}</h1>
              <div className="metadata">
                <span>
                  <Clock size={14} />
                  {l.minutes} min study estimate
                </span>
                <Tag>{l.difficulty}</Tag>
              </div>
            </div>
            <button
              aria-label={
                p.bookmarks.includes(l.id)
                  ? "Remove bookmark"
                  : "Bookmark lesson"
              }
              aria-pressed={p.bookmarks.includes(l.id)}
              onClick={() =>
                update((p) => ({ ...p, bookmarks: toggle(p.bookmarks, l.id) }))
              }
            >
              <Bookmark
                size={19}
                fill={p.bookmarks.includes(l.id) ? "currentColor" : "none"}
              />
            </button>
          </div>
          <div className="tabs" role="tablist" aria-label="Lesson sections">
            {[
              "Overview",
              "Notes",
              "Resources",
              "Exercises",
              "Knowledge Check",
            ].map((t) => (
              <button
                key={t}
                id={`tab-${t.replaceAll(" ", "-")}`}
                role="tab"
                onKeyDown={(e) => {
                  const tabs = [
                    "Overview",
                    "Notes",
                    "Resources",
                    "Exercises",
                    "Knowledge Check",
                  ];
                  if (
                    !["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)
                  )
                    return;
                  e.preventDefault();
                  const position =
                    e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? tabs.length - 1
                        : (tabs.indexOf(t) +
                            (e.key === "ArrowRight" ? 1 : -1) +
                            tabs.length) %
                          tabs.length;
                  setTab(tabs[position]);
                  document
                    .getElementById(
                      `tab-${tabs[position].replaceAll(" ", "-")}`,
                    )
                    ?.focus();
                }}
                aria-selected={tab === t}
                aria-controls="lesson-panel"
                className={t === tab ? "active" : ""}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div
            className="lesson-content"
            role="tabpanel"
            id="lesson-panel"
            aria-labelledby={`tab-${tab.replaceAll(" ", "-")}`}
          >
            {tab === "Overview" && (
              <div className="prose">
                <div className="callout">
                  <Target size={20} />
                  <div>
                    <strong>Why this matters</strong>
                    <p>{l.why}</p>
                  </div>
                </div>
                <h2>What you’ll understand</h2>
                <ul>
                  {l.objectives.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
                <h3>Before you begin</h3>
                {l.prerequisites.length ? (
                  <p>
                    Recommended:{" "}
                    {l.prerequisites.map((id) => (
                      <Link key={id} to={lessonURL(id)}>
                        {lessonById(id)?.title}
                      </Link>
                    ))}
                    . You can browse freely; revisit this if the explanation
                    feels unfamiliar.
                  </p>
                ) : (
                  <p>
                    Comfort with basic programming. No machine learning
                    experience is assumed.
                  </p>
                )}
                <h2>The intuition</h2>
                {l.explanation.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                <h3>Make it mathematical</h3>
                <MathBlock value={l.equation} />
                <p className="notation">
                  Notation: x is input, y is target, θ denotes parameters, L is
                  scalar loss, η is learning rate. B is batch size, T context
                  length, C channel width, V vocabulary size. Logarithms are
                  natural unless stated.
                </p>
                <h3>A worked example</h3>
                <div className="worked-example">{l.example}</div>
                <h3>Watch with a purpose</h3>
                <p>{v.focus}</p>
                <p>
                  After watching, close the video and reproduce the worked
                  example. The study estimate includes reading and exercises; it
                  is not a claimed video duration.
                </p>
                <h3>A common mistake</h3>
                <p className="mistake">{l.mistake}</p>
                {l.id === "01-05" && <Gradient />}
                <h3>You’re done when…</h3>
                <ul>
                  {l.completion.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <div className="callout">
                  <Code2 size={20} />
                  <div>
                    <strong>Connection to your GPT</strong>
                    <p>{l.connection}</p>
                  </div>
                </div>
                <button className="primary" onClick={() => setTab("Exercises")}>
                  Go to the exercise <ArrowRight size={16} />
                </button>
              </div>
            )}
            {tab === "Notes" && (
              <div className="prose">
                <h2>Your working notes</h2>
                <p>
                  Explain the concept in your own words. Record questions,
                  commands, and experiment results. Notes stay in this browser;
                  export a backup in Settings.
                </p>
                <label className="sr-only" htmlFor="notes">
                  Personal lesson notes
                </label>
                <textarea
                  id="notes"
                  className="notes-area"
                  value={p.notes[l.id] || ""}
                  placeholder="What did you predict? What actually happened?"
                  onChange={(e) => {
                    const note = e.target.value;
                    update((p) => ({
                      ...p,
                      notes: { ...p.notes, [l.id]: note },
                    }));
                    setNoteStatus("Saved to this browser");
                  }}
                />
                <small role="status">
                  {noteStatus ||
                    "Notes save automatically while browser storage is available."}
                </small>
              </div>
            )}
            {tab === "Resources" && (
              <div className="prose">
                <h2>Go to the original sources</h2>
                <a
                  className="resource-row"
                  href={v.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Play size={20} />
                  <div>
                    <strong>{v.title}</strong>
                    <small>
                      {v.creator} · {v.verified}
                    </small>
                  </div>
                  <ExternalLink size={16} />
                </a>
                {l.resources.map((r) => (
                  <a
                    className="resource-row"
                    key={r.url}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <BookOpen size={19} />
                    <div>
                      <strong>{r.title}</strong>
                      <small>
                        {r.creator} · {r.category}
                      </small>
                    </div>
                    <ExternalLink size={16} />
                  </a>
                ))}
                <p>
                  Videos remain with their original creators. If playback is
                  unavailable, use the provider link above. Advanced units
                  deliberately pair the architecture lecture with current
                  official written documentation.
                </p>
              </div>
            )}
            {tab === "Exercises" && <Exercises lesson={l} />}
            {tab === "Knowledge Check" && <Quiz lesson={l} />}
          </div>
          <div className="lesson-finish">
            <div>
              <strong>
                {completed ? "Lesson complete" : "Make the learning explicit"}
              </strong>
              <p>
                {completed
                  ? "You can revisit the material or undo completion."
                  : "Mark complete after explaining the concept and validating your work."}
              </p>
            </div>
            <button
              className={completed ? "secondary" : "primary"}
              onClick={() =>
                update((p) => ({ ...p, completed: toggle(p.completed, l.id) }))
              }
            >
              <Check size={16} />
              {completed ? "Completed · undo" : "Mark complete"}
            </button>
          </div>
          <div className="lesson-pagination">
            {idx > 0 ? (
              <Link to={lessonURL(lessons[idx - 1])}>
                <ArrowLeft size={17} />
                <span>
                  <small>PREVIOUS LESSON</small>
                  {lessons[idx - 1].title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {idx < lessons.length - 1 ? (
              <Link to={lessonURL(lessons[idx + 1])}>
                <span>
                  <small>NEXT LESSON</small>
                  {lessons[idx + 1].title}
                </span>
                <ArrowRight size={17} />
              </Link>
            ) : (
              <Link to="/progress">
                Review your progress <ArrowRight size={17} />
              </Link>
            )}
          </div>
        </div>
        <aside className="playlist">
          <button
            className="playlist-title"
            aria-expanded={playlist}
            onClick={() => setPlaylist(!playlist)}
          >
            <div>
              <strong>Course curriculum</strong>
              <small>{stats(p).count}/60 complete</small>
            </div>
            <ChevronDown size={17} />
          </button>
          {playlist && (
            <>
              <div className="progress-bar">
                <i style={{ width: `${stats(p).percent}%` }} />
              </div>
              {stages.map((st) => (
                <details key={st.id} open={st.id === l.stage}>
                  <summary>
                    <span>{String(st.id).padStart(2, "0")}</span>
                    {st.short}
                  </summary>
                  {lessons
                    .filter((x) => x.stage === st.id)
                    .map((x) => (
                      <Link
                        className={x.id === l.id ? "active" : ""}
                        key={x.id}
                        to={lessonURL(x)}
                      >
                        {p.completed.includes(x.id) ? (
                          <CheckCircle2 size={15} />
                        ) : (
                          <Play size={13} />
                        )}
                        <span>
                          {x.title}
                          <small>{x.minutes} min</small>
                        </span>
                      </Link>
                    ))}
                </details>
              ))}
            </>
          )}
        </aside>
      </div>
    </>
  );
}
function Projects() {
  const { p, update } = useProgress();
  const loc = useLocation();
  useEffect(() => {
    if (loc.hash) document.getElementById(loc.hash.slice(1))?.scrollIntoView();
  }, [loc]);
  return (
    <>
      <div className="eyebrow">WORKING SOFTWARE IS THE DELIVERABLE</div>
      <h1>The things you’ll build.</h1>
      <p className="lede">
        Each stage ends in an artifact you can run, inspect, and explain. Lesson
        completion and project completion are tracked separately.
      </p>
      <section className="download-banner">
        <Code2 size={27} />
        <div>
          <h2>Your C++ lab bench</h2>
          <p>
            Seven checked CPU reference programs, an autodiff starter, CMake,
            and extension briefs. No framework required.
          </p>
        </div>
        <a className="primary" href="/labs/model-lab-cpp.zip" download>
          <Download size={17} /> Download labs
        </a>
      </section>
      {stages.map((st) => (
        <section className="project panel" key={st.id} id={`project-${st.id}`}>
          <div className="eyebrow">
            MILESTONE {st.id + 1} · STAGE {st.id}
          </div>
          <h2>{st.title}</h2>
          <p>{st.outcome}</p>
          <div className="two-col">
            <div>
              <h3>Required evidence</h3>
              <p>{st.assignment}</p>
              <ul>
                <li>Runnable code and exact build commands.</li>
                <li>Observed test results and a short explanation.</li>
                <li>Known failures, limitations, and next steps.</li>
              </ul>
            </div>
            <div>
              <h3>Before you mark it built</h3>
              <p>
                Finish the stage assignments, reproduce the result from a clean
                build, and explain how the components work. This is
                self-reported; the platform does not grade your filesystem.
              </p>
              <label className="completion-check">
                <input
                  type="checkbox"
                  checked={p.projects.includes(st.id)}
                  onChange={() =>
                    update((p) => ({
                      ...p,
                      projects: p.projects.includes(st.id)
                        ? p.projects.filter((i) => i !== st.id)
                        : [...p.projects, st.id],
                    }))
                  }
                />{" "}
                I built and validated this milestone.
              </label>
            </div>
          </div>
          <Link to={`/roadmap#stage-${st.id}`}>
            Open stage lessons <ArrowRight size={15} />
          </Link>
        </section>
      ))}
    </>
  );
}
function WeekOne() {
  return (
    <>
      <div className="eyebrow">A CONCRETE FIRST FIVE SESSIONS</div>
      <h1>Your first week in the lab.</h1>
      <p className="lede">
        A focused {hour(weekOne.reduce((s, w) => s + w.minutes, 0))} launch
        plan. At 4 hours per week, spread these sessions over more than one
        week. Take breaks and repeat anything you cannot yet explain.
      </p>
      <div className="callout">
        <BookOpen size={21} />
        <p>
          First complete the orientation and compiler setup. These sessions
          deliberately revisit earlier ideas: draw → calculate → implement →
          test.
        </p>
      </div>
      {weekOne.map((w, i) => (
        <section className="panel session" key={i}>
          <div className="eyebrow">
            SESSION {i + 1} · ≈ {w.minutes} MINUTES
          </div>
          <h2>{w.title}</h2>
          {[
            ["Watch", w.watch],
            ["Read", w.read],
            ["Implement", w.build],
            ["Check your understanding", w.check],
          ].map(([t, b]) => (
            <div className="session-step" key={t}>
              <strong>{t}</strong>
              <p>{b}</p>
            </div>
          ))}
          <div className="actions">
            {w.ids.map((id) => (
              <Link className="secondary" key={id} to={lessonURL(id)}>
                {lessonById(id)?.title}
                <ArrowUpRight size={14} />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
function ProgressPage() {
  const { p } = useProgress();
  const s = stats(p);
  return (
    <>
      <div className="eyebrow">YOUR LEARNING, WITH EVIDENCE</div>
      <h1>See how far you’ve come.</h1>
      <p className="lede">
        Progress is saved in this browser. Lesson completion is explicit,
        exercises and projects are self-reported, and quizzes record your latest
        submitted answer.
      </p>
      <div className="stat-grid">
        {[
          ["Lessons complete", `${s.count}/60`],
          ["Exercises validated", `${p.exercises.length}/60`],
          [
            "Checks correct",
            `${Object.values(p.quizzes).filter((q) => q.correct).length}/60`,
          ],
          ["Milestones built", `${p.projects.length}/12`],
        ].map(([t, n]) => (
          <div className="stat" key={t}>
            <span>{t}</span>
            <strong>{n}</strong>
          </div>
        ))}
      </div>
      <section className="panel">
        <h2>Your stage progress</h2>
        {stages.map((st) => (
          <div className="stage-progress" key={st.id}>
            <Link to={`/roadmap#stage-${st.id}`}>
              {String(st.id).padStart(2, "0")} · {st.title}
            </Link>
            <div className="progress-bar">
              <i
                style={{
                  width: `${(lessons.filter((l) => l.stage === st.id && p.completed.includes(l.id)).length / 5) * 100}%`,
                }}
              />
            </div>
            <span>
              {
                lessons.filter(
                  (l) => l.stage === st.id && p.completed.includes(l.id),
                ).length
              }
              /5
            </span>
          </div>
        ))}
      </section>
      <section className="panel">
        <h2>Recently opened</h2>
        {Object.entries(p.opened)
          .sort((a, b) => b[1].localeCompare(a[1]))
          .slice(0, 8)
          .map(([id, date]) => (
            <Link className="history-row" key={id} to={lessonURL(id)}>
              <span>{lessonById(id)?.title}</span>
              <small>{new Date(date).toLocaleDateString()}</small>
              <ArrowUpRight size={15} />
            </Link>
          ))}
        {!Object.keys(p.opened).length && (
          <p>Your history starts when you open your first lesson.</p>
        )}
      </section>
      <section className="panel">
        <h2>Your notes</h2>
        {Object.entries(p.notes)
          .filter(([, note]) => note.trim())
          .map(([id, note]) => (
            <Link className="note-preview" key={id} to={lessonURL(id)}>
              <strong>{lessonById(id)?.title}</strong>
              <p>{note.slice(0, 200)}</p>
            </Link>
          ))}
        {!Object.values(p.notes).some((n) => n.trim()) && (
          <p>Write notes in any lesson’s Notes tab. They’ll appear here.</p>
        )}
      </section>
    </>
  );
}
function SettingsPage() {
  const { p, update } = useProgress();
  const [message, setMessage] = useState(""),
    [confirm, setConfirm] = useState(false);
  const s = stats(p),
    weeks = Math.ceil(s.remaining / 60 / p.pace);
  const finish = new Date();
  finish.setDate(finish.getDate() + weeks * 7);
  return (
    <>
      <div className="eyebrow">MAKE THE LAB YOURS</div>
      <h1>A sustainable learning rhythm.</h1>
      <section className="panel">
        <h2>Study pace</h2>
        <p>
          Lesson estimates include watching, reading, and an initial exercise
          attempt. Projects, debugging, and deeper experiments may take longer.
        </p>
        <div className="pace-options">
          {[4, 8, 12].map((h) => (
            <button
              key={h}
              className={p.pace === h ? "active" : ""}
              aria-pressed={p.pace === h}
              onClick={() => update((p) => ({ ...p, pace: h }))}
            >
              <strong>{h} hours</strong>
              <span>per week</span>
            </button>
          ))}
        </div>
        <p>
          ≈ <strong>{weeks} weeks</strong> for {hour(s.remaining)} of remaining
          authored lesson time. Estimated finish:{" "}
          <strong>
            {finish.toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </strong>
          . This is an estimate, not a deadline or guarantee.
        </p>
      </section>
      <section className="panel">
        <h2>Your data stays in your browser</h2>
        <p>
          No account, backend, or cloud synchronization. Export a backup before
          switching browsers or clearing site data. A backup includes your
          notes, bookmarks, completions, pace, history, and quiz results.
        </p>
        <div className="actions">
          <button className="primary" onClick={() => downloadJSON(p)}>
            <Download size={16} /> Export progress & notes
          </button>
          <label className="secondary file-button">
            Import JSON backup
            <input
              aria-label="Import JSON backup"
              type="file"
              accept="application/json,.json"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  if (file.size > 5e6)
                    throw new Error("Backup is too large (maximum 5 MB).");
                  const parsed = parseProgress(await file.text());
                  update(() => parsed);
                  setMessage(
                    "Backup imported successfully. Progress and notes were replaced with this backup.",
                  );
                } catch (err) {
                  setMessage(
                    `Import failed: ${err instanceof Error ? err.message : "Invalid file"}`,
                  );
                }
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <p>
          Import replaces current progress after validating the file. Export
          first if you want to preserve the current state.
        </p>
        <p role="status">{message}</p>
      </section>
      <section className="panel">
        <h2>Reset local progress</h2>
        <p>
          Export a backup first. This clears the active progress saved for Model
          Lab in this browser.
        </p>
        {confirm ? (
          <div className="actions">
            <button
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                location.reload();
              }}
            >
              Confirm reset
            </button>
            <button onClick={() => setConfirm(false)}>Cancel</button>
          </div>
        ) : (
          <button onClick={() => setConfirm(true)}>Reset progress…</button>
        )}
      </section>
      <section className="panel">
        <h2>About this release</h2>
        <p>
          Model Lab is an independent educational platform. The curriculum uses
          C++20 for first-principles implementation, Metal for GPU concepts, and
          MLX for practical Apple Silicon experiments. Memory capacity and
          achievable model size are measured, never assumed.
        </p>
        <p>
          Resource metadata was checked on 18 November 2026. Embedding
          availability may change. Use the provider fallback on every lesson.
          The first 25 lessons have fuller foundations; later units are bounded
          engineering assignments, not a complete substitute for official API
          documentation.
        </p>
        <a
          href="https://github.com/DaniDiazTech/DaniDiazTech.github.io"
          target="_blank"
          rel="noreferrer"
        >
          Source code & authoring guide <ExternalLink size={14} />
        </a>
      </section>
    </>
  );
}
function NotFound() {
  return (
    <div className="empty">
      <h1>That lesson isn’t in the lab.</h1>
      <p>Find your place in the course roadmap.</p>
      <Link className="primary" to="/roadmap">
        Open roadmap <ArrowRight size={16} />
      </Link>
    </div>
  );
}
const nav = [
  ["/", "Dashboard", LayoutDashboard],
  ["/roadmap", "Learning roadmap", Map],
  ["/library", "Lesson library", BookOpen],
  ["/playground", "Playground", FlaskConical],
  ["/projects", "Projects & labs", Code2],
  ["/week-one", "Your first week", GraduationCap],
  ["/bookmarks", "Bookmarks", Bookmark],
  ["/progress", "My progress", TrendingUp],
  ["/settings", "Settings & backups", Settings],
] as const;
function Shell() {
  const init = useState(loadProgress)[0];
  const [p, setP] = useState(init.data),
    [warning, setWarning] = useState(init.warning),
    [mobile, setMobile] = useState(false),
    [collapsed, setCollapsed] = useState(false),
    [query, setQuery] = useState("");
  const loc = useLocation(),
    navigate = useNavigate();
  const update = (fn: (p: Progress) => Progress) =>
    setP((prev) => {
      const next = fn(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        setWarning(
          "Browser storage is unavailable. Changes remain in this session; export a backup in Settings.",
        );
      }
      return next;
    });
  useEffect(() => {
    setMobile(false);
    window.scrollTo(0, 0);
    const main = document.getElementById("main");
    main?.focus({ preventScroll: true });
  }, [loc.pathname]);
  useEffect(() => {
    const title = loc.pathname.startsWith("/lesson/")
      ? lessonById(loc.pathname.split("/").at(-1)!)?.title
      : nav.find((n) => n[0] === loc.pathname)?.[1];
    document.title = `${title || "Learn"} — Model Lab`;
  }, [loc.pathname]);
  const s = stats(p);
  return (
    <Context.Provider value={{ p, update }}>
      <div className={`app ${collapsed ? "collapsed" : ""}`}>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {mobile && (
          <button
            className="mobile-backdrop"
            aria-label="Close navigation"
            onClick={() => setMobile(false)}
          />
        )}
        <aside className={`sidebar ${mobile ? "mobile-open" : ""}`}>
          <Link to="/" className="brand">
            <img src="/favicon.svg" alt="" />
            <span>
              model<span className="brand-light">lab</span>
              <small>BUILD YOUR OWN GPT</small>
            </span>
          </Link>
          <div className="workspace">
            <span className="workspace-avatar">D</span>
            <div>
              <strong>Daniel’s workspace</strong>
              <small>Personal learning path</small>
            </div>
            <ChevronDown size={14} />
          </div>
          <div className="nav-label">LEARN & BUILD</div>
          <nav>
            {nav.map(([url, label, Icon], i) => (
              <NavLink
                key={url}
                to={url}
                end={url === "/"}
                className={i === 6 ? "nav-divider" : ""}
              >
                <Icon size={18} />
                <span>{label}</span>
                {url === "/playground" && <small className="new-tag">5</small>}
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="sidebar-progress">
              <span>
                Your journey <strong>{s.percent}%</strong>
              </span>
              <div className="progress-bar">
                <i style={{ width: `${s.percent}%` }} />
              </div>
              <small>{s.count} of 60 lessons complete</small>
            </div>
            <div className="local-status">
              <span /> Saved on this device
            </div>
            <button
              className="collapse-button"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={
                collapsed ? "Expand navigation" : "Collapse navigation"
              }
            >
              <PanelLeftClose size={17} />
              <span>Collapse sidebar</span>
            </button>
          </div>
        </aside>
        <div className="main-shell">
          <header className="topbar">
            <button
              className="mobile-menu"
              aria-label="Open navigation"
              onClick={() => setMobile(!mobile)}
            >
              <Menu size={20} />
            </button>
            <span className="topbar-course">THE C++ → GPT LEARNING PATH</span>
            <form
              className="top-search"
              onSubmit={(e) => {
                e.preventDefault();
                navigate(`/library?q=${encodeURIComponent(query)}`);
              }}
            >
              <Search size={16} />
              <input
                aria-label="Search the course"
                placeholder="Search the course…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button aria-label="Submit search">
                <ArrowRight size={15} />
              </button>
            </form>
            <span className="top-pace">
              <Clock size={14} />
              {p.pace}h / week
            </span>
            <Link
              className="profile"
              to="/settings"
              aria-label="Workspace settings"
            >
              D
            </Link>
          </header>
          <main id="main" tabIndex={-1}>
            {warning && (
              <div className="storage-warning" role="alert">
                {warning}
                <button
                  onClick={() => setWarning("")}
                  aria-label="Dismiss warning"
                >
                  <X size={15} />
                </button>
              </div>
            )}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/library" element={<Library />} />
              <Route path="/lesson/:id" element={<Watch />} />
              <Route path="/playground" element={<Playgrounds />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/week-one" element={<WeekOne />} />
              <Route path="/bookmarks" element={<Library bookmarks />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <footer>
            <span>
              MODEL LAB <span>·</span> Understanding is the objective.
            </span>
            <Link to="/settings">Local progress. Yours to export.</Link>
          </footer>
        </div>
      </div>
    </Context.Provider>
  );
}
export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}
