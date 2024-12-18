import { createApp } from "vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn";

import App from "./App.vue";
import router from "@/router";
import pinia from "@/store";
import I18n from "@/languages";
import "@/assets/styles/index.scss";

const app = createApp(App);
app.use(ElementPlus, {
  locale: zhCn
});
app.use(router);
app.use(pinia);
app.use(I18n);
app.mount("#app");
