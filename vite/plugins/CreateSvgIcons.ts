import path from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

export default function CreateSvgIcons() {
  return createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(process.cwd(), "src/assets/images/svg")],
    // 指定symbolId格式
    symbolId: "icon-[name]",
    svgoOptions: {
      // 移除svg默认颜色
      plugins: [
        {
          name: "removeAttrs",
          params: { attrs: ["class", "data-name", "fill", "stroke"] }
        }
      ]
    }
  });
}
