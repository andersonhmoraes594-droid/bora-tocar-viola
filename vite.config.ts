import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    prerender: {
      enabled: process.env.GITHUB_ACTIONS === "true",
      autoSubfolderIndex: true,
      crawlLinks: true,
      failOnError: true,
    },
  },
});
