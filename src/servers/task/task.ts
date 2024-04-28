import {request} from "@/servers/request";
import {PageServerResult, ServerResult, TableData} from "#/public";
import {FormData} from "#/form";

enum API {
  URL = "/v1/task"
}

// 分页查询
export function getTaskPage(data?: unknown) {
  return request.get<PageServerResult<TableData[]>>(
    `${API.URL}`,
    {params: data}
  );
}

/**
 * 根据ID获取数据
 * @param id - ID
 */
export function getTaskById(id: string) {
  return request.get<ServerResult<FormData>>(`${API.URL}/${id}`);
}

/**
 * 新增数据
 * @param data - 请求数据
 */
export function createTask(data: FormData) {
  return request.post<ServerResult>(`${API.URL}`, data);
}

/**
 * 修改数据
 * @param id - 修改id值
 * @param data - 请求数据
 */
export function updateTask(id: string, data: FormData) {
  return request.put<ServerResult>(`${API.URL}/${id}`, data);
}

/**
 * 删除
 * @param id
 */
export function deleteTask(id: number) {
  return request.delete<ServerResult>(`${API.URL}/${id}`);
}

/**
 * 设置任务状态
 */
export function setTaskStatus(data: FormData) {
  return request.post<ServerResult>(`${API.URL}/set`, data);
}

/**
 * 手动执行定时任务
 */
export function runTask(id: number) {
  return request.put<ServerResult>(`${API.URL}/run/${id}`);
}
