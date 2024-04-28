import {request} from "@/servers/request";
import {ServerResult} from "@/servers/request/types";
import {TableData} from "#/public";
import {FormData} from "#/form";

enum API {
  URL = '/v1/sysMenu'
}

// 获取菜单列表
export function getMenuList() {
  return request.get<ServerResult<FormData[]>>(
    `${API.URL}/list`,
  );
}

// 分页
export function getMenuPage(data?: unknown) {
  return request.get<ServerResult<TableData[]>>(`${API.URL}`, {params: data});
}

// 查询详情
export function getMenuById(id: string) {
  return request.get<ServerResult<FormData>>(`${API.URL}/${id}`);
}

// 创建菜单
export function createMenu(data: FormData) {
  return request.post<ServerResult>(`${API.URL}`, data);
}

// 更新菜单
export function updateMenu(id: string, data: unknown) {
  return request.put<ServerResult>(`${API.URL}/${id}`, data);
}

// 删除菜单
export function deleteMenu(id: number) {
  return request.delete<ServerResult>(`${API.URL}/${id}`);
}
