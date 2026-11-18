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
          react: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
  test: { environment: "jsdom", include: ["src/**/*.test.ts*"] },
});
