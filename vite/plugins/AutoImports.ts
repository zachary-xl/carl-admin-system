import AutoImport from "unplugin-auto-import/dist/vite";

export default function createAutoImport() {
  return AutoImport({
    // 自动导入相关函数
    imports: ["vue", "vue-router", "pinia"]
  });
}
