export type ElementPlusSize = "default" | "small" | "large";

export type LayoutType = "vertical" | "classic" | "horizontal" | "column";

export interface IGlobalState {
  isFullScreen: boolean;
  isCollapse: boolean;
  menuWidth: number;
  isDark: boolean;
  dimension: ElementPlusSize;
  maximize: boolean;
  language: string;
  themeColor: string;
  layout: LayoutType;
  transition: string;
  uniqueOpened: boolean;
  isGrey: boolean;
  isWeak: boolean;
  asideInverted: boolean;
  headerInverted: boolean;
}
