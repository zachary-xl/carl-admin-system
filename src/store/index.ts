import { createPinia } from "pinia";
import piniaPluginPersist from "pinia-plugin-persist";

const pinia = createPinia();
pinia.use(piniaPluginPersist);

export * from "./modules/global";
// export { default as useSettingStore } from "./modules/settings";
// export { default as useTagsViewStore } from "./modules/tagsView";
export default pinia;
