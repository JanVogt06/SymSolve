/// <reference types="vitest/config" />
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Served from the root of the custom domain (https://symsolve.jan-vogt.dev/),
  // so the default base of "/" is correct — no project-path prefix needed.
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    // The math engine in src/core is pure TypeScript with no DOM dependency,
    // so the lightweight Node environment is sufficient and fastest.
    environment: "node",
    // Allow describe/it/expect without explicit imports in test files.
    globals: true,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
