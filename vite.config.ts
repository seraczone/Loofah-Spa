import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

const REACT_DEDUPE = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
  "@tanstack/react-query",
  "@tanstack/query-core",
];

export default defineConfig(({ mode }) => {
  const loadedEnv = loadEnv(mode, process.cwd(), "VITE_");
  const envDefine = Object.fromEntries(
    Object.entries(loadedEnv).map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)]),
  );

  return {
    define: envDefine,
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
      }),
      viteReact(),
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
    ],
    resolve: {
      alias: {
        "@": `${process.cwd()}/src`,
      },
      dedupe: REACT_DEDUPE,
    },
    server: {
      host: "::",
      port: 8080,
      strictPort: true,
    },
    preview: {
      host: "::",
      port: 8080,
      strictPort: true,
    },
  };
});
