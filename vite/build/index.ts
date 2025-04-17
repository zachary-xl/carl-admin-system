import path from "path";
import type { BuildOptions } from "vite";

export default function createViteBuild(): BuildOptions {
  return {
    // target: "es2015",
    outDir: "./dist", // 设置打包文件夹名称
    cssCodeSplit: true, // css 拆分
    assetsInlineLimit: 5000, // 小于该值 图片打包成 Base64
    chunkSizeWarningLimit: 2000, // 规定触发警告的 chunk 大小，消除打包大小超过500kb警告
    minify: "terser", // 指定混淆器  terser需要安装包
    terserOptions: {
      // 传递给 Terser 的选项
      compress: {
        drop_console: false,
        drop_debugger: false
      }
    },
    manifest: true, // 生成 manifest.json文件 输入源文件和 hash 后文件的映射
    sourcemap: false, // 生成 sourcemap 文件映射 定位错误查看源代码等
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "../../index.html"),
        ie: path.resolve(__dirname, "../../ie.html")
      },
      output: {
        // dir:"build",
        entryFileNames: "static/js/[name]-[hash]-[format].js",
        chunkFileNames: "static/js/[name]-[hash]-[format].js",
        assetFileNames(chunkInfo): string {
          const suffix = chunkInfo.name.split(".").pop().toLowerCase();
          if (["jpg", "png", "gif", "jpeg", "webp", "svg"].indexOf(suffix) > -1) {
            return "static/img/[name]-[hash].[ext]";
          }
          if (["eot", "ttf", "svg", "woff", "woff2"].indexOf(suffix) > -1) {
            return "static/font/[name]-[hash].[ext]";
          }
          return "static/[ext]/[name]-[hash].[ext]";
        }
      }
    }
  };
}
