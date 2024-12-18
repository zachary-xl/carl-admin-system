import { defineStore } from "pinia";
import { DEFAULT_THEME } from "@/config";

export const useGlobalStore = defineStore("global", {
  state: () => ({
    // 是否全屏
    isFullScreen: false,
    // 是否折叠菜单
    isCollapse: false,
    // 菜单展开宽度[默认：220px]
    menuWidth: 220,
    // 默认关闭黑暗模式
    isDark: false,
    // ElementPlus 尺寸大小
    dimension: "default",
    // 当前页面是否全屏
    maximize: false,
    // 当前系统语言[默认中文]
    language: "zh",
    // 选择主题[默认兔子坦克形态]
    themeColor: DEFAULT_THEME,
    // 布局模式 (纵向：vertical | 经典：classic | 横向：horizontal | 分栏：column)
    layout: "vertical",
    // 路由动画
    transition: "fade-default",
    // 菜单是否可展开单个[默认：true仅仅一个]
    uniqueOpened: true,
    // 灰色模式
    isGrey: false,
    // 色弱模式
    isWeak: false,
    // 侧边栏反转
    asideInverted: false,
    // 头部反转
    headerInverted: false
  }),
  actions: {
    // 设置当前global.ts所有参数值
    setGlobalState(...args: any) {
      this.$patch({ [args[0]]: args[1] });
    },
    // 设置语言
    setLanguage(language: string) {
      this.language = language;
    },
    // 该函数没有上下文数据，所以获取state中的变量需要使用this
    setCollapse(value: boolean) {
      this.isCollapse = !value;
      return this.isCollapse;
    },
    // 设置左侧菜单宽度
    setMenuWidth(value: number) {
      this.menuWidth = value;
      return this.menuWidth;
    },
    // 设置ElementPlus尺寸
    setDimension(value: string) {
      this.dimension = value;
    }
  },
  persist: {
    enabled: true
  }
});
