import path from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

export default function CreateSvgIcons() {
  return createSvgIconsPlugin({
    // 配置SVG图片
    iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
    symbolId: "icon-[dir]-[name]"
  });
}
