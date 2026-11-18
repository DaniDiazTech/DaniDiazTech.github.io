import { useState } from "react";
import { ArrowRight, RotateCcw, Play, FlaskConical } from "lucide-react";
export const softmax = (values: number[]) => {
  const m = Math.max(...values),
    e = values.map((v) => Math.exp(v - m)),
    s = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / s);
};
export function Gradient() {
  const [rate, setRate] = useState(0.1),
    [initial, setInitial] = useState(-3),
    [kind, setKind] = useState("quadratic"),
    [path, setPath] = useState([-3]);
  const f = (x: number) =>
    kind === "quadratic"
      ? (x - 3) ** 2
      : Math.log1p(Math.exp(-Math.abs(x))) + Math.max(-x, 0) + 0.05 * x * x;
  const g = (x: number) =>
    kind === "quadratic" ? 2 * (x - 3) : -1 / (1 + Math.exp(x)) + 0.1 * x;
  const reset = (v = initial) => setPath([v]);
  const x = path.at(-1)!;
  const step = () =>
    setPath((p) => {
      const a = p.at(-1)!,
        next = a - rate * g(a);
      return [...p, Math.max(-10000, Math.min(10000, next))].slice(-100);
    });
  const points = Array.from({ length: 161 }, (_, i) => {
    const x = -5 + i / 10;
    return `${35 + (x + 5) * 35},${230 - Math.min(f(x), 100) * 2}`;
  }).join(" ");
  return (
    <div className="simulation">
      <div className="control-grid">
        <label>
          Loss function
          <select
            value={kind}
            onChange={(e) => {
              setKind(e.target.value);
              reset();
            }}
          >
            <option value="quadratic">Quadratic: (w − 3)²</option>
            <option value="logistic">Regularized logistic loss</option>
          </select>
        </label>
        <label>
          Learning rate · {rate.toFixed(2)}
          <input
            aria-label="Learning rate"
            type="range"
            min="0.01"
            max="1.2"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(+e.target.value)}
          />
        </label>
        <label>
          Initial parameter · {initial}
          <input
            aria-label="Initial parameter"
            type="range"
            min="-5"
            max="8"
            value={initial}
            onChange={(e) => {
              setInitial(+e.target.value);
              reset(+e.target.value);
            }}
          />
        </label>
      </div>
      <svg
        viewBox="0 0 630 270"
        role="img"
        aria-label="Loss curve and gradient descent trajectory"
      >
        <line x1="35" y1="230" x2="600" y2="230" stroke="var(--line)" />
        <line x1="35" y1="20" x2="35" y2="230" stroke="var(--line)" />
        <polyline
          points={points}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
        />
        {path
          .filter((v) => v >= -5 && v <= 11)
          .map((v, i) => (
            <circle
              key={i}
              cx={35 + (v + 5) * 35}
              cy={230 - Math.min(f(v), 100) * 2}
              r={i === path.length - 1 ? 6 : 3}
              fill={i === path.length - 1 ? "var(--accent)" : "#6d8fba"}
            />
          ))}
        <text x="270" y="260" fill="var(--muted)">
          Parameter w →
        </text>
        <text x="45" y="30" fill="var(--muted)">
          Loss (clipped at 100)
        </text>
      </svg>
      <div className="metrics">
        <span>
          w <strong data-testid="parameter">{x.toFixed(5)}</strong>
        </span>
        <span>
          Loss <strong>{f(x).toFixed(5)}</strong>
        </span>
        <span>
          Gradient <strong>{g(x).toFixed(5)}</strong>
        </span>
        <span>
          Steps <strong>{path.length - 1}</strong>
        </span>
      </div>
      <div className="actions">
        <button className="primary" onClick={step}>
          <Play size={15} /> Take a step
        </button>
        <button onClick={() => reset()}>
          <RotateCcw size={15} /> Reset
        </button>
      </div>
      <p>
        w ← w − η ∂L/∂w. For the quadratic, ∂L/∂w = 2(w−3). Try η=1: the steps
        oscillate. Above 1 they diverge. Values beyond the plot are reported in
        the metrics.
      </p>
    </div>
  );
}
export function Network() {
  const [x, setX] = useState(1),
    [w, setW] = useState(0.5),
    [target, setTarget] = useState(1),
    [steps, setSteps] = useState(0);
  const h1 = Math.tanh(x * w + 0.2),
    h2 = Math.tanh(-0.7 * x + 0.1),
    y = 1 / (1 + Math.exp(-(h1 + 0.5 * h2))),
    loss = (y - target) ** 2;
  const gradient = 2 * (y - target) * y * (1 - y) * (1 - h1 * h1) * x;
  return (
    <div className="simulation">
      <div className="control-grid">
        <label>
          Input x: {x}
          <input
            aria-label="Network input"
            type="range"
            min="-2"
            max="2"
            step=".1"
            value={x}
            onChange={(e) => setX(+e.target.value)}
          />
        </label>
        <label>
          Trainable weight w: {w.toFixed(3)}
          <input
            aria-label="Network weight"
            type="range"
            min="-3"
            max="3"
            step=".01"
            value={w}
            onChange={(e) => setW(+e.target.value)}
          />
        </label>
        <label>
          Target
          <select value={target} onChange={(e) => setTarget(+e.target.value)}>
            <option value={1}>1</option>
            <option value={0}>0</option>
          </select>
        </label>
      </div>
      <svg
        viewBox="0 0 600 230"
        role="img"
        aria-label="One input, two tanh hidden units, and a sigmoid output"
      >
        <g stroke="var(--line)" strokeWidth="2">
          <path d="M100 115L290 65M100 115L290 175M290 65L490 115M290 175L490 115" />
        </g>
        {[
          [100, 115, x],
          [290, 65, h1],
          [290, 175, h2],
          [490, 115, y],
        ].map(([a, b, v], i) => (
          <g key={i}>
            <circle
              cx={a}
              cy={b}
              r="33"
              fill="var(--panel)"
              stroke="var(--accent)"
            />
            <text x={a} y={b + 5} textAnchor="middle" fill="var(--text)">
              {v.toFixed(3)}
            </text>
          </g>
        ))}
        <g fill="var(--muted)" fontSize="13">
          <text x="165" y="60">
            w={w.toFixed(2)}, b=0.2
          </text>
          <text x="150" y="200">
            w=−0.7, b=0.1
          </text>
          <text x="370" y="65">
            w=1
          </text>
          <text x="370" y="190">
            w=0.5
          </text>
          <text x="265" y="20">
            tanh hidden units
          </text>
          <text x="455" y="175">
            sigmoid
          </text>
        </g>
      </svg>
      <div className="metrics">
        <span>
          Output <strong>{y.toFixed(5)}</strong>
        </span>
        <span>
          Squared loss <strong>{loss.toFixed(5)}</strong>
        </span>
        <span>
          ∂L/∂w <strong>{gradient.toFixed(5)}</strong>
        </span>
      </div>
      <button
        className="primary"
        onClick={() => {
          setW((v) => v - 0.5 * gradient);
          setSteps((s) => s + 1);
        }}
      >
        Train this weight · step {steps + 1}
      </button>
      <p>
        This deliberately small network trains only the upper input weight.
        h₁=tanh(wx+0.2), h₂=tanh(−0.7x+0.1), output=σ(h₁+0.5h₂). The update uses
        the exact chain-rule gradient and η=0.5. A full training loop updates
        all parameters over many examples.
      </p>
    </div>
  );
}
export function Shapes() {
  const [m, setM] = useState(2),
    [k, setK] = useState(3),
    [b, setB] = useState(3),
    [n, setN] = useState(4);
  const valid = k === b;
  return (
    <div className="simulation">
      <div className="control-grid">
        {[
          ["A rows", m, setM],
          ["A columns", k, setK],
          ["B rows", b, setB],
          ["B columns", n, setN],
        ].map(([label, value, set]) => (
          <label key={label as string}>
            {label as string}
            <input
              aria-label={label as string}
              type="number"
              min="1"
              max="8"
              value={value as number}
              onChange={(e) =>
                (set as (n: number) => void)(
                  Math.max(1, Math.min(8, Math.trunc(+e.target.value) || 1)),
                )
              }
            />
          </label>
        ))}
      </div>
      <div className="matrix-demo">
        {[[m, k, "A"], [b, n, "B"], ...(valid ? [[m, n, "A × B"]] : [])].map(
          ([r, c, name], i) => (
            <div key={i}>
              <strong>
                {name} · {r} × {c}
              </strong>
              <div
                className="matrix"
                style={{ gridTemplateColumns: `repeat(${c}, 1fr)` }}
              >
                {Array.from({ length: Number(r) * Number(c) }, (_, j) => (
                  <span key={j}>{j + 1}</span>
                ))}
              </div>
            </div>
          ),
        )}
      </div>
      <p className={valid ? "success" : "error"} role="status">
        {valid
          ? `Valid: (${m}×${k}) · (${b}×${n}) → ${m}×${n}. Each output uses ${k} multiply-add terms.`
          : `Shape mismatch: A has ${k} columns but B has ${b} rows. The inner dimensions must agree.`}
      </p>
      <p>
        The cells illustrate layout and element count; output cells are indices,
        not computed products. For a real product, Cᵢⱼ = Σₖ Aᵢₖ Bₖⱼ.
      </p>
    </div>
  );
}
export function Attention() {
  const [text, setText] = useState("the small model learns"),
    [causal, setCausal] = useState(true),
    [selected, setSelected] = useState(2);
  const tokens = text.trim().split(/\s+/).filter(Boolean).slice(0, 8);
  const row = Math.min(selected, Math.max(0, tokens.length - 1));
  // Explicit two-dimensional toy Q=K features: normalized length and normalized position.
  const features = tokens.map((t, i) => [t.length / 10, (i + 1) / 8]);
  const logits = features.map((q, i) =>
    features.map((k, j) =>
      causal && j > i ? -Infinity : (q[0] * k[0] + q[1] * k[1]) / Math.sqrt(2),
    ),
  );
  const weights = logits.map(softmax);
  const value =
    weights[row]?.reduce((s, w, j) => s + w * features[j][0], 0) || 0;
  return (
    <div className="simulation">
      <label>
        Short sequence (up to 8 space-separated words)
        <input
          aria-label="Attention sequence"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </label>
      <label className="check">
        <input
          type="checkbox"
          checked={causal}
          onChange={(e) => setCausal(e.target.checked)}
        />{" "}
        Causal mask
      </label>
      <div
        className="heatmap"
        style={{ gridTemplateColumns: `100px repeat(${tokens.length},1fr)` }}
      >
        <span>query ↓ key →</span>
        {tokens.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
        {tokens.map((t, i) => (
          <div className="contents" key={i}>
            <button onClick={() => setSelected(i)} aria-pressed={row === i}>
              {t}
            </button>
            {weights[i].map((w, j) => (
              <button
                key={j}
                onClick={() => setSelected(i)}
                title={`Raw score: ${Number.isFinite(logits[i][j]) ? logits[i][j].toFixed(3) : "masked"}`}
                style={{
                  background: `rgba(180,225,111,${w * 0.9})`,
                  color: w > 0.35 ? "#10150b" : "var(--text)",
                }}
              >
                {w === 0 ? "—" : w.toFixed(2)}
              </button>
            ))}
          </div>
        ))}
      </div>
      <p>
        Selected query: <strong>{tokens[row] || "none"}</strong>. Weighted
        scalar value: <strong>{value.toFixed(4)}</strong>. Row sum:{" "}
        <strong>
          {weights[row]?.reduce((a, b) => a + b, 0).toFixed(3) || "0"}
        </strong>
        .
      </p>
      <p>
        Exact toy features: Qᵢ=Kᵢ=[word length/10, (position+1)/8], Vᵢ=word
        length/10. Scores are QKᵀ/√2, followed by masked row softmax. These
        hand-chosen features demonstrate the arithmetic; they are not learned
        language attention or word importance.
      </p>
    </div>
  );
}
export function Tokenizer() {
  const [text, setText] = useState("Hello, model! 👋"),
    [mode, setMode] = useState("characters");
  const tokens =
    mode === "characters"
      ? Array.from(text)
      : Array.from(new TextEncoder().encode(text)).map(String);
  const vocab = [...new Set(tokens)].sort();
  return (
    <div className="simulation">
      <div className="control-grid">
        <label>
          Text
          <textarea
            aria-label="Tokenizer text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        <label>
          Representation
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="characters">Unicode code points</option>
            <option value="bytes">UTF-8 bytes</option>
          </select>
        </label>
      </div>
      <div className="tokens">
        {tokens.map((t, i) => (
          <span key={i}>
            {t === " " ? "␠" : t === "\n" ? "↵" : t}
            <small>{mode === "bytes" ? t : vocab.indexOf(t)}</small>
          </span>
        ))}
      </div>
      <p>
        {tokens.length} {mode === "bytes" ? "bytes" : "code points"} ·{" "}
        {vocab.length} distinct values.{" "}
        {mode === "characters"
          ? "IDs use a sorted vocabulary built from this input only; changing text can change IDs."
          : "Byte IDs are the byte values 0–255."}
      </p>
      <p>
        This is an educational code-point/byte splitter, not BPE. It has no
        learned merges, special chat tokens, or fixed production vocabulary. A
        visible emoji may span several bytes or code points.
      </p>
    </div>
  );
}
const demos = [
  ["Gradient descent", "Watch an update move a parameter downhill.", Gradient],
  ["Neural network", "Trace activations and train a real weight.", Network],
  ["Tensor shapes", "Build a valid matrix multiplication.", Shapes],
  ["Causal attention", "Inspect masked scores and weighted values.", Attention],
  ["Tokenization", "Compare code points with UTF-8 bytes.", Tokenizer],
] as const;
export function Playgrounds() {
  const [active, setActive] = useState(0);
  const Demo = demos[active][2];
  return (
    <>
      <div className="eyebrow">
        <FlaskConical size={15} /> LEARN BY CHANGING THINGS
      </div>
      <h1>The playground</h1>
      <p className="lede">
        Make a prediction. Change one variable. Explain what happened.
      </p>
      <div className="demo-tabs">
        {demos.map(([title, description], i) => (
          <button
            key={title}
            className={active === i ? "active" : ""}
            onClick={() => setActive(i)}
          >
            <strong>{title}</strong>
            <span>{description}</span>
            <ArrowRight size={16} />
          </button>
        ))}
      </div>
      <Demo />
    </>
  );
}
