import { HOME_URL } from "@/config";
import type { RouteRecordRaw } from "vue-router";

export default [
  {
    path: "/",
    redirect: HOME_URL,
    name: "Layout",
    component: () => import("@/layout/index.vue"),
    children: [
      {
        path: HOME_URL, // [唯一]
        component: () => import("@/views/main.vue"),
        meta: {
          title: "主控台", // 标题
          enName: "Master Station", // 英文名称
          icon: "HomeFilled", // 图标
          isHide: "0", // 代表路由在菜单中是否隐藏，是否隐藏[0隐藏，1显示]
          isLink: "", // 是否外链[有值则是外链]
          isKeepAlive: "0", // 是否缓存路由数据[0是，1否]
          isFull: "1", // 是否缓存全屏[0是，1否]
          isAffix: "0" // 是否缓存固定路由[0是，1否]
        }
      }
    ]
  },
  {
    path: HOME_URL, // [唯一]
    component: () => import("@/views/main.vue"),
    meta: {
      title: "主控台", // 标题
      enName: "Master Station", // 英文名称
      isHide: "1", // 代表路由在菜单中是否隐藏，是否隐藏[0隐藏，1显示]
      isLink: "", // 是否外链[有值则是外链]
      isKeepAlive: "0", // 是否缓存路由数据[0是，1否]
      isFull: "1", // 是否缓存全屏[0是，1否]
      isAffix: "0" // 是否缓存固定路由[0是，1否]
    }
  },
  {
    name: "Login",
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录"
    }
  },
  {
    name: "FarmersForm",
    path: "/farmers-form",
    component: () => import("@/views/farmersForm/index.vue"),
  },
  {
    name: "FarmersDetail",
    path: "/farmers-detail",
    component: () => import("@/views/farmersDetail/index.vue"),
  },
  {
    name: "SalesmanLogin",
    path: "/salesman-login",
    component: () => import("@/views/salesmanLogin/index.vue"),
  },
  {
    name: "SalesmanMain",
    path: "/salesman-main",
    component: () => import("@/views/salesmanMain/index.vue"),
  },
  {
    name: "SalesmanDetail",
    path: "/salesman-detail",
    component: () => import("@/views/salesmanDetail/index.vue"),
  }
] as unknown as RouteRecordRaw[];
