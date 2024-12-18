/**
 * errorRoutes (错误页面路由)
 */
export const errorRoutes = [
  {
    path: "/401",
    name: "401",
    component: () => import("@/views/error/401.vue"),
    meta: {
      title: "401页面",
      enName: "401 Page", // 英文名称
      icon: "QuestionFilled", // 菜单图标
      isHide: "1", // 代表路由在菜单中是否隐藏，是否隐藏[0隐藏，1显示]
      isLink: "1", // 是否外链[有值则是外链]
      isKeepAlive: "0", // 是否缓存路由数据[0是，1否]
      isFull: "1", // 是否缓存全屏[0是，1否]
      isAffix: "1" // 是否缓存固定路由[0是，1否]
    }
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error/404.vue"),
    meta: {
      title: "404页面",
      enName: "404 Page", // 英文名称
      icon: "CircleCloseFilled", // 菜单图标
      isHide: "1", // 代表路由在菜单中是否隐藏，是否隐藏[0隐藏，1显示]
      isLink: "1", // 是否外链[有值则是外链]
      isKeepAlive: "0", // 是否缓存路由数据[0是，1否]
      isFull: "1", // 是否缓存全屏[0是，1否]
      isAffix: "1" // 是否缓存固定路由[0是，1否]
    }
  },
  // 找不到path将跳转404页面
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/error/404.vue")
  }
];
