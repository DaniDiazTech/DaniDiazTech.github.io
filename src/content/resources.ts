import type { Video, Resource } from "./types";
export const videos: Record<string, Video> = {
  appleCompute: {
    title: "Metal Compute on MacBook Pro",
    creator: "Apple Developer",
    url: "https://developer.apple.com/videos/play/tech-talks/10580/",
    focus:
      "Study the compute execution model and unified-memory discussion. The examples use M1 hardware; query your current device rather than copying historical limits.",
    verified: "2026-11-18 · official Apple video and transcript",
  },
  appleScale: {
    title: "Scale compute workloads across Apple GPUs",
    creator: "Apple Developer",
    url: "https://developer.apple.com/videos/play/wwdc2022/10159/",
    focus:
      "Focus on work distribution, threadgroups, synchronization, and profiling. Hardware limits in this 2022 talk must be queried on your current Mac.",
    verified: "2026-11-18 · official Apple video and transcript",
  },
  appleTrain: {
    title: "Train your machine learning and AI models on Apple GPUs",
    creator: "Apple Developer",
    url: "https://developer.apple.com/videos/play/wwdc2024/10160/",
    focus:
      "Use the training-framework and unified-memory overview. Our implementation stays C++ first; follow current MLX C++ examples for actual integration.",
    verified: "2026-11-18 · official Apple video and transcript",
  },
  architecture: {
    id: "lVynu4bo1rY",
    title:
      "Stanford CS336 Language Modeling from Scratch | Spring 2026 | Lecture 3: Architectures",
    creator: "Stanford Online",
    url: "https://www.youtube.com/watch?v=lVynu4bo1rY",
    focus:
      "Advanced reference for architecture decisions. Compare the component named in this unit; the course uses Python, while our assignment implements the equations in C++.",
    verified: "2026-11-18 · Stanford Online video listing",
  },
  posttraining: {
    id: "2oH6PWPrYFo",
    title:
      "Stanford CS336 Language Modeling from Scratch | Spring 2026 | Lecture 15: Mid/Post-Training",
    creator: "Stanford Online",
    url: "https://www.youtube.com/watch?v=2oH6PWPrYFo",
    focus:
      "Advanced background on supervised and reinforcement post-training. This does not replace the unit’s narrow rules assignment, validator, or held-out evaluation.",
    verified: "2026-11-18 · Stanford Online video listing",
  },

  vectors: {
    id: "fNk_zzaMoSs",
    title: "Vectors, what even are they?",
    creator: "3Blue1Brown",
    url: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
    focus:
      "Watch the complete short lesson. Draw the vector additions before coding.",
    verified: "2026-11-18 · official lesson page",
  },
  matrices: {
    id: "kYB8IZa5AuE",
    title: "Linear transformations and matrices",
    creator: "3Blue1Brown",
    url: "https://www.youtube.com/watch?v=kYB8IZa5AuE",
    focus:
      "Watch the whole lesson; pause to predict where the basis vectors land.",
    verified: "2026-11-18 · official lesson page",
  },
  dot: {
    id: "LyGKycYT2v0",
    title: "Dot products and duality",
    creator: "3Blue1Brown",
    url: "https://www.youtube.com/watch?v=LyGKycYT2v0",
    focus: "Focus on the equivalence between a weighted sum and a projection.",
    verified: "2026-11-18 · official lesson page",
  },
  neurons: {
    id: "aircAruvnKk",
    title: "But what is a Neural Network?",
    creator: "3Blue1Brown",
    url: "https://www.youtube.com/watch?v=aircAruvnKk",
    focus:
      "Watch the whole lesson. Distinguish activations from parameters in your notes.",
    verified: "2026-11-18 · official lesson page",
  },
  descent: {
    id: "IHZwWFHWa-w",
    title: "Gradient descent, how neural networks learn",
    creator: "3Blue1Brown",
    url: "https://www.youtube.com/watch?v=IHZwWFHWa-w",
    focus:
      "Watch the whole lesson. Predict the sign of each proposed parameter change.",
    verified: "2026-11-18 · official lesson page",
  },
  micrograd: {
    id: "VMj-3S1tku0",
    title:
      "The spelled-out intro to neural networks and backpropagation: building micrograd",
    creator: "Andrej Karpathy",
    url: "https://www.youtube.com/watch?v=VMj-3S1tku0",
    focus:
      "Long reference lecture, reused across lessons. Watch only the concept named in this lesson, then translate it into C++. No timestamp claims are made.",
    verified: "2026-11-18 · Zero to Hero syllabus",
  },
  makemore: {
    id: "PaCmpygFfXo",
    title: "The spelled-out intro to language modeling: building makemore",
    creator: "Andrej Karpathy",
    url: "https://www.youtube.com/watch?v=PaCmpygFfXo",
    focus:
      "Use the bigram counts, negative log likelihood, and sampling sections for their corresponding lessons.",
    verified: "2026-11-18 · Zero to Hero syllabus",
  },
  mlp: {
    id: "TCH_1BHY58I",
    title: "Building makemore Part 2: MLP",
    creator: "Andrej Karpathy",
    url: "https://www.youtube.com/watch?v=TCH_1BHY58I",
    focus:
      "Use as a Python comparison after deriving and implementing the C++ operation.",
    verified: "2026-11-18 · Zero to Hero syllabus",
  },
  activations: {
    id: "P6sfmUTpUmc",
    title: "Building makemore Part 3: Activations & Gradients, BatchNorm",
    creator: "Andrej Karpathy",
    url: "https://www.youtube.com/watch?v=P6sfmUTpUmc",
    focus:
      "Focus on activation and gradient statistics; our decoder later uses LayerNorm or RMSNorm, not BatchNorm.",
    verified: "2026-11-18 · Zero to Hero syllabus",
  },
  ninja: {
    id: "q8SA3rM6ckI",
    title: "Building makemore Part 4: Becoming a Backprop Ninja",
    creator: "Andrej Karpathy",
    url: "https://www.youtube.com/watch?v=q8SA3rM6ckI",
    focus:
      "Follow the manual differentiation of the operation used in this lesson.",
    verified: "2026-11-18 · Zero to Hero syllabus",
  },
  gpt: {
    id: "kCc8FmEb1nY",
    title: "Let's build GPT: from scratch, in code, spelled out.",
    creator: "Andrej Karpathy",
    url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
    focus:
      "Long architecture reference. Follow the named component; port the equations rather than the framework calls.",
    verified: "2026-11-18 · Zero to Hero syllabus",
  },
  tokenizer: {
    id: "zduSFxRajkE",
    title: "Let's build the GPT Tokenizer",
    creator: "Andrej Karpathy",
    url: "https://www.youtube.com/watch?v=zduSFxRajkE",
    focus:
      "Study byte encoding and pair merges. Our interactive character/byte explorer is not production BPE.",
    verified: "2026-11-18 · Zero to Hero syllabus",
  },
  metal: {
    title: "Metal video library",
    creator: "Apple Developer",
    url: "https://developer.apple.com/videos/metal/",
    focus:
      "Choose a compute introduction from the official library; specific session availability varies. Read the linked Metal-cpp guide first.",
    verified: "Official provider library · individual session not asserted",
  },
  mlx: {
    title: "MLX examples and learning resources",
    creator: "ML Explore",
    url: "https://github.com/ml-explore/mlx",
    focus:
      "This advanced unit is documentation-first. Use the official repository examples; the earlier GPT lecture provides architectural background.",
    verified: "2026-11-18 · official repository · written primary resource",
  },
};
export const refs: Record<string, Resource> = {
  math: {
    title: "Essence of linear algebra",
    url: "https://www.3blue1brown.com/topics/linear-algebra",
    creator: "3Blue1Brown",
    category: "Lecture",
  },
  nn: {
    title: "Neural network visual explanations",
    url: "https://www.3blue1brown.com/topics/neural-networks",
    creator: "3Blue1Brown",
    category: "Lecture",
  },
  micrograd: {
    title: "micrograd reference implementation",
    url: "https://github.com/karpathy/micrograd",
    creator: "Andrej Karpathy",
    category: "Code",
  },
  zero: {
    title: "Neural Networks: Zero to Hero",
    url: "https://karpathy.ai/zero-to-hero.html",
    creator: "Andrej Karpathy",
    category: "Lecture",
  },
  course: {
    title: "Zero to Hero course repository",
    url: "https://github.com/karpathy/nn-zero-to-hero",
    creator: "Andrej Karpathy",
    category: "Code",
  },
  bpe: {
    title: "minbpe",
    url: "https://github.com/karpathy/minbpe",
    creator: "Andrej Karpathy",
    category: "Code",
  },
  llmc: {
    title: "llm.c — inspect the CPU reference before CUDA paths",
    url: "https://github.com/karpathy/llm.c",
    creator: "Andrej Karpathy",
    category: "Code",
  },
  attention: {
    title: "Attention Is All You Need",
    url: "https://arxiv.org/abs/1706.03762",
    creator: "Vaswani et al.",
    category: "Paper",
  },
  metal: {
    title: "Metal developer resources",
    url: "https://developer.apple.com/metal/",
    creator: "Apple",
    category: "Documentation",
  },
  metalcpp: {
    title: "Get started with Metal-cpp",
    url: "https://developer.apple.com/metal/cpp/",
    creator: "Apple",
    category: "Documentation",
  },
  mlx: {
    title: "MLX — arrays, autodiff, and C++ examples",
    url: "https://github.com/ml-explore/mlx",
    creator: "ML Explore",
    category: "Code",
  },
  mlxlm: {
    title: "MLX LM — generation and fine-tuning",
    url: "https://github.com/ml-explore/mlx-lm",
    creator: "ML Explore",
    category: "Code",
  },
  llama: {
    title: "llama.cpp — local C/C++ inference",
    url: "https://github.com/ggml-org/llama.cpp",
    creator: "ggml-org",
    category: "Code",
  },
  lora: {
    title: "LoRA: Low-Rank Adaptation of Large Language Models",
    url: "https://arxiv.org/abs/2106.09685",
    creator: "Hu et al.",
    category: "Paper",
  },
};
