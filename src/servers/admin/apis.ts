import { request } from '@/utils/request'
import {IPageServerResult, IPaginationData, IServerResult} from "#/public"
import {IConstant} from "@/utils/constants"
import {IFormData} from "#/form"

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

/**
 * 分页获取API接口数据
 */
export function getApiPage(data: Partial<IFormData> & IPaginationData) {
  return request.get<IPageServerResult<IFormData[]>>(
    `${API.URL}`,
    { params: data }
  )}

/**
 * 修改API接口
 */
export function updateApi(id: string, data: IFormData) {
    return request.put(`${API.URL}/${id}`, data)
}

/**
 * 获取单个API记录
 */
export function getApiById(id: string) {
  return request.get(`${API.URL}/${id}`)
}
