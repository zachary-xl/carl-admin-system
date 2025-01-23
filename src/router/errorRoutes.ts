import type { RouteRecordRaw } from "vue-router";

export default [
  {
    path: "/401",
    name: "NotPermission",
    component: () => import("@/views/error/401.vue"),
    meta: {
      title: "401"
    }
  },
  {
    path: "/401",
    name: "NotPermission",
    component: () => import("@/views/error/401.vue"),
    meta: {
      title: "401"
    }
  },
  {
    path: "/:pathMatch(.*)",
    component: () => import("@/views/error/404.vue")
  }
] as unknown as RouteRecordRaw[];
