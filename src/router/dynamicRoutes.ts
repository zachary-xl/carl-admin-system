import { useAuthStore } from "@/store";
import router from ".";
import { LOGIN_URL } from "@/config";

export const initDynamicRoutes = async () => {
  const authStore = useAuthStore();

  try {
    // 1、获取菜单列表 && 按钮权限列表 && 递归菜单数据
    await authStore.routesListAction();
    await authStore.getLoginUserInfoAction();

    // 2、判断当前用户是否拥有菜单权限
    // Proxy对象转换为正常的JSON数据
    // const menuRouters = JSON.parse(JSON.stringify(authStore.menuList));
    if (authStore.menuList == null || authStore.menuList.length == 0) {
      authStore.setTokenAction("");
      router.replace(LOGIN_URL);
      return;
    }

    // 3、添加动态路由[扁平化一级路由数据]
    authStore.menuList.forEach((item: any) => {
      // if (item.component && typeof item.component == "string") {
      //   // 扁平化路由也需要构造component路由函数
      //   item.component = modules["/src/views/" + item.component + ".vue"];
      // }
      console.log("item", item);

      if (item.isFull == "0") {
        // 如果是全屏的话，直接为整个页面
        router.addRoute(item);
      } else {
        router.addRoute("Layout", item);
      }
    });
  } catch (error) {
    console.log(error);
    // 当菜单请求出错时，重定向到登陆页
    authStore.setTokenAction("");
    router.replace(LOGIN_URL);
    return Promise.reject(error);
  }
};
