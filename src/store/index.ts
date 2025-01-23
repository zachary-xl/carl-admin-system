import { createPinia } from "pinia";
import piniaPluginPersist from "pinia-plugin-persist";

const pinia = createPinia();
pinia.use(piniaPluginPersist);

export { default as useAuthStore } from "./modules/auth";
export { default as useTabsStore } from "./modules/tabs";
export { default as useGlobalStore } from "./modules/global";
export { default as useKeepAliveStore } from "./modules/keepAlive";
export default pinia;
