import {request} from "@/servers/request";
import {ServerResult} from "#/public";
import {IConstant} from "@/utils/constants";

enum API {
  URL = '/v1/types'
}

// 获取脚本类型列表
export function getAllTypes() {
  return request.get<ServerResult<IConstant[]>>(`${API.URL}/list`);
}
