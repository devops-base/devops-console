import { request } from '@/utils/request'
import { IServerResult} from "#/public"
import {IConstant} from "@/utils/constants"

enum API {
  URL = '/v1/sysApi'
}

/**
 * 获取API接口数据
 */
export function getApisList() {
  return request.get<IServerResult<IConstant[]>>(
    `${API.URL}/list`,
  )
}


