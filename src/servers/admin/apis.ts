import {request} from "@/servers/request";
import {ServerResult} from "@/servers/request/types";
import {FormData} from "#/form";
import {PageServerResult, TableData} from "#/public";

enum API {
  URL = '/v1/sysApi'
}

/**
 * 获取API接口数据
 */
export function getApisList() {
  return request.get<ServerResult<FormData[]>>(
    `${API.URL}/list`,
  );
}

/**
 * 分页获取API接口数据
 */
export function getApiPage(data?: unknown) {
  return request.get<PageServerResult<TableData[]>>(`${API.URL}`, {params: data});
}

/**
 * 修改API接口
 */
export function updateApi(id: string, data: unknown) {
  return request.put<ServerResult>(`${API.URL}/${id}`, data);
}

/**
 * 获取单个API记录
 */
export function getApiById(id: string) {
  return request.get<ServerResult<FormData>>(`${API.URL}/${id}`);
}
