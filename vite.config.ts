import { defineConfig, loadEnv } from "vite";
import { ViteServer, ViteBuild, VitePlugin } from "./vite";
import { fileURLToPath, URL} from "node:url";

const baseSrc = fileURLToPath(new URL("./src", import.meta.url));
// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  const { VITE_BASE, VITE_BASE_URL, VITE_BASE_SERVER_URL } = env;
  return {
    resolve: {
      alias: [
        { find: "@", replacement: baseSrc },
        { find: "~@", replacement: baseSrc },
        { find: "~", replacement: baseSrc }
      ],
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"]
    },
    server: ViteServer(VITE_BASE_URL, VITE_BASE_SERVER_URL),
    build: ViteBuild(),
    plugins: VitePlugin(env, command === "build")
  };
});
