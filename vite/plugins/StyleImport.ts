import { createStyleImportPlugin, ElementPlusResolve } from "vite-plugin-style-import";

export default function StyleImport() {
  return createStyleImportPlugin({
    // 自动导入element组件
    resolves: [ElementPlusResolve()],
    libs: [
      {
        libraryName: "element-plus",
        esModule: true,
        // 引入组件样式
        resolveStyle: (name: string) => {
          return `element-plus/theme-chalk/${name}.css`;
        }
      }
    ]
  });
}
