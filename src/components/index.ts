import type { App } from "vue";

const components = {
  install: function (app: App<Element>) {
    // 加载所有的模板
    const modules = import.meta.glob(`./modules/**/*.vue`, { eager: true });
    // 遍历所有的模板为组件对象
    Object.keys(modules).forEach((path) => {
      const key = path.match(/\/([^\/]+)\/index\.vue$/);
      if (key && key?.length > 1) {
        const component = (modules[path] as any).default;
        app.component(key[1]!, component);
      }
    });
  }
};

export default components;
