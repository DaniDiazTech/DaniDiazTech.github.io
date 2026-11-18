import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          math: ["katex"],
          "editor-core": ["@codemirror/view", "@codemirror/state"],
          "editor-language": ["@codemirror/lang-cpp"],
          course: [
            "./src/content/curriculum.json",
            "./src/content/challenges.json",
          ],
          react: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
  test: { environment: "jsdom", include: ["src/**/*.test.ts*"] },
});
