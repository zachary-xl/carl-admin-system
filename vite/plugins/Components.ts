import Components from "unplugin-vue-components/dist/vite";
import IconsResolver from "unplugin-icons/dist/resolver";
import { ElementPlusResolver, VueUseComponentsResolver, VueUseDirectiveResolver } from "unplugin-vue-components/dist/resolvers";

export default function createComponents() {
  return Components({
    dirs: ["src/components/", "src/view/"],
    include: [/\.vue$/, /\.vue\?vue/, /\.md$/, /\.tsx?/],
    resolvers: [
      // 自动注册element组件
      ElementPlusResolver(),
      VueUseComponentsResolver(),
      VueUseDirectiveResolver(),
      IconsResolver({
        prefix: "Icon"
      })
    ]
  });
}
