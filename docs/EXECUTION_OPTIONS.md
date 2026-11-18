# C++ execution without an owned server

Research and implementation: 18 November 2026.

## Chosen: self-hosted browser WebAssembly compiler

[CppStudio’s wasm-clang-runtime](https://github.com/cppstudio-io/wasm-clang-runtime) supplies Clang 22/LLD and a WASI sysroot. This makes a real C++ compiler a static asset, so GitHub Pages can continue hosting the complete learning platform. The source is compiled in a worker and the generated WebAssembly is executed in the same isolated worker. The runner has an explicit Stop control, execution timeout, source/output limits, and a learner-program memory maximum.

No paid account, API key, remote code submission, cross-origin proxy, or server maintenance is necessary. The tradeoff is the initial approximately 28 MB compressed download, substantial compiler memory, a limited WASI/no-exceptions environment, and slower startup than a remote native compiler. CPU mini-labs fit this environment; Metal and full model projects still run on macOS.

This extends the earlier [binji/wasm-clang](https://github.com/binji/wasm-clang) design. The newer distribution has an updated toolchain and standard-library packaging. We verified C++20 compilation, vector/string/math operations, failure diagnostics, and worker termination rather than relying on its README claims alone.

## Other researched options

| Option                                                                                                | What it offers                                                                        | Why it is not the default                                                                                                                                                                                             |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Compiler Explorer API](https://github.com/compiler-explorer/compiler-explorer/blob/main/docs/API.md) | Documented compile and execution requests to its hosted compiler fleet                | Learner code leaves the device. A public community service is an availability/policy dependency; do not assume a production SLA or permanent anonymous access. A compiler-list request was reachable during research. |
| [Judge0](https://github.com/judge0/judge0)                                                            | Sandboxed remote code execution; open-source self-hosting or commercial hosted access | Self-hosting requires infrastructure. Hosted offerings require checking the current plan, quota, and terms, and private API keys must never be embedded in a static frontend.                                         |
| [GitHub Codespaces](https://docs.github.com/en/codespaces/overview)                                   | A real hosted development environment with terminal and compilers                     | Useful optional full-project workspace, but requires a GitHub account and is subject to plan allowances/billing. It is not an anonymous embedded exercise runner.                                                     |
| Local Clang/CMake                                                                                     | Complete native macOS C++ toolchain and Metal access                                  | Best for full projects; requires local setup. The bench exports a standalone source with its visible harness so the small experiments can transfer directly.                                                          |

A serverless JavaScript function alone does not provide a native C++ compiler or a safe arbitrary-process sandbox. Putting an unsandboxed execution endpoint behind a free-tier function is not an appropriate substitute for a real execution service.

## Pinned assets and rebuild

Upstream runtime commit: `df1180d80184733c6a01599f76b92b4001d20f87`; binary release: `v0.1.0`. `public/compiler/vendor/manifest.json` stores raw hashes, compressed hashes, and build details. Assets are vendored so the deployed runner does not depend on upstream release-download CORS.

Build the memory filesystem with the official [wasi-sdk 33 release](https://github.com/WebAssembly/wasi-sdk/releases/tag/wasi-sdk-33). Set `WASI_SDK` to its extracted directory. From a scratch directory containing the pinned memfs.c and stb_sprintf.h:

```sh
"$WASI_SDK/bin/clang" --target=wasm32-wasip1 -O2 -Wall -Wextra -Wno-unused-parameter -c memfs.c -o memfs.o
"$WASI_SDK/bin/clang" --target=wasm32-wasip1 -DSTB_SPRINTF_IMPLEMENTATION -x c -O2 -c stb_sprintf.h -o stb_sprintf.o
"$WASI_SDK/bin/wasm-ld" -L"$WASI_SDK/share/wasi-sysroot/lib/wasm32-wasip1" --no-entry --export-dynamic --allow-undefined --initial-memory=4194304 -o memfs memfs.o stb_sprintf.o -lc
```

Gzip the raw release assets and memfs deterministically (`gzip.compress(raw, compresslevel=9, mtime=0)`), using `.gz.bin` filenames. Recompute the manifest. Keep the Apache and LLVM exception licenses and original notices. The runner’s worker imports the adapted shared module without eval.

## Check authoring and persistence

`src/content/challenges.json` is the canonical set of 38 mini-labs. Each has a function starter, reference implementation, visible assertions with explanations, progressive hints, a transfer assignment, and lesson associations. Every lesson links to at least one related skill drill. Shared drills are explicitly smaller prerequisite exercises, not substitutes for the larger local assignment.

`fullSource()` attaches the same visible C++ harness to the edited function and exported download. `npm run test:challenges` compiles every starter and reference with native Clang: references must pass every fixture, and starters must need implementation. Browser tests compile and execute the real toolchain, including representative vector/string/math exercises, invalid source, an infinite loop, cancellation, and retries. No remote execution responses are mocked.

Progress schema v1 gains an additive `coding` map. Existing backups without this field still import. Draft source, the exact last-tested source, check counts, and timestamp export with the normal JSON backup. A changed draft does not retain its old pass badge. Mini-lab passes never auto-complete lessons or full exercises.
