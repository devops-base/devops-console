import {request} from "@/servers/request";
import {PageServerResult, TableData} from "#/public";

enum API {
  URL = '/v1/opt/log'
}

// 分页查询
export function getOptLogPage(data?: unknown) {
  return request.get<PageServerResult<TableData[]>>(
    `${API.URL}`,
    {params: data}
  );
}
