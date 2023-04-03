import {IFormList} from "#/form"
import {ITableColumn, ITableOptions} from "#/public"
import {dateFormat} from "@/components/DateFormat"
import {INPUT_REQUIRED, SELECT_REQUIRED} from "@/utils/config"
import {API_ACTION_TYPES, API_TYPES} from '@/utils/constants'
import {ApiActionHelper, ApiTypeHelper} from "@/utils/helper"
import {Tag} from "antd"

// 搜索数据
export const searchList: IFormList[] = [
  {
    label: '标题',
    name: 'title',
    component: 'Input',
    placeholder: '请输入标题'
  },
  {
    label: '地址',
    name: 'path',
    component: 'Input',
    placeholder: '请输入地址'
  },
  {
    label: '类型',
    name: 'action',
    component: 'Select',
    placeholder: '请选择类型',
    componentProps: {
      style: {width: 150},
      options: API_ACTION_TYPES
    }
  },
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
      title: '标题',
      dataIndex: 'type',
      width: 50,
      render: (value: string, record, index) => {
        return <Tag color={ApiTypeHelper(value)}>[{value}]{(record as {title: string}).title}</Tag>
      }
    },
    {
      title: 'Request Info',
      dataIndex: 'action',
      width: 200,
      render: (value: string,record) => {
        return <div>
            <Tag color={ApiActionHelper(value)}>{value}</Tag>
            <span>{(record as {path: string}).path}</span>
         </div>
      }
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

export const createList: () => IFormList[] = () => {
  return [
    {
      label: 'Handle',
      name: 'handle',
      rules: INPUT_REQUIRED,
      component: 'Input',
      placeholder: '请输入方法名'
    },
    {
      label: '标题',
      name: 'title',
      rules: INPUT_REQUIRED,
      component: 'Input',
      placeholder: '请输入方法标题'
    },
    {
      label: '类型',
      name: 'type',
      component: 'Select',
      rules: SELECT_REQUIRED,
      placeholder: '请选择类型',
      componentProps: {
        options: API_TYPES,
      }
    },
    {
      label: 'Method',
      name: 'action',
      rules: SELECT_REQUIRED,
      component: 'Select',
      componentProps: {
        options: API_ACTION_TYPES,
      }
    },
    {
      label: '地址',
      name: 'path',
      component: 'Input',
      componentProps: {
        disabled: true
      }
    }
  ]
}
