import type { FormList } from "#/form";
import type { TableColumnsProps } from "#/public";
import {FORM_REQUIRED} from "@/utils/config";
import {IConstant, USER_STATUS} from "@/utils/constants";
import {dateFormat, valueToLabel} from "@/utils/helper";

// 权限前缀
const deptPrefix = 'admin:sysDept';

// 权限
export const pagePermission = {
  list: `${deptPrefix}:list`,
  create: `${deptPrefix}:add`,
  update: `${deptPrefix}:update`,
  delete: `${deptPrefix}:delete`,
};

// 搜索数据
export const searchList: FormList[] = [
  // {
  //   label: '部门名称',
  //   name: 'deptName',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: '请输入部门名称',
  //   }
  // },
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
export const tableColumns = (): TableColumnsProps[] => [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
    fixed: 'left'
  },
  {
    title: '部门名称',
    dataIndex: 'deptName',
    width: 200,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 100,
  },
  {
    title: '部门负责人',
    dataIndex: 'leader',
    width: 120,
  },
  {
    title: '负责人电话',
    dataIndex: 'phone',
    width: 120,
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
export const createList = (deptList: IConstant[]): FormList[] => [
  {
    label: '上级部门',
    name: 'parentId',
    rules: FORM_REQUIRED,
    component: 'TreeSelect',
    componentProps: {
      treeData: deptList,
      placeholder:' 请选择父级菜单',
    }
  },
  {
    label: '部门名称',
    name: 'deptName',
    rules: FORM_REQUIRED,
    component: 'Input',
    componentProps: {
      placeholder: '请输入部门名称',
    }
  },
  {
    label: '负责人',
    name: 'leader',
    rules: FORM_REQUIRED,
    component: 'Input',
    componentProps: {
      placeholder: '请输入负责人',
    }
  },
  {
    label: '联系电话',
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
    label: '显示排序',
    name: 'sort',
    rules: FORM_REQUIRED,
    component: 'InputNumber',
    componentProps: {
      min: 0,
      style: 'width: 100%',
    }
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

export interface IRowData {
  id: string;
  menuType: string;
}
