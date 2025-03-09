import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const resolve = (dir: string) => path.join(__dirname, dir);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
});
