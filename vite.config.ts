import { defineConfig, loadEnv } from 'vite'
import { ViteServer, ViteBuild, VitePlugin } from "./vite";

// https://vite.dev/config/
export default defineConfig(({ mode, command })=>{
  const env = loadEnv(mode, process.cwd());
    const { VITE_BASE, VITE_BASE_URL, VITE_BASE_SERVER_URL } = env;
    return {
      server: ViteServer(VITE_BASE_URL, VITE_BASE_SERVER_URL),
      build: ViteBuild(),
      plugins: VitePlugin(env, command === "build")
    }
})
