# Resource verification — 18 November 2026

The metadata in `src/content/resources.ts` records the verification basis. No timestamps or video durations are asserted.

| Resource                                                | Verification source                                                                   |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 3Blue1Brown vectors (`fNk_zzaMoSs`)                     | https://www.3blue1brown.com/lessons/vectors/                                          |
| Linear transformations (`kYB8IZa5AuE`)                  | https://www.3blue1brown.com/lessons/linear-transformations/                           |
| Dot products (`LyGKycYT2v0`)                            | https://www.3blue1brown.com/lessons/dot-products/                                     |
| Neural networks (`aircAruvnKk`)                         | https://www.3blue1brown.com/lessons/neural-networks/                                  |
| Gradient descent (`IHZwWFHWa-w`)                        | https://www.3blue1brown.com/lessons/gradient-descent/                                 |
| micrograd (`VMj-3S1tku0`)                               | https://karpathy.ai/zero-to-hero.html                                                 |
| makemore (`PaCmpygFfXo`)                                | same official syllabus                                                                |
| makemore MLP (`TCH_1BHY58I`)                            | same official syllabus                                                                |
| Activations (`P6sfmUTpUmc`)                             | same official syllabus                                                                |
| Backprop Ninja (`q8SA3rM6ckI`)                          | same official syllabus                                                                |
| GPT (`kCc8FmEb1nY`)                                     | same official syllabus and user-established URL                                       |
| Tokenizer (`zduSFxRajkE`)                               | same official syllabus                                                                |
| Stanford CS336 2026 Architectures (`lVynu4bo1rY`)       | Stanford Online’s verified YouTube listing                                            |
| Stanford CS336 2026 Mid/Post-Training (`2oH6PWPrYFo`)   | Stanford Online’s verified YouTube listing                                            |
| Metal Compute on MacBook Pro                            | https://developer.apple.com/videos/play/tech-talks/10580/ (official title/transcript) |
| Scale compute workloads across Apple GPUs               | https://developer.apple.com/videos/play/wwdc2022/10159/ (official title/transcript)   |
| Train your machine learning and AI models on Apple GPUs | https://developer.apple.com/videos/play/wwdc2024/10160/ (official title/transcript)   |

The MLX resource is explicitly a written primary resource, not a fabricated video. The broader Metal library is labeled as a library rather than a single session. Apple’s historical hardware examples are not M5 Pro specifications: students query current device properties and memory.

Original-source repositories (micrograd, minbpe, llm.c, MLX, MLX-LM, llama.cpp) and the Attention and LoRA papers were opened and checked. Stanford’s Spring 2026 architecture/post-training recordings are labeled by year; they are supplementary references, not a claim that Model Lab is the Stanford course.

External YouTube embeds may be blocked or unavailable; all have direct provider links. Automated tests validate metadata format, intended iframe IDs, and fallbacks, not that YouTube will stream copyrighted media successfully in every environment. We do not download course videos. Long recordings are intentionally reused; this release curates 17 specific videos plus documentation/library entries rather than claiming 40 unique recordings.

The inspiration site was read over HTTP (public HTML) to inspect navigation, search, and provider integration. Its code and visual design were not copied. The in-app browser host was unavailable, so product visual QA uses the requested Playwright workflow instead.
