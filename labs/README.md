# Model Lab — C++20 lab bench

No ML dependencies are required for the seven CPU reference programs. They are learning fixtures, not a finished tensor framework or trained GPT. Complete the assignments in the platform to extend them.

## macOS

Install Xcode command line tools with `xcode-select --install` if Clang is absent. CMake is optional (`brew install cmake`). From this directory:

```sh
clang++ -std=c++20 -O2 -Wall -Wextra gradient.cpp -o gradient
./gradient
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
ctest --test-dir build --output-on-failure
```

Without CMake, substitute any program name in the Clang command: `orientation`, `autodiff`, `xor`, `tensor`, `bigram`, `attention`. All include `check.hpp`, so keep that file next to the sources. Tests throw on failure and exit nonzero; they do not rely on assertions disabled by release builds.

## Expected evidence

| Program | Check |
| --- | --- |
| orientation | dot=11; empty/negative vectors and dimension rejection |
| gradient | first update 0.6, finite differences, convergence to 3 |
| autodiff | (-24,16,8) leaf gradients, shared-node derivative 12, repeat reset |
| xor | four correct signs, final mean squared loss below .01, fixed seed 42 |
| tensor | matmul [17,39], rejected mismatch, stable softmax at [1000,1001] |
| bigram | normalized smoothed rows, finite held-out NLL, seeded sample |
| attention | causal future-value invariance and position-zero identity |

Start with `starter_autodiff.cpp`: it deliberately exits nonzero until implemented. The reference tape uses append order as a topological order because parents always precede operations. An arbitrary graph requires an explicit topological sort. Rebuilding the tape each step avoids stale forward values after parameter updates.

## Extension projects

1. **Regression and classification:** extend gradient to weight+bias MSE; then stable binary logit loss. Verify gradients before training OR.
2. **Tensor engine:** generalize Matrix to owning N-D storage; add checked shape multiplication, strides, broadcasting, reductions, and matrix backward. Add transpose views only after ownership is clear. The included Matrix is intentionally 2D.
3. **Neural language model:** extend bigram counts into trained logits; add embeddings and a context MLP. Keep document-level splits.
4. **Mini GPT:** extend attention to B,T,C axes and multiple heads; add pre-norm residual blocks and a feed-forward layer. Implement backward for every component and gradient-check them. Overfit one tiny batch before full training.
5. **Metal:** vector_add.metal is a kernel starter, not a complete host application. Install Metal-cpp from https://developer.apple.com/metal/cpp/. Implement device/queue/pipeline creation, shared buffers, dispatch, command completion, and CPU comparison in a host source. Define private implementation macros once. Link Foundation, Metal, and QuartzCore; use the current Apple setup guide. Test n=257 and guard padded threads. This GPU starter is not part of the portable CPU CMake suite.
6. **MLX:** follow the current official C++ build examples at https://github.com/ml-explore/mlx. Pin your commit; compare outputs and gradients against the CPU fixtures before benchmarking evaluated work.
7. **Checkpoint:** version the format; save shapes, tokenizer, weights, optimizer moments, step, configuration, and RNG. Reject malformed files and compare an interrupted/resumed run.
8. **Assistant:** integrate a compatible licensed open-weight model through llama.cpp or MLX-LM. Preserve its actual chat template. Compare it with your scratch model on the same held-out rules task.
9. **Rules:** define field/operator/value semantics before synthetic examples. Validate syntax, types, domains, and semantic boundary cases separately; allow explicit rejection.

Each extension needs its own tests and results.md. The download is a starting point for these assignments, not a claim that the full capstone is already implemented for you.
