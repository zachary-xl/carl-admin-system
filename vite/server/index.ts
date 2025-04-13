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
      "/dev-api": {
        target: "http://farm_animal_insurance.chooseme.top",
        changeOrigin: true,
        rewrite: (path) => path.replace("/dev-api", "")
      }
    }
  };
}
