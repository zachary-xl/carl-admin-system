import { HOME_URL } from "@/config";
import type { RouteRecordRaw } from "vue-router";

export const staticRouter: RouteRecordRaw[] = [
  /** 主控台 */
  {
    path: HOME_URL, // [唯一]
    component: () => import("@/views/home/index.vue"),
    meta: {
      title: "主控台", // 标题
      enName: "Master Station", // 英文名称
      icon: "HomeFilled", // 图标 HomeFilled
      isHide: "1", // 代表路由在菜单中是否隐藏，是否隐藏[0隐藏，1显示]
      isLink: "", // 是否外链[有值则是外链]
      isKeepAlive: "0", // 是否缓存路由数据[0是，1否]
      isFull: "1", // 是否缓存全屏[0是，1否]
      isAffix: "0" // 是否缓存固定路由[0是，1否]
    }
  }
];
