import {request} from "@/servers/request";
import {PageServerResult, ServerResult, TableData} from "#/public";

enum API {
  URL = '/v1/log'
}

// 分页查询
export function getLogPage(data?: unknown) {
  return request.get<PageServerResult<TableData[]>>(
    `${API.URL}`,
    {params: data}
  );
}

/**
 * 清空日志
 */
export function clearLog() {
  return request.put<ServerResult>(`${API.URL}/clear`);
}

/**
 * 停止正在运行的任务
 * @param id - 修改id值
 */
export function stopExitTask(id: number) {
  return request.put<ServerResult>(`${API.URL}/stop/${id}`);
}

/**
 * 获取日志详情
 * @param id - 修改id值
 * @param data
 */
export function getLogDetail(id: string, data: unknown) {
  return request.get<ServerResult>(`${API.URL}/${id}`, {params: data});
}
