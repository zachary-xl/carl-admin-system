import type { App } from "vue";

const directives = {
  install: function (app: App<Element>) {
    // 加载所有的模板
    const modules = import.meta.glob(`./modules/*.ts`, { eager: true });
    // 遍历所有的模板为指令对象
    Object.keys(modules).forEach((path) => {
      const key = path.match(/(?<=\/)([^\/]+)(?=\.ts$)/);
      if (key?.[1]) {
        app.directive(key[1], modules[path] as any);
      }
    });
  }
};

export default directives;
