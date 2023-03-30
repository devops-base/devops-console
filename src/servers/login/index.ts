import type { ILoginData, ILoginResult } from '@/pages/login/model'
import type { IServerResult } from '#/public'
import { request } from '@/utils/request'
import {ICaptchaResult, IUserInfoResult, IUserPermission} from "@/pages/login/model"

/**
 * 登录
 * @param data - 请求数据
 */
export function login(data: ILoginData) {
  return request.post<ILoginResult>('/v1/login', data)
}

/**
 * 修改密码
 * @param data - 请求数据
 */
export function updatePassword(data: unknown) {
  return request.post<IServerResult>('/update-password', data)
}

/*
*
* 获取系统验证码
*/
export function getCaptcha() {
  return request.get<ICaptchaResult>('/v1/captcha')
}

// 获取用户信息
export function getUserInfo() {
  return request.get<IServerResult<IUserInfoResult>>('/v1/getUserInfo')
}

// 获取用户权限
export function getPermission() {
  return request.get<IUserPermission>('/v1/menurole')
}
