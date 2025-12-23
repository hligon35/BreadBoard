import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "../app"),
      "@ui": path.resolve(__dirname, "../ui"),
    },
  },
  server: {
    port: 5173,
  },
});
