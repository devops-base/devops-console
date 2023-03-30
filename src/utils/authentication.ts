/**
*  权限控制
 *  ["admin:sysApi:list","admin:sysApi:edit","admin:sysApi:query"]
* */

export type UserPermission = string[];

type Auth = {
  actions: string; // 菜单权限
};

export interface AuthParams {
  requiredPermissions?: Auth;
  oneOfPerm?: boolean;
}

const judge = (actions: string | undefined, perm: string[]) => {
  if (!perm || !perm.length) {
    return false;
  }
  // 管理员
  if (perm.join('') === '*:*:*') {
    return true;
  }
  return  perm.includes(<string>actions)
};

const auth = (params: Auth | undefined, userPermission: UserPermission) => {
  return judge(params?.actions, userPermission);
};

export default (params: AuthParams, userPermission: UserPermission) => {
  const { requiredPermissions } = params;
  return auth(requiredPermissions, userPermission)
};
