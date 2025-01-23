import router from "@/router";
import Layout from "@/layout/index.vue";
import type { RouteRecordRaw, RouteRecordName } from "vue-router";
import { HOME_URL } from "@/config";

export function loadLocalRoutes() {
  // 加载所有的模板
  const modules = import.meta.glob(`../mapping/**/*.ts`, { eager: true });
  // 遍历所有的模板为路由对象
  const routes: RouteRecordRaw[] = [];
  for (const key in modules) {
    let module = modules[key] as any;
    if (modules.hasOwnProperty(key) && module) {
      const route = module!.default as RouteRecordRaw;
      routes.push(route);
    }
  }
  return routes;
}

// TOD 添加路由
export function addRoutesWithMenu(menuList, routeName: RouteRecordName = "Layout") {
  if (!menuList.length) return;
  for (const item of menuList) {
    if (!router.hasRoute(item.path) && !item.meta?.link) {
      router.addRoute(routeName, item);
    }
  }
}

// TOD 清空路由
export function removeRoutesWithMenu(menuList) {
  menuList.map((menu) => {
    router.removeRoute(menu.name);
    if (router.options.routes) {
      router.options.routes.slice(router.options.routes.indexOf(menu), 1);
    }
  });
}

// TOD 映射菜单与树形菜单做对比
export function mapPathToMenu(menus, local) {
  return menus.map(({ children, id, pid, title, icon, link, ...menu }) => {
    if (children?.length) {
      menu.children = mapPathToMenu(children, local);
    }
    let findRoute: RouteRecordRaw = local.find((route) => route.name === menu.name && route.path === menu.path);
    return {
      ...menu,
      meta: {
        title: title ?? "",
        icon: icon ?? "",
        link: link ?? ""
      },
      name: findRoute.name,
      path: findRoute.path,
      component: findRoute.component
    };
  });
}

// TOD 展开菜单转树结构
export function formatTree(list) {
  let result: RouteRecordRaw[] = [];
  let dataMap = {};
  for (const item of list) {
    let { id, pid } = item;
    dataMap[id] = {
      ...item,
      children: dataMap[id]?.children || []
    };
    let curItem = dataMap[id];
    if (pid === 0) {
      result.push(curItem);
    } else {
      if (!dataMap[pid]) {
        dataMap[pid] = {
          children: []
        };
      }
      dataMap[pid]["children"].push(curItem);
    }
  }
  return result;
}

export function filterAsyncRoutes(routes, roles) {
  routes.map((route) => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
    }
  });
}

export function hasPermission(role, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(role);
  } else {
    return true;
  }
}

/**
 * @description 使用递归过滤出需要渲染在左侧菜单动态数据的列表 (需剔除 isHide == 0 隐藏的菜单)
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 * */
export function getShowStaticAndDynamicMenuList(menuList: any) {
  let newMenuList: any = JSON.parse(JSON.stringify(menuList));
  return newMenuList.filter((item: any) => {
    return item.isHide == "1" || item.meta?.isHide == "1";
  });
}

export function generateFlattenRoutes(data: any[]) {
  // 首先把你需要动态路由的组件地址全部获取[vue2中可以直接用拼接的方式，但是vue3中必须用这种方式]
  let modules = import.meta.glob("@/views/**/*.vue");
  const routes: any = [];
  for (var i = 0; i < data.length; i++) {
    // console.log("component", data[i].component)
    const componentTemplate = data[i].component;
    const route: any = {
      path: `${data[i].path}`,
      name: `${data[i].name}`,
      // 这里modules[`/src/views/${componentTemplate}.vue`] 一定要用绝对定位
      component: data[i]?.component ? modules[`/src/views/${componentTemplate}.vue`] : Layout,
      meta: {
        parentId: data[i].parentId,
        title: data[i].menuName,
        enName: data[i]?.enName,
        icon: data[i]?.icon,
        isHide: data[i]?.isHide,
        isKeepAlive: data[i]?.isKeepAlive,
        isLink: data[i]?.isLink,
        isFull: data[i]?.isFull,
        isAffix: data[i]?.isAffix,
        activeMenu: data[i]?.activeMenu
      }
    };
    // console.log("component", route.component)
    if (data[i].menuType == "1") {
      route.redirect = `${data[i]?.redirect}` || "/";
    }
    routes.push(route);
  }
  return routes;
}

/**
 * 注意：使用console.log("路由数据", JSON.stringify(generateRoutes(res.data, 0))打印会发现子路由的component打印不出来，JSON不能打印出来函数。${data[i].component}
 */
// 递归函数用于生成路由配置，登录的时候也需要调用一次。
export function generateRoutes(data: any[], parentId: any) {
  // 首先把你需要动态路由的组件地址全部获取[vue2中可以直接用拼接的方式，但是vue3中必须用这种方式]
  let modules = import.meta.glob("@/views/**/*.vue");
  const routeList: any = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i] && !router.hasRoute(data[i].path)) {
      if (data[i].parentId === parentId) {
        // console.log("component", data[i].component);
        const componentTemplate = data[i].component;
        const route: any = {
          path: `${data[i].path}`,
          name: `${data[i].name}`,
          // 这里modules[`/src/views/${componentTemplate}.vue`] 一定要用绝对定位
          component: data[i]?.component ? modules[`/src/views/${componentTemplate}.vue`] : Layout,
          meta: {
            title: data[i]?.menuName,
            enName: data[i]?.enName,
            icon: data[i]?.icon,
            isHide: data[i]?.isHide,
            isKeepAlive: data[i]?.isKeepAlive,
            isLink: data[i]?.isLink,
            isFull: data[i]?.isFull,
            isAffix: data[i]?.isAffix,
            activeMenu: data[i]?.activeMenu
          }
        };
        // console.log("component", route.component);
        if (data[i].menuType == "1") {
          route.redirect = `${data[i]?.redirect}` || HOME_URL;
        }
        // 递归处理子节点
        const children = generateRoutes(data, data[i].menuId);
        if (children.length > 0) {
          route.children = children;
        }
        routeList.push(route);
      }
    }
  }
  return routeList;
}

/**
 * @description 使用递归找出所有面包屑存储到 pinia 中
 * @param {Array} menuList 菜单列表
 * @param {Array} parent 父级菜单
 * @param {Object} result 处理后的结果
 * @returns {Object}
 */
export const getAllBreadcrumbList = (menuList: any, parent = [], result: { [key: string]: any } = {}) => {
  for (const item of menuList) {
    result[item.path] = [...parent, item];
    if (item.children) getAllBreadcrumbList(item.children, result[item.path], result);
  }
  return result;
};
