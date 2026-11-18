export type CompileResult = {
  stdout: string;
  diagnostics: string;
  exitCode: number;
  trap: string | null;
};
export type CompilerEvent =
  | { type: "phase"; phase: string }
  | { type: "download"; name: string; loaded: number; total: number };
export function runCpp(
  source: string,
  onProgress: (event: CompilerEvent) => void,
) {
  let worker: Worker | null = null,
    timer: ReturnType<typeof setTimeout>,
    settled = false;
  let rejectRun: (reason: Error) => void = () => {};
  const stop = (reason = "Execution stopped.") => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    worker?.terminate();
    rejectRun(new Error(reason));
  };
  const promise = new Promise<CompileResult>((resolve, reject) => {
    rejectRun = reject;
    try {
      worker = new Worker("/compiler/worker.js", { type: "module" });
    } catch (error) {
      settled = true;
      reject(error);
      return;
    }
    const arm = (ms: number, message: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => stop(message), ms);
    };
    arm(
      180000,
      "Compiler loading timed out. Retry on a faster connection or download the local lab.",
    );
    worker.onerror = (event) =>
      stop(
        `Compiler worker failed: ${event.message || "unsupported browser or insufficient memory"}. Try a current browser or the local lab.`,
      );
    worker.onmessage = ({ data }) => {
      if (settled) return;
      if (data.type === "phase") {
        onProgress(data);
        if (data.phase === "running")
          arm(
            4000,
            "Time limit reached (4 seconds). Check loop bounds and convergence conditions.",
          );
        else if (data.phase === "compiling")
          arm(60000, "Compilation timed out. Reduce the program and retry.");
      }
      if (data.type === "download") onProgress(data);
      if (data.type === "result" || data.type === "error") {
        settled = true;
        clearTimeout(timer);
        worker?.terminate();
        if (data.type === "error")
          reject(
            new Error(
              [data.message, data.diagnostics, data.stdout]
                .filter(Boolean)
                .join("\n"),
            ),
          );
        else resolve(data as CompileResult);
      }
    };
    worker.postMessage({ source });
  });
  return { promise, cancel: () => stop() };
}
