import { request } from '@/servers/request';
import {PageServerResult, TableData} from "#/public";
import {ServerResult} from "@/servers/request/types";
import {IConstant} from "@/utils/constants";
import {FormData} from "#/form";

enum API {
  URL = '/v1/script'
}

export function getScriptPage(data?: unknown) {
  return request.get<PageServerResult<TableData[]>>(
    `${API.URL}`,
    {params: data}
  );
}

/**
 * 根据ID获取数据
 * @param id - ID
 */
export function getScriptById(id: string) {
  return request.get<ServerResult<FormData>>(`${API.URL}/${id}`);
}

/**
 * 新增数据
 * @param data - 请求数据
 */
export function createScript(data: FormData) {
  return request.post<ServerResult>(`${API.URL}`, data);
}

/**
 * 修改数据
 * @param id - 修改id值
 * @param data - 请求数据
 */
export function updateScript(id: string, data: FormData) {
  return request.put<ServerResult>(`${API.URL}/${id}`, data);
}

/**
 * 删除
 * @param id
 */
export function deleteScript(id: number) {
  return request.delete<ServerResult>(`${API.URL}/${id}`);
}

// 获取脚本列表
export function getAllScripts() {
  return request.get<ServerResult<IConstant[]>>(`${API.URL}/list`);
}

// 执行主机
export function runScript(data: FormData) {
  return request.post<ServerResult>(`${API.URL}/run`, data);
}
