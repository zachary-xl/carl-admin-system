import viteCompression from "vite-plugin-compression";

export default function createCompression(env) {
  const { VITE_BUILD_COMPRESSION } = env;
  const plugin = [];
  if (VITE_BUILD_COMPRESSION) {
    if (VITE_BUILD_COMPRESSION.toLocaleUpperCase() === "GZIP") {
      // 使用gzip解压缩静态文件
      plugin.push(
        viteCompression({
          ext: ".gz",
          filter: /\.(js|ts|cjs|mjs|json|css)$/gi, // 过滤需要 gzip 的文件
          deleteOriginFile: false // 删除源文件
        })
      );
    }
    if (VITE_BUILD_COMPRESSION.toLocaleUpperCase() === "BROTLI") {
      plugin.push(
        viteCompression({
          ext: ".br",
          algorithm: "brotliCompress",
          deleteOriginFile: false
        })
      );
    }
  }
  return plugin;
}
