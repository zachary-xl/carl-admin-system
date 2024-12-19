import type { App, DefineComponent } from "vue";

const modules = import.meta.glob("./**/*.vue", { eager: true }) as Record<string, { default: DefineComponent }>;

export default {
  install(app: App) {
    for (const path in modules) {
      if (modules.hasOwnProperty(path)) {
        const componentName = path.match(/\/(.*)\//);
        if (componentName && componentName[1]) {
          console.log(componentName[1], modules[path]!.default);
          app.component(componentName[1], modules[path]!.default); // 注册组件
        }
      }
    }
  }
};
