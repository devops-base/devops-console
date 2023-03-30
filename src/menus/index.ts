import type { ISideMenu } from '#/public'
import { admin } from './admin'
import  { syslog } from './syslog'
import {schedule} from "@/menus/schedule"

export const defaultMenus: ISideMenu[] = [
  {
    label: '仪表盘',
    key: 'dashboard',
    icon: 'la:tachometer-alt',
    children: [
      {
        label: '数据总览',
        key: '/dashboard',
        rule: '/dashboard'
      }
    ]
  },
  ...admin as ISideMenu[],
  ...syslog as ISideMenu[],
  ...schedule as ISideMenu[],
]
