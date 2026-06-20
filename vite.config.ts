import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" keeps asset paths relative so the built site works on
// GitHub Pages / any static subpath as well as the local dev server.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
