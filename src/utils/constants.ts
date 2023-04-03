import { DefaultOptionType } from 'antd/es/select'

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
  DIR = "M",  // 目录
  MENUS = "C", // 菜单
  BUTTON = "F"   // 按钮
}

export interface IConstant extends Omit<DefaultOptionType, 'children'> {
  value: string | number;
  label: string;
  id?: number,
  color?: colors;
  children?: IConstant[];
}

// 日期格式化
export const DATE_FORMAT = 'YYYY-MM-DD'
export const TIME_FORMAT = 'YYYY-MM-DD hh:mm:ss'

/**
 * 菜单是否外链
 */
 export const MENUS_FRAME: IConstant[] = [
  { label: '是', value: '0' },
  { label: '否', value: '1' }
]

/**
 * 菜单状态
 */
 export const MENU_STATUS: IConstant[] = [
  { label: '显示', value: '0' },
  { label: '隐藏', value: '1' }
]

/**
 * 菜单模块
 */
 export const MENU_MODULE: IConstant[] = [
  { value: 'authority', label: '权限系统' },
  { value: 'platform', label: '运营系统' },
  { value: 'stat', label: '统计系统' },
  { value: 'ad', label: '投放系统' },
  { value: 'cs', label: '客服系统' },
  { value: 'log', label: '日志系统' }
]

/**
 * 菜单作用类型
 */
 export const MENU_ACTIONS: IConstant[] = [
  { value: 'M', label: '目录' },
  { value: 'C', label: '菜单' },
  { value: 'F', label: '按钮' },
]

/*
* 用户状态类型
**/
export const USER_STATUS: IConstant[] = [
  { label: '正常', value: '2'},
  { label: '停用', value: '1'}
]

/**
 * API接口请求类型
 */
export const API_ACTION_TYPES: IConstant[] = [
  {label: 'GET', value: 'GET'},
  {label: 'POST', value: 'POST'},
  {label: 'PUT', value: 'PUT'},
  {label: 'DELETE', value: 'DELETE'},
]

/**
 * API 接口类型
 */
export const API_TYPES: IConstant[] = [
  {label: 'SYS', value: 'SYS'},
  {label: 'BUS', value: 'BUS'}
]
