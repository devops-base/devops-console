import type { ISideMenu } from '#/public'

export const admin: ISideMenu[] = [
  {
    label: '系统管理',
    key: 'admin',
    icon: 'ion:settings-outline',
    children: [
      {
        label: '部门管理',
        key: '/admin/sysDept',
        rule: '/admin/sysDept'
      },
      {
        label: '用户管理',
        key: '/admin/sysUser',
        rule: '/admin/sysUser'
      },
      {
        label: '菜单管理',
        key: '/admin/sysMenu',
        rule: '/admin/sysMenu'
      },
      {
        label: '角色管理',
        key: '/admin/sysRole',
        rule: '/admin/sysRole'
      },
      {
        label: '接口管理',
        key: '/admin/sysApi',
        rule: '/admin/sysApi'
      },
    ]
  }
]
