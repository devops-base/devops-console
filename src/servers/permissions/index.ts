import type { LoginResult } from '@/pages/login/model'
import type { IServerResult } from '#/public'
import { request } from '@/utils/request'

/**
 * 权限
 * @param data - 请求数据
 */
export function getPermissions(data: unknown) {
  return request.get<IServerResult<LoginResult>>(
    '/base/user/refresh-permissions',
    { params: data }
  )
}


