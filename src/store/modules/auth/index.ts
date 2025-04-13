import { defineStore } from "pinia";
import {
  generateFlattenRoutes,
  generateRoutes,
  getAllBreadcrumbList,
  getShowStaticAndDynamicMenuList,
} from "@/utils";
import { configSource } from "@/config";
import authMenu from "@/assets/json/authMenu.json";
import authUser from "@/assets/json/authUser.json";
import staticRoutes from "@/router/staticRoutes";
import type { IState } from "./types";

export default defineStore("auth", {
  state: (): IState => ({
    roles: [],
    userInfo: {
      username: "",
      avatar: "",
      email: ""
    },
    token: "",
    menuList: [],
    recursiveMenuList: [],
    breadcrumbList: [],
    buttonList: [],
    loginUser: {
      userId: 0,
      loginName: "",
      sex: "",
      avatar: ""
    },
    roleList: []
  }),
  actions: {
    setTokenAction(token: string) {
      this.token = token;
    },
    // 获取后端菜单数据
    async routesListAction() {
      // res.data是后端接口原始数据，进行扁平化路由数据。
      this.menuList = generateFlattenRoutes(authMenu.data);
      // 持久化递归菜单数据，左侧菜单栏渲染，这里的菜单将后端数据进行递归，需要将动态路由 isHide == 0 的隐藏菜单剔除，将静态路由 isHide == 0 的隐藏菜单剔除
      this.recursiveMenuList = getShowStaticAndDynamicMenuList(staticRoutes).concat(
        generateRoutes(getShowStaticAndDynamicMenuList(authMenu.data), 0)
      );
      // 面包屑需要静态和动态所有的数据，无论是否隐藏
      this.breadcrumbList = staticRoutes.concat(generateRoutes(authMenu.data, 0));
    },
    // 获取角色数据 AND 按钮数据 AND 用户信息
    async getLoginUserInfoAction() {
      this.roleList = authUser.data.roles;
      this.buttonList = authUser.data.buttons;
      this.loginUser = authUser.data.loginUser;
    }
  },
  getters: {
    // 按钮权限列表
    getButtonList: (state) => state.buttonList,
    // 菜单权限列表 ==> 原始后端接口菜单数据，扁平化之后的一维数组菜单，主要用来添加动态路由，隐藏和不隐藏的菜单路由都需要
    getMenuList: (state) => state.menuList,
    // 菜单权限列表 ==> 左侧菜单栏渲染，这里的菜单将后端数据进行递归，需要将动态路由 isHide == 0 的隐藏菜单剔除, 将静态路由 isHide == 0 的隐藏菜单剔除
    showMenuList: (state) => state.recursiveMenuList,
    // 递归处理后的所有面包屑导航列表
    getBreadcrumbList: (state) => getAllBreadcrumbList(state.breadcrumbList)
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "token",
        storage: window[configSource.storage],
        paths: ["token"]
      }
    ]
  }
});
