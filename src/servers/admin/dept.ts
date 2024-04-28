import {request} from "@/servers/request";
import {ServerResult} from "@/servers/request/types";
import {FormData} from "#/form";
import {TableData} from "#/public";

enum API {
  URL = '/v1/sysDept'
}

// 获取所有部门数据
export function getAllDept() {
  return request.get<ServerResult<FormData[]>>(
    `${API.URL}/list`,
  );
}

// 获取部门树数据
export function getDeptTreeData() {
  return request.get<ServerResult<FormData>>(
    `${API.URL}/deptTree`
  );
}

// 分页获取部门信息
export function getDeptPage(data?: unknown) {
  return request.get<ServerResult<TableData[]>>(`${API.URL}`, {params: data});
}

// 根据Id获取数据
export function getDeptId(id: string) {
  return request.get<ServerResult<FormData>>(`${API.URL}/${id}`);
}

// 新增数据
export function createDept(data: FormData) {
  return request.post<ServerResult>(`${API.URL}`, data);
}

// 更新部门
export function updateDept(id: string, data: unknown) {
  return request.put<ServerResult>(`${API.URL}/${id}`, data);
}

// 删除部门
export function deleteDept(id: number) {
  return request.delete<ServerResult>(`${API.URL}/${id}`);
}
