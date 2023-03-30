import type { ISideMenu } from '#/public'

export const content: ISideMenu[] = [
  {
    label: '内容管理',
    key: 'content',
    icon: 'pixelarticons:add-box',
    children: [
      {
        label: '文章管理',
        key: '/content/article',
        rule: '/content/article',
      },
    ]
  }
]
