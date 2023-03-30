import type { IFormList} from "#/form"
import type { ITableColumn, ITableOptions } from '#/public'
import { INPUT_REQUIRED, SELECT_REQUIRED } from '@/utils/config'
import {IConstant, MENU_ACTIONS, MENU_STATUS, MENU_TYPE, MENUS_FRAME,} from '@/utils/constants'
import {dateFormat, valueToColorJSX} from "@/components/DateFormat"
import {RadioChangeEvent, TransferProps} from "antd"

// 搜索数据
export const searchList: IFormList[] = [
  {
    label: '菜单名称',
    name: 'title',
    component: 'Input',
    placeholder: '请输入菜单名称'
  },
  {
    label: '状态',
    name: 'visible',
    component: 'Select',
    componentProps: {
      options: MENU_STATUS,
      style: {width: '150px'}
    },
  }
]

/**
 * 表格数据
 * @param optionRender - 渲染操作函数
 */
export const tableColumns = (optionRender: ITableOptions<object>): ITableColumn => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 200,
    },
    {
      title: '菜单名称',
      dataIndex: 'title',
      width: 200
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 200,
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
      width: 200
    },
    {
      title: '组件路径',
      dataIndex: 'path',
      width: 200
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 200,
      render: (value: string) => (
        <span>{ dateFormat(value) }</span>
      )
    },
    {
      title: '可见',
      dataIndex: 'visible',
      width: 100,
      render: (value: string) => (
        valueToColorJSX(value)
      )
    },
    {
      title: '操作',
      dataIndex: 'operate',
      width: 200,
      fixed: 'right',
      render: (value: unknown, record: object) => optionRender(value, record)
    },
  ]
}

// 新增数据
// @ts-ignore
export const createList: (transferProps: TransferProps<IConstant> , menuList: IConstant[], menuType: string, handleSetMuns: (e: RadioChangeEvent) => void) => IFormList[] = (transferProps, MENU_LIST, menuType, HandleSetMenus) => {
  return [
    {
      label: '上级菜单',
      name: 'parentId',
      rules: SELECT_REQUIRED,
      component: 'TreeSelect',
      componentProps: {
        treeData: MENU_LIST,
        placeholder: '请选择父级菜单'
      },
    },
    {
      label: '菜单标题',
      name: 'title',
      rules: INPUT_REQUIRED,
      component: 'Input',
      componentProps: {
        placeholder: '请输入菜单名称'
      }
    },
    {
      label: '显示排序',
      name: 'sort',
      component: 'InputNumber',
      rules: INPUT_REQUIRED,
      componentProps: {
        style: {width: '100%'},
        min: 0,
      }
    },
    {
      label: '菜单类型',
      name: 'menuType',
      component: 'RadioGroup',
      componentProps: {
        options: MENU_ACTIONS,
        onChange: HandleSetMenus
      }
    },
    {
      label: '菜单图标',
      name: 'icon',
      component: 'Input',
      rules: INPUT_REQUIRED,
      componentProps: {
        placeholder: '请输入antd icon代码'
      }
    },
    {
      label: '路由名称',
      name: 'menuName',
      component: 'Input',
      rules: INPUT_REQUIRED,
      hidden: menuType === MENU_TYPE.BUTTON,
      componentProps: {
        placeholder: '需要和页面name保持一致,对应页面即可选择缓存'
      }
    },
    {
      label: '组件路径',
      name: 'component',
      component: 'Input',
      rules: INPUT_REQUIRED,
      hidden: menuType === MENU_TYPE.BUTTON,
      componentProps: {
        placeholder: '菜单对应的具体前端文件路径Pages的下级路径/admin/sysUser/index；目录类型：填写Layout,如何有二级目录请参照日志目录填写'
      }
    },
    {
      label: '是否外链',
      name: 'isFrame',
      component: 'RadioGroup',
      hidden: menuType === MENU_TYPE.BUTTON,
      componentProps: {
        options: MENUS_FRAME,
        placeholder: '是否可以通过iframe打开指定地址'
      },
    },
    {
      label: '路由地址',
      name: 'path',
      component: 'Input',
      rules: INPUT_REQUIRED,
      hidden: menuType == MENU_TYPE.BUTTON,
      componentProps: {
        placeholder: '访问此页面自定义的url地址,建议/开头书写,例如 /app-name/menu-name'
      }
    },
    {
      label: '权限标识',
      name: 'permission',
      component: 'Input',
      hidden: menuType === MENU_TYPE.DIR,
      rules: INPUT_REQUIRED,
      componentProps: {
        placeholder: "前端权限控制按钮是否显示"
      }
    },
    {
      label: '菜单状态',
      name: 'visible',
      component: 'RadioGroup',
      hidden: menuType == MENU_TYPE.BUTTON,
      componentProps: {
        options: MENU_STATUS,
      },
    },
    {
      label: 'API权限',
      name: 'apis',
      component: 'Transfer',
      hidden: menuType == MENU_TYPE.DIR,
      componentProps: transferProps,
    }
    // {
    //   label: 'API权限',
    //   name: 'apis',
    //   component: 'customize',
    //   hidden: menuType == MENU_TYPE.DIR,
    //   render: CustomizeTransfer,
    //   componentProps: {
    //     targetKeys: targetAPI,
    //     listStyle: {width: '180px', height: '200px'},
    //     onChange: handleSetTargetAPi,
    //     dataSource: APIS,
    //   }
    // }
  ]
}

