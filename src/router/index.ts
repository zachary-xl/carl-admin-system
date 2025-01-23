import { createRouter, createWebHashHistory } from "vue-router";
import staticRoutes from "@/router/staticRoutes";
import errorRoutes from "@/router/errorRoutes";
import type { Router } from "vue-router";

const router: Router = createRouter({
  routes: [...staticRoutes, ...errorRoutes],
  history: createWebHashHistory(),
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, left: 0 };
    }
  }
});
export default router;
