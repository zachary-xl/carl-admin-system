import router from "@/router";
import { useAuthStore, useGlobalStore } from "@/store";
import { configSource, LOGIN_URL, ROUTER_WHITE_LIST } from "@/config";
import nprogress from "@/utils/nprogress";
import { MsgWarning } from "@/utils/notification";
import { initDynamicRoutes } from "./router/dynamicRoutes";
import { useRoute } from "vue-router";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthStore();
  const globalStore = useGlobalStore();
  // 1、NProgress 开始
  nprogress.start();

  // 2、标题切换，没有防止后置路由，是因为页面路径不存在，title会变成undefined
  if (globalStore.language === "en") {
    document.title = to.meta.enName || configSource.enSystemTitle;
  } else {
    document.title = to.meta.title || configSource.systemTitle;
  }

  // 3、判断是访问登陆页，有Token访问当前页面，token过期访问接口，axios封装则自动跳转登录页面，没有Token重置路由到登陆页。
  if (to.path.toLocaleLowerCase() === LOGIN_URL) {
    // 有Token访问当前页面
    if (authStore.token) {
      return next(from.fullPath);
    } else {
      MsgWarning("账号身份已过期，请重新登录🌻");
    }
    // 没有Token重置路由到登陆页。
    resetRouter();
    return next();
  }
  // 4、判断访问页面是否在路由白名单地址[静态路由]中，如果存在直接放行。
  if (ROUTER_WHITE_LIST.includes(to.path)) return next();

  // 5、判断是否有 Token，没有重定向到 login 页面。
  if (!authStore.token) return next({ path: LOGIN_URL, replace: true });

  // 6、如果没有菜单列表[一级扁平化路由 OR 递归菜单路由数据判断是否存在都阔以]，就重新请求菜单列表并添加动态路由。
  if (!authStore.getMenuList.length) {
    // 注意：authStore.getMenuList，不能持久化菜单数据，否则这里一直有值，就不会走这里，而且持久化之后还会被篡改数据。
    // 获取相关菜单数据 && 按钮数据 && 角色数据 && 用户信息。
    // console.log("刷新页面");
    await initDynamicRoutes();
    return next({ ...to, replace: true }); // ...to 保证路由添加完了再进入页面 (可以理解为重进一次) replace: true 重进一次, 不保留重复历史
  }
  // 7、正常访问页面。
  next();
});

/**
 * @description 重置路由
 */
export const resetRouter = () => {
  const authStore = useAuthStore();
  authStore.getMenuList.forEach((route: any) => {
    const { name } = route;
    if (name && router.hasRoute(name)) {
      router.removeRoute(name);
    }
  });
};

router.afterEach(() => {
  nprogress.done();
});

/**
 * @description 路由跳转错误
 */
router.onError((error) => {
  // 结束全屏动画
  nprogress.done();
  console.warn("路由错误", error.message);
});
