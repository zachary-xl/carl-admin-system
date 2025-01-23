import { createApp } from "vue";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./permission";
// 引入animate
import "animate.css";
import "element-plus/dist/index.css";
import "./assets/styles/index.scss";
// SVG插件配置
import "virtual:svg-icons-register";
import { registerIconComponent } from "@/utils";
import directives from "@/directives";
import components from "@/components";

// 插件扩展
dayjs.extend(duration);
// app实例
const app = createApp(App);
registerIconComponent(app);

app.use(directives);
app.use(components);
app.use(store);
app.use(router);
console.log(app._context.components);

app.mount("#app");
