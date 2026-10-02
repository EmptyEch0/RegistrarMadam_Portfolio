import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Keep vendor libraries in their own chunk
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router")) {
              return "vendor-react";
            }
            if (id.includes("lucide")) return "vendor-lucide";
            if (id.includes("@radix-ui") || id.includes("@tanstack")) return "vendor-ui";
            return "vendor";
          }
          // Keep large static data in its own chunk to avoid TDZ evaluation order issues
          if (id.includes("worksheetsData") || id.includes("worksheet-viewer")) {
            return "worksheets";
          }
          // Keep puzzle components together
          if (
            id.includes("word-puzzle") ||
            id.includes("puzzle-leaderboard") ||
            id.includes("puzzle-celebration")
          ) {
            return "puzzles";
          }
        },
      },
    },
  },
}));
