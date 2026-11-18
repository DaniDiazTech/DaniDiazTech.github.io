# Model Lab in-browser C++ runtime

This static distribution compiles real C++20 with Clang 22.1.8 and links a WASI WebAssembly program, all in the browser. No compilation server or API key is used. Learner source is posted only to a same-origin dedicated Web Worker; it is never sent to a remote compiler. All runtime files are served by the same GitHub Pages site.

## Assets and provenance

Clang, LLD, and the wasi-sdk 33 sysroot are from `cppstudio-io/wasm-clang-runtime` release **v0.1.0**, source commit **df1180d80184733c6a01599f76b92b4001d20f87**:
https://github.com/cppstudio-io/wasm-clang-runtime

`vendor/manifest.json` records hashes and sizes of the original assets. Only gzip-compressed binaries are committed. Their `.gz.bin` suffix deliberately avoids web servers automatically adding Content-Encoding; the worker decompresses explicitly with DecompressionStream.

`vendor/shared.js` preserves the upstream Apache license and runtime. Our only source adaptation is an appended ES-module export; no dynamic JavaScript evaluation is needed. `worker.js` is the Model Lab worker integration, using C++20, visible checks, bounded output, and a 64 MiB maximum for the learner program’s linear memory.

`memfs` is built from the pinned upstream `src/memfs/memfs.c` and `stb_sprintf.h`, included alongside the binary here, using official wasi-sdk **33.0 arm64-macos**. The reproducible command is in `docs/EXECUTION_OPTIONS.md` in the source repository. Headers/libraries in the upstream sysroot define the available C++ subset.

## Licenses

- Runtime and memory filesystem: Apache 2.0. See `vendor/LICENSE` and `vendor/NOTICE`.
- LLVM and wasi-sdk components: Apache 2.0 with LLVM Exceptions. See `vendor/LICENSE.llvm`.
- stb_sprintf: public domain / MIT, as stated in its included source header.

## Constraints

- First compiler use downloads about **28 MB** compressed (roughly 95 MB of unpacked compiler/sysroot files). Browser memory consumption is considerably larger than the download; constrained devices may run out of memory. Loading is opt-in via Run checks.
- Requires current WebAssembly, module-worker, TransformStream, and DecompressionStream support. The compatibility compiler binaries avoid exception-reference instructions, but browser compatibility is still tested rather than universally promised.
- Single-file CPU exercises. C++20 language mode is enabled; this is not a promise that every standard-library facility is present.
- No Metal, MLX, CMake, networking, native filesystem, threads, or C++ exception handling. The WASI sysroot is a no-exceptions variant. Download exercises for native macOS validation and GPU work.
- Maximum edited source: 50,000 characters. Program output: 64 KiB. Learner WebAssembly memory: 64 MiB. These do not cap the compiler’s own memory usage.
- Run watchdog: 4 seconds once execution begins; compilation: 60 seconds; initial loading: 180 seconds. Stop terminates the worker. A new run creates a fresh worker and virtual filesystem. Browser caching may avoid repeated downloads; offline availability is not guaranteed.
- Visible checks are learning fixtures, not tamper-resistant grading or a proof of general correctness. Passing records are browser-local, self-controlled evidence. Editing the tested source invalidates its pass badge.
