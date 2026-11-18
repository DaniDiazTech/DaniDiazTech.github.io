# Authoring and development

## Add or revise a lesson

Edit `src/content/curriculum.json` directly. The `Lesson` interface in `src/content/types.ts` defines the application contract. The JSON stores resource keys, resolved to typed resources by `curriculum.ts`.

Use a stable ID such as `03-06`; never rename IDs casually because local backups reference them. Preserve the stage ID and ensure prerequisite IDs exist earlier in the ordered array. New lessons must have:

- A specific title, study-time estimate, difficulty, prerequisites, concepts, and project relevance.
- Objectives that the assignment actually checks.
- An intuition, consistent equation, fully calculated example, and an explanation of common errors.
- A bounded exercise with C++ guidance where relevant, macOS run instructions, expected observations, and validation criteria.
- A real primary video or explicitly labeled official provider resource, with verification evidence.
- A useful objective question, plausible distractors, correct index, feedback, and explicit completion criteria.

For deeper lessons, add explanation paragraphs and lesson-specific guidance. Do not label a link dump as a complete unit. `scripts/author.py` and `scripts/deepen.py` preserve the initial authored draft; rerunning them would overwrite subsequent editorial changes. They are not the publishing pipeline.

## Videos and sources

Edit `src/content/resources.ts`. Verify every ID against the creator’s official page or provider listing. Store exact source URL, creator, verification date/basis, and a focused viewing instruction. Omit an ID for a provider-hosted video; the UI opens its original page. Do not invent durations or timestamps. Our lesson `minutes` fields estimate study plus initial exercise time, not video runtime.

Advanced documentation can supplement a video; clearly say what it covers. Prefer original papers, official APIs, and educator repositories. Never copy a course transcript into lesson content. Derive your own examples and explanations.

## Exercises

Keep standalone C++20 fixtures in `labs`. Tests must fail nonzero in release mode. Use `check.hpp` instead of disabled release assertions. Add new reference targets to CMake and `scripts/test-labs.sh`. Keep incomplete starters out of the passing suite and label them clearly.

After changing bundle files, regenerate the download:

```sh
python3 scripts/package-labs.py
```

The course UI links to `/labs/model-lab-cpp.zip`. Do not include build products or third-party model weights.

## Checks

```sh
npm ci
npm test
npm run build
npx playwright install chromium
npm run test:e2e
bash scripts/test-labs.sh
```

The tests validate content integrity, persistence, backup validation, all lesson renders, simulations, search/filtering, mobile navigation, and deep-link refresh. If changing lesson count, update the current 60-lesson acceptance assertions and any count-specific UI. Keep completion self-reported unless a real validator exists; playing a video must never auto-complete a lesson.

Use `npx prettier --write src tests '*.ts' '*.json'` for frontend formatting. Do not send Python files to Prettier.

## Architecture choices

- React + strict TypeScript + Vite; CSS design tokens keep the visual system small without requiring Tailwind.
- Hash routes support GitHub Pages without rewrites.
- Browser-local schema version 1; migration must preserve existing notes and IDs.
- KaTeX renders authored equations with trust disabled by default; imported notes are rendered as plain text.
- Simulations state their simplifying assumptions. Causal attention must normalize each visible row, and tokenization must never claim to be BPE when it only splits code points/bytes.
- Keep an honest distinction between a tested reference program, a starter, an assignment, and a student’s finished capstone.
