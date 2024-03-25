import type {FormList} from '#/form'
import type { ITableColumn, ITableOptions } from '#/public'
import { INPUT_REQUIRED, SELECT_REQUIRED } from '@/utils/config'
import {IConstant, USER_STATUS} from '@/utils/constants'
import {dateFormat} from "@/components/DateFormat"
import {IFormData} from "#/form"
import {valueToLable} from "@/utils/helper"

// 搜索数据
export const searchList: FormList[] = [
  {
    label: '用户名',
    name: 'username',
    component: 'Input'
  },
  {
    label: '手机号',
    name: 'phone',
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
 * @param RoleList - 角色列表
 * @param DeptList - 部门列表
 */
 export const tableColumns: (optionRender: ITableOptions<object>, roleList: IConstant[], deptList: IConstant[])=> ITableColumn = (optionRender,RoleList,DeptList) => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 100,
      fixed: 'left'
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 200,
      fixed: 'left'
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      width: 300
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 300
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 300
    },
    {
      title: '部门',
      dataIndex: 'deptId',
      width: 200,
      render: (value: number) => (
        <span>{ valueToLable(value, DeptList)}</span>
      )
    },
    {
      title: '角色',
      dataIndex: 'roleId',
      width: 200,
      render: (value: number) => (
        <span>{ valueToLable(value, RoleList) }</span>
      )
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
export const createList: (roleList: IFormData[],deptList: IConstant[] ) => FormList[] = (RoleList,DeptList) => [
  {
    label: '用户名',
    name: 'username',
    rules: INPUT_REQUIRED,
    component: 'Input'
  },
  {
    label: '昵称',
    name: 'nickName',
    rules: INPUT_REQUIRED,
    component: 'Input'
  },
  {
    label: '部门',
    name: 'deptId',
    rules: SELECT_REQUIRED,
    component: 'Select',
    componentProps: {
      options: DeptList,
    }
  },
  {
    label: '角色',
    name: 'roleId',
    rules: SELECT_REQUIRED,
    component: 'Select',
    componentProps: {
      options: RoleList,
    },
  },
  {
    label: '手机号',
    name: 'phone',
    rules: INPUT_REQUIRED,
    component: 'Input'
  },
  {
    label: '邮箱',
    name: 'email',
    rules: INPUT_REQUIRED,
    component: 'Input'
  },
  {
    label: '状态',
    name: 'status',
    rules: SELECT_REQUIRED,
    component: 'Select',
    componentProps: {
      options: USER_STATUS
    }
  }
]
