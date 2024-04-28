import type { FormList } from "#/form";
import type { TableColumnsProps } from "#/public";
import {FORM_REQUIRED} from "@/utils/config";
import {IConstant, USER_STATUS} from "@/utils/constants";
import {dateFormat, valueToLabel} from "@/utils/helper";

// 权限前缀
const permissionPrefix = 'admin:sysUser';

// 权限
export const pagePermission = {
  list: `${permissionPrefix}:list`,
  create: `${permissionPrefix}:add`,
  update: `${permissionPrefix}:update`,
  delete: `${permissionPrefix}:delete`,
};

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
      options: USER_STATUS,
      style: "width: 100px"
    },
  }
];

// 表格数据
export const tableColumns = (roleList: IConstant[], deptList: IConstant[]): TableColumnsProps[] => [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
    fixed: 'left'
  },
  {
    title: '昵称',
    dataIndex: 'nickName',
    width: 200,
    fixed: 'left'
  },
  {
    title: '用户名',
    dataIndex: 'username',
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
    customRender: ({text}) => {
      return valueToLabel(text, deptList);
    }
  },
  {
    title: '角色',
    dataIndex: 'roleId',
    width: 200,
    customRender: ({text}) => {
      return valueToLabel(text, roleList);
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({text}) => {
      return valueToLabel(text, USER_STATUS);
    }
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
export const createList = (roleList: IConstant[], deptList: IConstant[]): FormList[] => [
  {
    label: '用户名',
    name: 'username',
    rules: FORM_REQUIRED,
    component: 'Input',
  },
  {
    label: '昵称',
    name: 'nickName',
    rules: FORM_REQUIRED,
    component: 'Input',
  },
  {
    label: '部门',
    name: 'deptId',
    rules: FORM_REQUIRED,
    component: 'Select',
    componentProps: {
      options: deptList,
    }
  },
  {
    label: '角色',
    name: 'roleId',
    rules: FORM_REQUIRED,
    component: 'Select',
    componentProps: {
      options: roleList,
    }
  },
  {
    label: '手机号',
    name: 'phone',
    rules: FORM_REQUIRED,
    component: 'Input'
  },
  {
    label: '邮箱',
    name: 'email',
    rules: FORM_REQUIRED,
    component: 'Input'
  },
  {
    label: '状态',
    name: 'status',
    rules: FORM_REQUIRED,
    component: 'Select',
    componentProps: {
      options: USER_STATUS
    }
  }
];
