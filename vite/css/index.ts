import type { CSSOptions } from "vite";

export default function createViteCss(): CSSOptions {
  return {
    devSourcemap: true, // css sourcemap
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/variables.scss" as *;`,
        javascriptEnabled: true,
        api: "modern-compiler"
      }
    }
  };
}
