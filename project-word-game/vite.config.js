import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/project-word-game/", // GitHub Pages 하위 폴더 경로
  plugins: [react()],
});
