import type {CaptchaResult, LoginData, LoginResult, UserInfoResult} from '@/pages/login/model';
import { request } from '@/servers/request';
import {ServerResult} from "@/servers/request/types";
import {SideMenu} from "#/public";

/**
 * 登录
 * @param data - 请求数据
 */
export function login(data: LoginData) {
  return request.post<LoginResult>('/v1/login', data);
}

/**
 * 修改密码
 * @param data - 请求数据
 */
export function updatePassword(data: unknown) {
  return request.post('/update-password', data);
}

/*
*
* 获取系统验证码
*/
export function getCaptcha() {
  return request.get<CaptchaResult>('/v1/captcha');
}

// 获取用户信息
export function getUserInfo() {
  return request.get<ServerResult<UserInfoResult>>('/v1/getUserInfo');
}

// 获取用户权限
export function getUserMenus() {
  return request.get<ServerResult<SideMenu[]>>('/v1/userMenu/list');
}
