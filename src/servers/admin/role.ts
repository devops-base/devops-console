import {request} from "@/servers/request";
import {ServerResult} from "@/servers/request/types";
import {FormData} from "#/form";
import {PageServerResult, TableData} from "#/public";

enum API {
  URL = '/v1/sysRole'
}

/**
 * 获取所有角色数据
 */
export function getAllRoles() {
  return request.get<ServerResult<FormData[]>>(
    `${API.URL}/list`,
  );
}

// 删除角色
export function deleteRole(id: number) {
  return request.delete<ServerResult>(`${API.URL}/${id}`);
}

// 更新角色
export function updateRole(id: string, data: unknown) {
  return request.put<ServerResult>(`${API.URL}/${id}`, data);
}

// 新增角色
export function createRole(data: FormData) {
  return request.post<ServerResult>(`${API.URL}`, data);
}

// 根据Id查询角色
export function getRoleById(id: string) {
  return request.get<ServerResult<FormData>>(`${API.URL}/${id}`);
}

// 分页获取角色数据
export function getRolePage(data?: unknown) {
  return request.get<PageServerResult<TableData[]>>(`${API.URL}`, {params: data});
}

// 更新角色scope权限
export function updateRoleDataScope(data: unknown) {
  return request.put<ServerResult>(`${API.URL}/roleDataScope`, data);
}
