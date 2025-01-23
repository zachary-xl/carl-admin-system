/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_APP_ENV: string;
  readonly VITE_BASE: string;
  readonly VITE_TIMER_OUT: number;
  readonly VITE_BASE_URL: string;
  readonly VITE_BASE_SERVER_URL: string;
  readonly VITE_STORAGE: string;
  readonly VITE_IS_EXPIRE: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_DESCRIPTION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
