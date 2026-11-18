import { API } from "./vendor/shared.js";

let phase = "loading",
  log = "",
  stdout = "";
const MAX_OUTPUT = 65536;
const send = (message) => self.postMessage(message);
async function readBuffer(name) {
  const response = await fetch(
    new URL(`./vendor/${name}.gz.bin`, import.meta.url),
  );
  if (!response.ok)
    throw new Error(
      `Compiler asset ${name}: HTTP ${response.status}. Reload and retry, or download the local lab.`,
    );
  if (!response.body || typeof DecompressionStream !== "function")
    throw new Error(
      "This browser needs WebAssembly, module workers, and DecompressionStream. Use a current browser or the local C++ download.",
    );
  let loaded = 0;
  const total = Number(response.headers.get("content-length"));
  const counted = response.body.pipeThrough(
    new TransformStream({
      transform(chunk, controller) {
        loaded += chunk.length;
        send({ type: "download", name, loaded, total });
        controller.enqueue(chunk);
      },
    }),
  );
  return new Response(
    counted.pipeThrough(new DecompressionStream("gzip")),
  ).arrayBuffer();
}
function write(s) {
  if (phase === "running") {
    if (stdout.length + s.length > MAX_OUTPUT)
      throw new Error(
        "Output limit reached (64 KiB). Remove repetitive logging and retry.",
      );
    stdout += s;
  } else log = (log + s).slice(-MAX_OUTPUT);
}
self.onmessage = async ({ data }) => {
  try {
    if (typeof data.source !== "string" || data.source.length > 50000)
      throw new Error("Source is too large (maximum 50,000 characters).");
    send({ type: "phase", phase: "loading" });
    const api = new API({
      readBuffer,
      compileStreaming: async (name) =>
        WebAssembly.compile(await readBuffer(name)),
      hostWrite: write,
      showTiming: false,
      clang: "clang22-noeh",
      lld: "lld22-noeh",
      sysroot: "sysroot22.tar",
      memfs: "memfs",
      clangResourceInclude: "/lib/clang/22/include",
      clangExtraArgs: [
        "-internal-isystem",
        "/include/wasm32-wasip1/noeh/c++/v1",
        "-internal-isystem",
        "/include/wasm32-wasip1",
        "-std=c++20",
        "-Wall",
        "-Wextra",
        "-ffp-contract=off",
      ],
      lldLibdir: "lib/wasm32-wasip1",
      lldFlags: ["--export-dynamic", "--max-memory=67108864"],
      lldLibs: ["-lc", "-lc++", "-lc++abi", "-lclang_rt.builtins"],
    });
    await api.ready;
    phase = "compiling";
    send({ type: "phase", phase });
    await api.compile({
      input: "exercise.cpp",
      contents: data.source,
      obj: "exercise.o",
    });
    phase = "linking";
    send({ type: "phase", phase });
    await api.link("exercise.o", "exercise.wasm");
    const program = await WebAssembly.compile(
      api.memfs.getFileContents("exercise.wasm"),
    );
    phase = "running";
    send({ type: "phase", phase });
    let exitCode = 0,
      trap = null;
    try {
      await api.run(program, "exercise.wasm");
    } catch (error) {
      if (typeof error.code === "number") exitCode = error.code;
      else trap = error.message || String(error);
    }
    send({
      type: "result",
      stdout,
      diagnostics: log.replace(/\x1b\[[0-9;]*m/g, ""),
      exitCode,
      trap,
    });
  } catch (error) {
    send({
      type: "error",
      message: error.message || String(error),
      diagnostics: log.replace(/\x1b\[[0-9;]*m/g, ""),
      stdout,
    });
  }
};
