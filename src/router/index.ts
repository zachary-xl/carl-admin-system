import { createRouter, createWebHashHistory, createWebHistory, RouterHistory } from "vue-router";
import { configSource } from "@/config";
import { nprogress } from "@/utils";
import { errorRoutes } from "./errorRoutes";
import { layoutRoutes } from "./layoutRoutes";
import { staticRouter } from "./staticRoutes";
import type { RouteLocationNormalized } from "vue-router";

// 路由访问两种模式：带#号的哈希模式，正常路径的web模式。
const routerMode = {
  hash: () => createWebHashHistory(),
  history: () => createWebHistory()
};

// 创建路由器对象
const router = createRouter({
  // 路由模式hash或者默认不带#
  history: routerMode[configSource.routerMode](),
  routes: [...layoutRoutes, ...staticRouter, ...errorRoutes],
  strict: false,
  // 滚动行为
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, left: 0 };
    }
  }
});

/**
 * @description 路由跳转错误
 */
router.onError((error) => {
  // 结束全屏动画
  nprogress.done();
  console.warn("路由错误", error.message);
});

/**
 * @description 后置路由
 */
router.afterEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  // 结束全屏动画
  nprogress.done();
});

export default router;
