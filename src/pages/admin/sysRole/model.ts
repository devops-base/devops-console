import type { FormList } from "#/form";
import type { TableColumnsProps } from "#/public";
import {FORM_REQUIRED} from "@/utils/config";
import {DataScopeOptions, USER_STATUS} from "@/utils/constants";
import {dateFormat, valueToLabel} from "@/utils/helper";
import {TreeProps} from "ant-design-vue/es/tree/Tree";
import {DataNode} from "ant-design-vue/es/vc-tree/interface";
import {DefaultOptionType, SelectValue} from "ant-design-vue/es/select";

// 权限前缀
const rolePrefix = 'admin:sysRole';

// 权限
export const pagePermission = {
  list: `${rolePrefix}:list`,
  create: `${rolePrefix}:add`,
  update: `${rolePrefix}:update`,
  delete: `${rolePrefix}:delete`,
};

// 搜索数据
export const searchList: FormList[] = [
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
    title: '备注',
    dataIndex: 'remark',
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 200,
    fixed: 'right',
  },
];

// 新增数据
export const createList = (menuList: DataNode[] | undefined, menuKey: string[], handMenuCheck: TreeProps['onCheck']): FormList[] => [
  {
    label: '角色名称',
    name: 'roleName',
    rules: FORM_REQUIRED,
    placeholder: '请输入角色名称',
    component: 'Input'
  },
  {
    label: '权限字符',
    name: 'roleKey',
    placeholder: '请输入权限字符',
    rules: FORM_REQUIRED,
    component: 'Input'
  },
  {
    label: '角色顺序',
    name: 'roleSort',
    component: 'InputNumber',
    rules: FORM_REQUIRED,
    componentProps: {
      style: {width: '100%'},
      min: 0,
    }
  },
  {
    label: '状态',
    name: 'status',
    rules: FORM_REQUIRED,
    component: 'RadioGroup',
    componentProps: {
      options: USER_STATUS,
    }
  },
  {
    label: '菜单权限',
    name: 'sysMenu',
    component: 'Tree',
    componentProps: {
      treeData: menuList,
      checkable: true,
      fieldNames: {title: 'label', key: 'value'},
      checkedKeys: menuKey,
      selectedKeys: menuKey,
      onCheck: handMenuCheck,
    },
  },
  {
    label: '备注',
    name: 'remark',
    component: 'Textarea',
    componentProps: {
      placeholder: '备注'
    }
  },
];

// 权限数据
// eslint-disable-next-line max-params
export const permissionList = (deptList: DataNode[] | undefined, deptKey: string[], isPermissionHidden: boolean, handDeptCheck: TreeProps['onCheck'], handleRoleCheck: (value: SelectValue, option: DefaultOptionType | DefaultOptionType[]) => void): FormList[] => [
  {
    label: '角色名称',
    name: 'roleName',
    rules: FORM_REQUIRED,
    placeholder: '请输入角色名称',
    component: 'Input',
    componentProps: {
      disabled: true
    }
  },
  {
    label: '权限字符',
    name: 'roleKey',
    placeholder: '请输入权限字符',
    rules: FORM_REQUIRED,
    component: 'Input',
    componentProps: {
      disabled: true
    }
  },
  {
    label: '权限范围',
    name: 'dataScope',
    component: 'Select',
    componentProps: {
      options: DataScopeOptions,
      onSelect: handleRoleCheck,
    }
  },
  {
    label: '数据权限',
    name: 'deptIds',
    component: 'Tree',
    hidden: isPermissionHidden,
    componentProps: {
      treeData: deptList,
      checkable: true,
      fieldNames: {title: 'label', key: 'id'},
      checkedKeys: deptKey,
      selectedKeys: deptKey,
      onCheck: handDeptCheck,
    },
  },
];

export interface RowDate {
  id: string;
  roleKey: string;
  roleName: string;
}
