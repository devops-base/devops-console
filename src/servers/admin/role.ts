import { request } from '@/utils/request'
import {IFormData} from "#/form"
import {IPageServerResult, IPaginationData, IServerResult} from "#/public"

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

/**
* 获取角色Page列表
* @param data - 请求数据
* */
export function getRolePage(data: Partial<IFormData> & IPaginationData) {
  return request.get<IPageServerResult<IFormData[]>>(
    `${API.URL}`,
    { params: data }
  )
}

/**
 * 根据ID获取数据
 * @param id - ID
 */
export function getRoleById(id: string) {
  return request.get(`${API.URL}/${id}`)
}

/**
 * 新增数据
 * @param data - 请求数据
 */
export function createRole(data: IFormData) {
  return request.post(API.URL, data)
}

/**
 * 修改数据
 * @param id - 修改id值
 * @param data - 请求数据
 */
export function updateRole(id: string, data: IFormData) {
  data['id'] = id
  return request.put(`${API.URL}/${id}`, data)
}


/**
 * 删除
 * @param id - 删除id值
 */
export function deleteRole(id: string) {
  return request.delete(`${API.URL}/${id}`)
}
