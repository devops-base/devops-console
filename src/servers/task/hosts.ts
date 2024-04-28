import { request } from '@/servers/request';
import {ServerResult} from "@/servers/request/types";
import {IConstant} from "@/utils/constants";
import {FormData} from "#/form";
import {PageServerResult, TableData} from "#/public";

enum API {
  URL = '/v1/host'
}

// 获取主机列表
export function getAllHosts() {
  return request.get<ServerResult<IConstant[]>>(`${API.URL}/list`);
}

// 分页获取
export function getHostPage(data?: unknown) {
  return request.get<PageServerResult<TableData[]>>(`${API.URL}`, {params: data});
}

// 详情
export function getHostById(id: string) {
  return request.get<ServerResult<FormData>>(`${API.URL}/${id}`);
}

// 更新
export function updateHost(id: string, data: unknown) {
  return request.put<ServerResult>(`${API.URL}/${id}`, data);
}

// 创建
export function createHost(data: FormData) {
  return request.post<ServerResult>(`${API.URL}`, data);
}

// 删除
export function delHost(id: number) {
  return request.delete<ServerResult>(`${API.URL}/${id}`);
}

// ping测试
export function pingHost(id: number) {
  return request.get<ServerResult>(`${API.URL}/ping/${id}`);
}
