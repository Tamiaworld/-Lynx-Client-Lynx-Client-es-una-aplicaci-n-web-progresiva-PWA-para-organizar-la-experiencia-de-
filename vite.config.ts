import { defineConfig } from "vite";
// @ts-expect-error type error without @types/node package
import process from "node:process";

const host = process.env.TAURI_DEV_HOST;

const base =
  process.env.GITHUB_ACTIONS === "true"
    ? "/-Lynx-Client-Lynx-Client-es-una-aplicaci-n-web-progresiva-PWA-para-organizar-la-experiencia-de-/"
    : "/";

export default defineConfig(() => ({
  base,
  clearScreen: false,

  server: {
    port: 1420,
    strictPort: true,
    host: host || false,

    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,

    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
