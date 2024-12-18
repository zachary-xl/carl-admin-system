import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { createHtmlPlugin } from "vite-plugin-html";
import { visualizer } from "rollup-plugin-visualizer";
import type { PluginOption } from "vite";

import Legacy from "./Legacy";
import Icons from "./Icons";
import AutoImport from "./AutoImports";
import Components from "./Components";
import Compression from "./Compression";
import StyleImport from "./StyleImport";
import CreateSvgIcons from "./CreateSvgIcons";

export default function createVitePlugins(viteEnv: Record<string, string>, isBuild = false): PluginOption[] {
  const plugins: PluginOption[] = [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes("xl-")
        }
      }
    }), // vue vite 对 vue 支持
    vueJsx(), // vueJsx vite 对 jsx 支持
    createHtmlPlugin({
      minify: true,
      pages: [
        {
          filename: "index.html",
          template: "/index.html",
          entry: "src/main.ts"
        },
        {
          filename: "ie.html",
          template: "/ie.html"
        }
      ]
    })
  ];
  plugins.push(Legacy());
  plugins.push(Icons());
  plugins.push(AutoImport());
  plugins.push(Components());
  plugins.push(StyleImport());
  plugins.push(CreateSvgIcons());
  isBuild && plugins.push(visualizer());
  isBuild && plugins.push(Compression(viteEnv));
  return plugins;
}
