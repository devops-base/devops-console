import type { ISideMenu } from '#/public'

export const schedule: ISideMenu[] = [
  {
    label: '任务调度',
    key: 'schedule',
    icon: 'pixelarticons:add-box',
    children: [
      {
        label: '调度日志',
        key: '/schedule/log',
        rule: '/schedule/log',
      },
    ]
  }
]
