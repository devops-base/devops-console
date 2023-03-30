// 接口传入数据
export interface ILoginData {
  username: string;
  password: string;
  code: string;
  uuid: string
}

// 授权数据
export interface IPermissions {
  RoleId: number;
  action: string;
  apis: number[];
  children: IPermissions[];
  breadcrumb: string;
  component: string;
  createBy: number;
  createdAt: string;
  dataScope: string;
  icon: string;
  isFrame: string;
  is_select: boolean;
  menuId: number;
  menuName: string;
  menuType: string;
  noCache: boolean;
  params: string;
  parentId: number;
  path: string;
  paths: string;
  permission: string;
  sort: number;
  title: string;
  updateBy: number;
  updatedAt: string;
  visible: string;
}

// 接口返回数据
export interface ILoginResult {
  token: string;
  code: number;
  currentAuthority: string;
  expire: string;
  success: boolean;
}

// 验证码接口返回数据
export  interface ICaptchaResult {
  code: number
  data: string;
  id: string;
  msg: string;
  success: boolean;
}

// 用户信息接口返回数据
export interface IUserInfoResult {
  avatar: string;
  buttons: string[];
  deptId: number;
  introduction: string;
  name: string;
  permissions: string[];
  role: string[];
  userId: number;
  userName: string;
}

// 用户权限接口返回数据
export interface IUserPermission {
  code: number;
  data: IPermissions[];
  requestId: string;
}

