// 接口传入数据
export interface LoginData {
  username: string;
  password: string;
  code: string;
  uuid: string
}

// 授权数据
export interface PermissionsData {
  id: string;
  operation: string[];
}

// 接口返回数据
export interface LoginResult {
  token: string;
  code: number;
  currentAuthority: string;
  expire: string;
  success: boolean;
}

// 用户信息接口返回数据
export interface UserInfoResult {
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

// 验证码接口返回数据
export interface CaptchaResult {
  code: number
  data: string;
  id: string;
  msg: string;
  success: boolean;
}

// 授权数据
export interface Permissions {
  RoleId: number;
  action: string;
  apis: number[];
  children: Permissions[];
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
