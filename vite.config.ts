import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";
import { ViteServer, ViteBuild, ViteCss, VitePlugin } from "./vite";

const baseSrc = fileURLToPath(new URL("./src", import.meta.url));
// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  const { VITE_BASE, VITE_BASE_URL, VITE_BASE_SERVER_URL } = env;
  return {
    base: VITE_BASE, // 设置为根路径
    resolve: {
      alias: [
        {
          find: "@",
          replacement: baseSrc
        },
        {
          find: "~@",
          replacement: baseSrc
        },
        {
          find: "~",
          replacement: baseSrc
        }
      ],
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"]
    },
    server: ViteServer(VITE_BASE_URL, VITE_BASE_SERVER_URL),
    build: ViteBuild(),
    css: ViteCss(),
    plugins: VitePlugin(env, command === "build")
  };
});
