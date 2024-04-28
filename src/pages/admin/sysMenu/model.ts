import type { FormList } from "#/form";
import type { TableColumnsProps } from "#/public";
import { FORM_REQUIRED } from "@/utils/config";
import {IConstant, MENU_ACTIONS, MENU_STATUS, MENU_TYPE, MENUS_FRAME} from "@/utils/constants";
import {dateFormat} from "@/utils/helper";
import {TransferItem} from "ant-design-vue/es/transfer";
import {TransferProps} from "ant-design-vue";
import {RadioChangeEvent} from "ant-design-vue/es/radio/interface";

// 当前行数据
export interface RowData {
  id: string;
  menuType: string;
  apis: number[];
}

// 权限前缀
const menuPrefix = 'admin:sysMenu';

// 权限
export const pagePermission = {
  list: `${menuPrefix}:list`,
  create: `${menuPrefix}:add`,
  update: `${menuPrefix}:edit`,
  delete: `${menuPrefix}:delete`,
};

// 搜索数据
export const searchList: FormList[] = [
  {
    label: '菜单名称',
    name: 'title',
    component: 'Input',
    componentProps: {
      placeholder: '请输入菜单名称',
    }
  },
  {
    label: '状态',
    name: 'visible',
    component: 'Select',
    componentProps: {
      options: MENU_STATUS,
      style: {
        width: '150px',
      }
    }
  }
];

// 表格数据
export const tableColumns = (): TableColumnsProps[] => [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100
  },
  {
    title: '菜单名称',
    dataIndex: 'title',
    width: 150
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 80
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
    customRender: ({text}) => {
      return dateFormat(text);
    }
  },
  {
    title: '可见',
    dataIndex: 'visible',
    width: 100,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 320,
    fixed: 'right',
    ellipsis: false,
  }
];

// 新增数据
// eslint-disable-next-line max-params
export const createList = (menuList: IConstant[], apiList: TransferItem[], targetKey: string[], menuType: string, filterOptions: (inputValue: string, option: TransferItem) => boolean, onChange: TransferProps['onChange'], handleSetMeu: (e: RadioChangeEvent) => void): FormList[] => [
  {
    label: '上级菜单',
    name: 'parentId',
    rules: FORM_REQUIRED,
    component: 'TreeSelect',
    componentProps: {
      placeholder: '请选择上级菜单',
      treeData: menuList,
    }
  },
  {
    label: '菜单标题',
    name: 'title',
    rules: FORM_REQUIRED,
    component: 'Input',
    componentProps: {
      placeholder: '请输入菜单名称'
    }
  },
  {
    label: '显示排序',
    name: 'sort',
    rules: FORM_REQUIRED,
    component: 'InputNumber',
    componentProps: {
      style: {width: '100%'},
      min: 0,
    }
  },
  {
    label: '菜单类型',
    name: 'menuType',
    rules: FORM_REQUIRED,
    component: 'RadioGroup',
    componentProps: {
      options: MENU_ACTIONS,
      onChange: handleSetMeu,
    }
  },
  {
    label: '菜单图标',
    name: 'icon',
    rules: FORM_REQUIRED,
    component: 'Input',
    componentProps: {
      placeholder: '请输入antv icon代码'
    }
  },
  {
    label: '路由名称',
    name: 'menuName',
    rules: FORM_REQUIRED,
    hidden: menuType === MENU_TYPE.BUTTON,
    component: 'Input',
    componentProps: {
      placeholder: '需要和页面name保持一致,对应页面即可选择缓存'
    }
  },
  {
    label: '组件路径',
    name: 'component',
    component: 'Input',
    hidden: menuType === MENU_TYPE.BUTTON,
    rules: FORM_REQUIRED,
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
    rules: FORM_REQUIRED,
    hidden: menuType === MENU_TYPE.BUTTON,
    componentProps: {
      placeholder: '访问此页面自定义的url地址,建议/开头书写,例如 /app-name/menu-name'
    }
  },
  {
    label: '权限标识',
    name: 'permission',
    component: 'Input',
    hidden: menuType === MENU_TYPE.DIR,
    rules: FORM_REQUIRED,
    componentProps: {
      placeholder: "前端权限控制按钮是否显示"
    }
  },
  {
    label: '菜单状态',
    name: 'visible',
    component: 'RadioGroup',
    hidden: menuType === MENU_TYPE.BUTTON,
    componentProps: {
      options: MENU_STATUS,
    },
  },
  {
    label: 'API权限',
    name: 'apis',
    component: 'Transfer',
    hidden: menuType === MENU_TYPE.DIR,
    componentProps: {
      dataSource: apiList,
      showSearch: true,
      filterOption: filterOptions,
      targetKeys: targetKey,
      onChange: onChange,
      rowKey: item => item.key as string,
      render: item => item.label as string,
    },
  }
];
