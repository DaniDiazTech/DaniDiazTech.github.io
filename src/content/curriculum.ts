import data from "./curriculum.json";
import { refs } from "./resources";
import type { Lesson, Stage } from "./types";
export const stages: Stage[] = data.stages;
export const lessons: Lesson[] = data.lessons.map((l) => ({
  ...l,
  difficulty: l.difficulty as Lesson["difficulty"],
  resources: l.resourceKeys.map((k) => refs[k]),
}));
export const lessonById = (id: string) => lessons.find((l) => l.id === id);
export const totalMinutes = lessons.reduce((s, l) => s + l.minutes, 0);
export const weekOne = [
  {
    title: "Vectors, matrices & mathematical intuition",
    ids: ["01-01", "01-02"],
    watch:
      "3Blue1Brown: Vectors, what even are they? and Linear transformations and matrices. Watch both short lessons; pause to draw each transformation.",
    read: "Read the worked examples in these two lessons. Write down our batch-row convention X(B,D)W(D,H).",
    build:
      "Implement vector addition, scaling, dot product, and a three-loop matmul in main.cpp. Use std::vector<double>.",
    check:
      "dot([1,2],[3,4])=11; [[1,2],[3,4]][[5],[6]]=[[17],[39]]. Reject incompatible shapes. Explain why 2×3 times 3×4 yields 2×4.",
    minutes: 105,
  },
  {
    title: "What a network is & what learning means",
    ids: ["00-01", "00-02", "02-01"],
    watch:
      "3Blue1Brown: But what is a Neural Network? Watch the full short introduction. Use the linked GPT lecture only as an optional architecture preview.",
    read: "Read the orientation lessons. List model, parameters, activations, loss, training, and inference in your own words.",
    build:
      "Compute y-hat=w*x and squared loss at w=0,1,2,3,4 for x=2,y=6. Build shifted inputs and targets for [2,5,1,4].",
    check:
      "Losses are 36,16,4,0,4. Targets are [5,1,4]. Explain which numbers change during training and which during inference.",
    minutes: 90,
  },
  {
    title: "Your first C++ gradient descent",
    ids: ["00-04", "01-05", "02-02"],
    watch:
      "3Blue1Brown: Gradient descent, how neural networks learn. Watch the full lesson and pause to predict update directions.",
    read: "Read floating-point stability and linear regression. Derive d(w-3)²/dw=2(w-3) before opening the reference.",
    build:
      "Compile gradient.cpp, then recreate it independently. Log 50 updates with η=0.1. Extend to y=2x+1 with a bias.",
    check:
      "First step from w=0 is 0.6 and loss falls from 9 to 5.76. Check gradients with centered differences and deliberately demonstrate η=1 oscillation.",
    minutes: 120,
  },
  {
    title: "Chain rule, graphs & backpropagation",
    ids: ["01-03", "03-02"],
    watch:
      "Karpathy: building micrograd. Follow the scalar derivative and hand-backpropagation portions; pause before the Value engine. This is a long reference lecture with no unverified time range.",
    read: "Read the chain-rule and computation-graph lessons. Draw every operation for L=(ab+c)².",
    build:
      "Write a forward function and manual backward pass at a=2,b=-3,c=10. Print all intermediate values and sensitivities.",
    check:
      "u=4,L=16; gradients are (-24,16,8). For x*x at x=3, explain why two edges contribute and the derivative is 6.",
    minutes: 120,
  },
  {
    title: "Begin a C++ automatic-differentiation engine",
    ids: ["03-03", "03-04"],
    watch:
      "Continue Karpathy’s micrograd lecture through graph traversal and backward propagation. Translate the dependency graph, not Python object syntax.",
    read: "Read reverse-mode autodiff and gradient checking. Sketch arena ownership and reverse topological order.",
    build:
      "Download starter_autodiff.cpp. Implement add, multiply, graph traversal, and backward. Use autodiff.cpp only after attempting the shared-node test.",
    check:
      "For u=x*x,L=u+u,x=3, get dL/dx=12. Centered differences agree within 1e-5. A second backward call follows your documented reset behavior.",
    minutes: 135,
  },
];
