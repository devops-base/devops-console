import type { IPermissions } from "@/pages/login/model"
import authentication from "@/utils/authentication"

/**
 * 授权参数转字符串数组
 * @param permissions - 授权值
 */
export const permissionsToArray = (permissions: IPermissions[]): string[] => {
  const res: string[] = []
  for (let i = 0; i < permissions.length; i++) {
    if (permissions[i]?.children?.length > 0) {
      const { children  } = permissions[i]
      for (let y =0; y< children.length;y++) {
        res.push(children[y].path)
      }
    } else {
      res.push(permissions[i].path)
    }
  }
  return res
}

/**
 *  用户菜单参数转数组
 * @param permissions - 授权值
 */
export const menusToArray = (permissions: IPermissions[]): string[] => {
  const res: string[] = []
  for (let i = 0; i < permissions.length; i++) {
    if (permissions[i]?.children?.length > 0) {
      const { children  } = permissions[i]
      for (let y =0; y< children.length;y++) {
        res.push(children[y].path)
      }
    } else {
      res.push(permissions[i].path)
    }
  }
  return res
}

/**
 * 检测是否有权限
 * @param value - 检测值
 * @param permissions - 权限
 */
export const checkPermission = (value: string, permissions: string[]): boolean => {
  if (!permissions || permissions.length === 0) return false
  return permissions.includes(value)
}

export const CheckPermission = (value: string, permission: string[]): boolean => {
 return  authentication({ requiredPermissions: {actions: value} }, permission)
}
