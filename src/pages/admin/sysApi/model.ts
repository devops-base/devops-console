import type { FormList } from "#/form";
import type { TableColumnsProps } from "#/public";
import {FORM_REQUIRED} from "@/utils/config";
import {API_ACTION_TYPES, API_TYPES} from "@/utils/constants";
import {dateFormat} from "@/utils/helper";

// 权限前缀
const apiPrefix = 'admin:sysApi';

// 权限
export const pagePermission = {
  list: `${apiPrefix}:list`,
  create: `${apiPrefix}:add`,
  update: `${apiPrefix}:update`,
  delete: `${apiPrefix}:delete`,
};

// 搜索数据
export const searchList: FormList[] = [
  {
    label: '标题',
    name: 'title',
    component: 'Input',
    componentProps: {
      placeholder: '请输入标题'
    },
  },
  {
    label: '地址',
    name: 'path',
    component: 'Input',
    componentProps: {
      placeholder: '请输入地址'
    },
  },
  {
    label: '类型',
    name: 'action',
    component: 'Select',
    componentProps: {
      options: API_ACTION_TYPES,
      style: "width: 100px",
    },
  }
];

// 表格数据
export const tableColumns = (): TableColumnsProps[] => [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
    fixed: 'left'
  },
  {
    title: '标题',
    dataIndex: 'title',
    width: 200,
    fixed: 'left'
  },
  {
    title: 'Request Info',
    dataIndex: 'action',
    width: 200
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 200,
    customRender: ({text}) => {
      return dateFormat(text);
    }
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 160,
    ellipsis: false,
  },
];

// 新增数据
export const createList = (): FormList[] => [
  {
    label: 'Handle',
    name: 'handle',
    rules: FORM_REQUIRED,
    component: 'Input',
    placeholder: '请输入方法名'
  },
  {
    label: '标题',
    name: 'title',
    rules: FORM_REQUIRED,
    component: 'Input',
    placeholder: '请输入方法标题'
  },
  {
    label: '类型',
    name: 'type',
    component: 'Select',
    rules: FORM_REQUIRED,
    placeholder: '请选择类型',
    componentProps: {
      options: API_TYPES,
    }
  },
  {
    label: 'Method',
    name: 'action',
    rules: FORM_REQUIRED,
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
];

export function ApiActionHelper(value: string): string {
  // eslint-disable-next-line default-case
  switch (value) {
    case 'GET':
      return 'green';
    case 'PUT':
      return 'orange';
    case 'DELETE':
      return 'red';
    case 'POST':
      return 'cyan';
  }
  return '';
}
