
import { request } from '@/utils/request'
import {IFormData} from "#/form"
import { IServerResult} from "#/public"

enum API {
  URL = '/v1/sysDept'
}

/**
 * 获取所有部门数据
 */
export function getAllDept() {
  return request.get<IServerResult<IFormData[]>>(
    `${API.URL}/list`,
  )
}

