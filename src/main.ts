import { createApp } from "vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn";

import App from "./App.vue";
import router from "@/router";
import pinia from "@/store";
import i18n from "@/languages";
import globalComponents from "@/components";
import { registerIconComponent } from "@/utils";
import "animate.css";
import "@/assets/styles/index.scss";

const app = createApp(App);
registerIconComponent(app);
app.use(ElementPlus, {
  locale: zhCn
});
app.use(globalComponents);
app.use(pinia);
app.use(i18n);
app.use(router);
app.mount("#app");
