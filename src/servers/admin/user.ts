import {request} from "@/servers/request";
import {ServerResult} from "@/servers/request/types";
import {FormData} from "#/form";
import {PageServerResult, TableData} from "#/public";

enum API {
  URL = '/v1/sysUser'
}

// 删除数据
export function deleteUser(id: number) {
  return request.delete<ServerResult>(`${API.URL}/${id}`);
}

// 更新数据
export function updateUser(id: string, data: unknown) {
  return request.put<ServerResult>(`${API.URL}/${id}`, data);
}

// 新增数据
export function createUser(data: FormData) {
  return request.post<ServerResult>(`${API.URL}`, data);
}

// 根据Id查询用户数据
export function getUserById(id: string) {
  return request.get<ServerResult<FormData>>(`${API.URL}/${id}`);
}

// 分页获取用户数据
export function getUserPage(data?: unknown) {
  return request.get<PageServerResult<TableData[]>>(`${API.URL}`, {params: data});
}

// 查询用户列表
export function getUserList() {
  return request.get<ServerResult<FormData[]>>(
    `${API.URL}/list`,
  );
}
