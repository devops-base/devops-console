import {IFormList} from "#/form"
import {ITableColumn, ITableOptions} from "#/public"
import {dateFormat} from "@/components/DateFormat"
import {valueToLable} from "@/utils/helper"
import {IConstant, USER_STATUS} from "@/utils/constants"
import {INPUT_REQUIRED, SELECT_REQUIRED} from "@/utils/config"

// 搜索数据
export const searchList: IFormList[] = [
  {
    label: '部门名称',
    name: 'deptName',
    component: 'Input',
    placeholder: '请输入部门名称'
  },
  {
    label: '状态',
    name: 'status',
    component: 'Select',
    componentProps: {
      options: USER_STATUS,
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
      title: '部门名称',
      dataIndex: 'deptName',
      width: 200,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 200,
    },
    {
      title: '部门负责人',
      dataIndex: 'leader',
    },
    {
      title: '负责人电话',
      dataIndex: 'phone'
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
      width: 200,
      fixed: 'right',
      render: (value: unknown, record: object) => optionRender(value, record)
    },
  ]
}

export const createList: (dept: IConstant[]) => IFormList[] = (Dept) => {
  return [
    {
      label: '上级部门',
      name: 'parentId',
      rules: SELECT_REQUIRED,
      component: 'TreeSelect',
      componentProps: {
        treeData: Dept,
        placeholder: '请选择父级菜单'
      },
    },
    {
      label: '部门名称',
      name: 'deptName',
      component: 'Input',
      rules: INPUT_REQUIRED,
      placeholder: '请输入部门名称'
    },
    {
      label: '负责人',
      name: 'leader',
      rules: INPUT_REQUIRED,
      component: 'Input',
      placeholder: '请输入负责人'
    },
    {
      label: '联系电话',
      name: 'phone',
      rules: INPUT_REQUIRED,
      component: 'Input',
      placeholder: '请输入电话'
    },
    {
      label: '邮箱',
      name: 'email',
      rules: INPUT_REQUIRED,
      component: 'Input',
      placeholder: '请输入负责人邮箱'
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
    label: '状态',
    name: 'status',
    rules: SELECT_REQUIRED,
    component: 'Select',
    componentProps: {
      options: USER_STATUS
    }
  }
  ]
}
