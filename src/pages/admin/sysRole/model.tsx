import type { IFormList } from '#/form'
import type { ITableColumn, ITableOptions } from '#/public'
import { INPUT_REQUIRED } from '@/utils/config'
import { USER_STATUS} from '@/utils/constants'
import {dateFormat} from "@/components/DateFormat"
import {valueToLable} from "@/utils/helper"
import {ITreeProps} from "@/components/Tree/BasicTree"

// 搜索数据
export const searchList: IFormList[] = [
  {
    label: '角色名称',
    name: 'roleName',
    component: 'Input'
  },
  {
    label: '权限字符',
    name: 'roleKey',
    component: 'Input'
  },
  {
    label: '状态',
    name: 'status',
    component: 'Select',
    componentProps: {
      options: USER_STATUS
    },
    wrapperCol: 150,
  }
]

/**
 * 表格数据
 * @param optionRender - 渲染操作函数
 */
 export const tableColumns: (optionRender: ITableOptions<object>)=> ITableColumn = (optionRender) => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 100,
      fixed: 'left'
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      width: 200,
      fixed: 'left'
    },
    {
      title: '权限字符',
      dataIndex: 'roleKey',
      width: 300
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 200,
      render: (value: string) => (
        <span>{ valueToLable(value, USER_STATUS) }</span>
      )
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
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
      title: '操作',
      dataIndex: 'operate',
      width: 180,
      fixed: 'right',
      render: (value: unknown, record: object) => optionRender(value, record)
    },
  ]
}

// 新增数据
export const createList: ( TreeProps: ITreeProps ) => IFormList[] = (TreeProps) => [
  {
    label: '角色名称',
    name: 'roleName',
    rules: INPUT_REQUIRED,
    placeholder: '请输入角色名称',
    component: 'Input'
  },
  {
    label: '权限字符',
    name: 'roleKey',
    placeholder: '请输入权限字符',
    rules: INPUT_REQUIRED,
    component: 'Input'
  },
  {
    label: '角色顺序',
    name: 'roleSort',
    component: 'InputNumber',
    rules: INPUT_REQUIRED,
    componentProps: {
      style: {width: '100%'},
      min: 0,
    }
  },
  {
    label: '状态',
    name: 'status',
    component: 'RadioGroup',
    componentProps: {
      options: USER_STATUS,
    }
  },
  {
    label: '菜单权限',
    name: 'sysMenu',
    component: 'Tree',
    componentProps: TreeProps,
  },
  {
    label: '备注',
    name: 'remark',
    component: 'Textarea',
    componentProps: {
      rows: 4,
      placeholder: '备注'
    }
  },
]


