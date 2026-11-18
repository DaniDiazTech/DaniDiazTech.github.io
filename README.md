# Model Lab — Build Your Own GPT

A static learning workspace for a software engineer building a GPT-style model in C++20 on Apple Silicon.

**Live:** https://danidiaztech.github.io/

**Repository:** https://github.com/DaniDiazTech/DaniDiazTech.github.io

## What works

- 60 authored lessons in 12 ordered stages, with fuller explanations in the first 25. Each unit includes prerequisites, objectives, mathematical notation, a worked example, exercise, expected evidence, misconception, knowledge check, and explicit completion.
- A five-session first-week plan with concrete watch/read/build/check instructions.
- Video-first lesson pages with a collapsible syllabus, provider fallbacks, resources, notes, exercises, and previous/next navigation.
- Five working simulations: gradient descent, a trainable neural weight, matrix dimensions, causal attention, and code-point/UTF-8 tokenization.
- Dashboard, roadmap, searchable/filterable lesson library, bookmarks, project checklists, progress, history, notes, and study pace estimates.
- Versioned browser-local persistence, recovery from invalid data, and JSON backup export/import. No authentication or cloud synchronization.
- Seven runnable C++20 reference programs, autodiff and Metal starters, CMake, and a downloadable ZIP.
- Responsive dark UI, keyboard focus indicators, semantic form controls, skip navigation, reduced-motion support, and mathematical rendering with KaTeX.

The two learning objectives stay distinct: implementing a tiny GPT teaches the system; building a useful assistant calls for narrow tasks, deterministic validation, and potentially pretrained weights. This platform does not promise general chatbot capability from laptop-scale scratch training.

## Run locally

Node 22 (at least 22.12) and npm:

```sh
npm ci
npm run dev
```

Open the printed local URL. If a port is occupied, Vite chooses another; the E2E suite uses its own strict port 4187.

```sh
npm test
npm run build
npx playwright install chromium
npm run test:e2e
bash scripts/test-labs.sh
```

The C++ command uses Apple Clang on macOS and Clang on CI. CMake is optional; see [labs/README.md](labs/README.md). The autodiff starter intentionally fails until completed and is excluded from the reference suite.

## Structure

```text
src/content/       typed schema, authored curriculum, source metadata, Week 1
src/lib/           progress validation, storage, backup, calculations, unit tests
src/components/    five interactive playgrounds
src/App.tsx        application shell, route views, lesson rendering
src/styles.css     responsive design tokens and component styles
labs/              C++ references, starters, and extension instructions
public/labs/       generated downloadable bundle
scripts/           CPU test runner and curriculum authoring provenance
 tests/            Playwright critical-flow and all-lesson checks
.github/workflows/ build, test, and GitHub Pages deployment
```

`curriculum.json` is the canonical authored content. The Python authoring scripts preserve initial drafting provenance; do not rerun them over edited content. See [CONTRIBUTING.md](CONTRIBUTING.md) for the current editing workflow.

## Deployment

This username site uses Vite `base: '/'` and `HashRouter`, so deep links such as `/#/lesson/03-03` refresh without a server rewrite. GitHub Pages is configured for **GitHub Actions**. A push to `main` runs unit tests, strict TypeScript/build, desktop/mobile Chromium E2E tests, and CPU C++ checks before deploying `dist` with GitHub’s Pages actions. The job needs repository Pages and Actions permissions; no application secrets are required.

## Storage and privacy

`model-lab.progress.v1` contains notes, completed lessons/exercises/projects, bookmarks, opened timestamps, quiz choices, last lesson, and weekly pace. Imports validate the version and known IDs; correctness of quiz answers is recomputed. Import replaces current data. Reset is a separate confirmed action. Export before clearing browser data. The app works without a backend, but videos and external resources require internet access.

YouTube is loaded only after clicking the lesson player. Thumbnails come from YouTube; Google Fonts supplies typography, with system fallbacks. These providers receive ordinary browser requests. No analytics are included.

## Resource verification and limits

See [RESOURCE_VERIFICATION.md](RESOURCE_VERIFICATION.md). Video titles/IDs were checked against official educator pages and provider listings on 2026-11-18. No video duration or segment timestamp is invented. Long lectures are reused with a named conceptual focus, and authored time estimates describe study time rather than video runtime. Provider playback can depend on location, network, embedding policy, and availability; every lesson offers an external fallback.

Later lessons are concise engineering units with assignments and acceptance evidence. They are not fully written textbooks for every advanced API. The downloadable bundle provides seven tested CPU references and extension briefs, **not** a completed GPT, full Metal host, or fine-tuned assistant. Those are the student’s projects. GPU kernels, MLX training, model downloads, and external video playback are not certified by the CPU/browser suite. No model weights or copyrighted course videos are redistributed.

Dark mode is the supported theme. Mobile testing uses Chromium device emulation, not a physical iPhone/Safari. Browser progress is not a grade or proof of completed local work.
