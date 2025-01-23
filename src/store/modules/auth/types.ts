export interface IState {
  userInfo: IUserInfo;
  roles: string[];
  permissions?: string[];
  token: string;
  menuList: any[];
  recursiveMenuList: any[];
  breadcrumbList: any[];
  buttonList: any[];
  loginUser: { userId: number; loginName: string; sex: string; avatar: string };
  roleList: any[];
}

export interface IUserInfo {
  username: string;
  email: string;
  avatar?: string;
}
export interface IMenuList {
  menuId: string;
  path: string;
  superiorId?: any;
  menuType: string;
  name: string;
}
