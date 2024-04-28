import type { DefaultOptionType } from "ant-design-vue/es/select";
/**
 * @description: 公用常量
 */

/**
 * 颜色
 */
 export enum colors {
  success = 'green',
  primary = '#409EFF',
  warning = '#E6A23C',
  danger = 'red',
  info = '#909399'
}

/*
* 菜单类型
* */
export enum MENU_TYPE {
  DIR = "M", // 目录
  MENUS = "C", // 菜单
  BUTTON = "F" // 按钮
}

export interface IConstant extends Omit<DefaultOptionType, 'value'> {
  value: string | number;
  label: string;
  id?: number,
  children?: IConstant[];
}

/**
 * 开启状态
 */
 export const OPEN_CLOSE: IConstant[] = [
  { label: '开启', value: 1 },
  { label: '关闭', value: 0 }
];

/**
 * 菜单状态
 */
 export const MENU_STATUS: IConstant[] = [
  { label: '显示', value: '2' },
  { label: '隐藏', value: '1' }
];

/**
 * API接口请求类型
 */
export const API_ACTION_TYPES: IConstant[] = [
  {label: 'GET', value: 'GET'},
  {label: 'POST', value: 'POST'},
  {label: 'PUT', value: 'PUT'},
  {label: 'DELETE', value: 'DELETE'},
];

/**
 * API 接口类型
 */
export const API_TYPES: IConstant[] = [
  {label: 'SYS', value: 'SYS'},
  {label: 'BUS', value: 'BUS'}
];

// 菜单类型
export const MENU_ACTIONS: IConstant[] = [
  { value: 'M', label: '目录' },
  { value: 'C', label: '菜单' },
  { value: 'F', label: '按钮' },
];

/**
 * 菜单是否外链
 */
 export const MENUS_FRAME: IConstant[] = [
  { label: '是', value: '0' },
  { label: '否', value: '1' }
];

/*
* 用户状态类型
**/
export const USER_STATUS: IConstant[] = [
  { label: '正常', value: '2'},
  { label: '停用', value: '1'}
];

/**
 * 权限范围类型
 */
export const DataScopeOptions: IConstant[] = [
  { label: '全部数据权限', value: '1'},
  { label: '自定数据权限', value: '2'},
  { label: '本部门数据权限', value: '3'},
  { label: '本部门及以下数据权限', value: '4'},
  { label: '仅本人数据权限', value: '5'},
];
