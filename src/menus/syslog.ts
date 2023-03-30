import type { ISideMenu } from '#/public'

export const syslog: ISideMenu[] = [
  {
    label: '系统审计',
    key: 'syslog',
    icon: 'pixelarticons:add-box',
    children: [
      {
        label: '登陆日志',
        key: '/syslog/sysLoginLog',
        rule: '/syslog/sysLoginLog',
      },
      {
        label: '操作日志',
        key: '/syslog/sysOperaLog',
        rule: '/syslog/sysOperaLog',
      },
    ]
  }
]
