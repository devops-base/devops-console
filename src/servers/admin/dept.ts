
import { request } from '@/utils/request'
import {IFormData} from "#/form"
import {IPaginationData, IServerResult} from "#/public"

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

/**
 * 获取分页数据
 * @param data - 请求数据
 */
export function getDeptPage(data: Partial<IFormData> & IPaginationData) {
  return request.get<IServerResult<IFormData[]>>(
    `${API.URL}`,
    { params: data }
  )
}

/**
 * 根据ID获取数据
 * @param id - ID
 */
export function getDeptById(id: string) {
  return request.get(`${API.URL}/${id}`)
}

/**
 * 新增数据
 * @param data - 请求数据
 */
export function createDept(data: IFormData) {
  return request.post(`${API.URL}`, data)
}

/**
 * 修改数据
 * @param id - 修改id值
 * @param data - 请求数据
 */
export function updateDept(id: string, data: IFormData) {
  return request.put(`${API.URL}/${id}`, data)
}

/**
 * 删除
 * @param id - 删除id值
 */
export function deleteDept(id: string) {
  return request.delete(`${API.URL}/${id}`)
}
