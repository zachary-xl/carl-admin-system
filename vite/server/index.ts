import type { ServerOptions } from "vite";

export default function createViteServer(baseUrl, serverUrl): ServerOptions {
  return {
    host: "0.0.0.0",
    port: 3000,
    hmr: true,
    open: true,
    proxy: {
      // [baseUrl]: {
      //   target: serverUrl,
      //   changeOrigin: true,
      //   rewrite: path => path.replace(baseUrl, "")
      // }
      // "/v1": {
      //   target: serverUrl,
      //   changeOrigin: true,
      //   rewrite: path => path.replace("/v1", "")
      // }
    }
  };
}
