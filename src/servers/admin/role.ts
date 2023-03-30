import { request } from '@/utils/request'
import {IFormData} from "#/form"
import { IServerResult} from "#/public"

enum API {
  URL = '/v1/sysRole'
}

/**
 * 获取所有角色数据
 */
export function getAllRoles() {
  return request.get<IServerResult<IFormData[]>>(
    `${API.URL}/list`,
  )
}
