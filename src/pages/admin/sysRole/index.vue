
<template>
  <BasicContent :isPermission="checkPermission(pagePermission.list)">
    <template #top>
      <BasicSearch
        :list="searchList"
        :data="searchData"
        :isLoading="isLoading"
        @handleFinish="handleSearch"
        :is-clear="false"
      />
    </template>
    <BtnRow>
      <CreateBtn
        v-if="checkPermission(pagePermission.create)"
        @click="onCreate"
      />
    </BtnRow>
    <BasicTable
      :data="tableData"
      :columns="tableColumns()"
      :isLoading="isLoading"
      :pagination="{
        current: pagination.pageIndex,
        pageSize: pagination.pageSize,
        total: pagination.total,
        onChange: handlePagination,
      }"
    >
      <template v-slot:operate="{ record }">
        <UpdateBtn type="primary" size="small" :loading="isCreateLoading" v-if="checkPermission(pagePermission.update)" @click="onUpdate(record)" >编辑</UpdateBtn>
        <span v-if="record?.roleKey !== 'admin'">
          <UpdateBtn type="primary" size="small" class="ml-2px" :loading="isPermissionLoading" v-if="checkPermission(pagePermission.update)" @click="onPermission(record)" >数据权限</UpdateBtn>
        </span>
        <DeleteBtn type="primary" danger class="ml-2px" size="small" v-if="checkPermission(pagePermission.delete)" :message="'确定要删除角色:' + record?.roleName + '?'" @click="handleDelete(record)">删除</DeleteBtn>
      </template>
    </BasicTable>
  </BasicContent>
  <BasicModal
    v-model:isOpen="creates.isOpen"
    :isLoading="isCreateLoading"
    :title="creates.title"
    @handleFinish="createSubmit"
    @handleCancel="onCloseCreate"
  >
    <BasicForm
      ref="createFormRef"
      :list="createList(menusList,menuKey, handleMenuCheck)"
      :labelCol="{ span: 6 }"
      :data="creates.data"
      @handleFinish="handleCreate"
    />
  </BasicModal>
  <!-- 数据权限 -->
  <BasicModal
    v-model:isOpen="permission.isOpen"
    :isLoading="isPermissionLoading"
    :title="permission.title"
    @handleFinish="permissionSubmit"
    @handleCancel="onCloseCreate"
  >
    <BasicForm
      ref="permissionRef"
      :list="permissionList(deptList, deptKey, isPermissionHidden, handleDeptCheck, handleRoleCheck)"
      :labelCol="{ span: 6 }"
      :data="permission.data"
      @handleFinish="handlePermissionPut"
    />
  </BasicModal>
</template>

<script setup lang="ts">
import type { FormData } from '#/form';
import {checkPermission} from "@/utils/permissions";
import {
  createList,
  pagePermission,
  permissionList,
  RowDate,
  searchList,
  tableColumns
} from "@/pages/admin/sysRole/model";
import BasicContent from "@/components/Content/BasicContent.vue";
import BasicModal from "@/components/Modal/BasicModal.vue";
import BasicSearch from "@/components/Search/BasicSearch.vue";
import {CreateBtn, DeleteBtn, UpdateBtn} from "@/components/Buttons";
import BasicTable from "@/components/Table/BasicTable.vue";
import BasicForm from "@/components/Form/BasicForm.vue";
import {ref, shallowRef, reactive, onActivated, onMounted} from "vue";
import {BasicFormProps} from "@/components/Form/model";
import {CreateData, PaginationData, TableData} from "#/public";
import {ADD_TITLE, EDIT_TITLE} from "@/utils/config";
import {message as messageAPi} from "ant-design-vue/es/components";
import {createRole, deleteRole, getRoleById, getRolePage, updateRole, updateRoleDataScope} from "@/servers/admin/role";
import {TreeProps} from "ant-design-vue/es/tree/Tree";
import {DataNode} from "ant-design-vue/es/vc-tree/interface";
import {getMenuList} from "@/servers/admin/menu";
import {getDeptTreeData} from "@/servers/admin/dept";

// 搜索数据
const searchData = ref<FormData>({});
const isLoading = ref(false);
const isCreateLoading = ref(false);
const isPermissionLoading = ref(false);
const createFormRef = shallowRef<BasicFormProps>();
const permissionRef = shallowRef<BasicFormProps>();
const menusList = ref<DataNode[]>();
const deptList = ref<DataNode[]>();
const isPermissionHidden = ref(true);
// 表格数据
const tableData = ref<TableData[]>([]);
// 权限树
const menuKey = ref<string[]>([]);
const deptKey = ref<string[]>([]);

// 分页数据
const pagination = reactive<PaginationData>({
  total: 0,
  pageIndex: 1,
  pageSize: 20,
});
// 初始化新增数据
const initCreate = {
};

// 新增数据
const creates = reactive<CreateData>({
  id: '',
  isOpen: false,
  title: ADD_TITLE,
  data: initCreate
});

const permission = reactive<CreateData>({
  id: '',
  isOpen: false,
  title: ADD_TITLE,
  data: initCreate
});

onActivated(() => {
  getPage();
});

onMounted(() => {
  handleGetAllDept();
  handleGetMenus();
});

defineOptions({
  name: 'AdminSysRole'
});

/** 点击新增 */
const onCreate = () => {
  creates.isOpen = !creates.isOpen;
  creates.title = ADD_TITLE;
  creates.id = '';
  creates.data = initCreate;
};

// 新增/编辑提交
const handleCreate = async (values: FormData) => {
  try {
    isCreateLoading.value = true;
    values.menuIds = menuKey.value;
    const functions = () => creates.id ? updateRole(creates.id, values) : createRole(values);
    const {code, message} = await functions();
    if (code === 200) {
      creates.id = '';
      creates.isOpen = false;
      creates.data = {...initCreate};
      createFormRef.value?.handleReset();
      messageAPi.success(message || '操作成功');
    }
  } finally {
    getPage().then();
    isCreateLoading.value = false;
  }
};

// 权限提交
const handlePermissionPut = async (values: FormData) => {
  try {
    isPermissionLoading.value = true;
    values.deptIds = deptKey.value;
    values.id = permission.id;
    const functions = () => permission.id ? updateRoleDataScope(values) : createRole(values);
    const {code, message} = await functions();
    if (code === 200) {
      permission.id = '';
      permission.isOpen = false;
      permission.data = {...initCreate};
      permissionRef.value?.handleReset();
      messageAPi.success(message || '操作成功');
    }
  } finally {
    getPage().then();
    isPermissionLoading.value = false;
  }
};

/** 关闭新增/编辑 */
const onCloseCreate = () => {
  creates.isOpen = false;
  menuKey.value = [];
  permission.isOpen = false;
  deptKey.value = [];
};

/** 获取表格数据 */
const getPage = async () => {
  const newPagination = { ...pagination };
  delete newPagination.total;
  const query = { ...newPagination, ...searchData.value };
  try {
    isLoading.value = true;
    const { data: {count, list, pageIndex, pageSize} } = await getRolePage(query);
    tableData.value = list;
    pagination.pageIndex = pageIndex;
    pagination.pageSize = pageSize;
    pagination.total = count;
  } finally {
    isLoading.value = false;
  }
};

/** 表格提交 */
const createSubmit = () => {
  createFormRef.value?.handleSubmit();
};

// 权限提交
const permissionSubmit = () => {
  permissionRef.value?.handleSubmit();
};

/**
 * 分页
 * @param page - 当前页
 * @param pageSize - 分页总数
 */
const handlePagination = (page: number, pageSize: number) => {
  pagination.pageIndex = page;
  pagination.pageSize = pageSize;
  getPage();
};

// 搜索提交
const handleSearch = (values: FormData) => {
  searchData.value = values;
  pagination.pageIndex = 1;
  getPage();
};

// 点击编辑
const onUpdate = async (record: RowDate) => {
  creates.isOpen = !creates.isOpen;
  creates.id = record.id as string;
  creates.title = EDIT_TITLE('修改角色', record.id as string);
  creates.type = 'update';
  try {
    isCreateLoading.value = true;
    const {code, data} = await getRoleById(record.id as string);
    if (code === 200) {
      creates.data = data;
      menuKey.value = data?.menuIds as string[];
    }
  } finally {
    isCreateLoading.value = false;
  }
};

// 权限编辑
const onPermission = async (record: RowDate) => {
  permission.isOpen = !permission.isOpen;
  permission.id = record.id as string;
  permission.title = EDIT_TITLE('修改权限', record.id as string);
  permission.type = 'update';
  try {
    isPermissionLoading.value = true;
    const {code, data} = await getRoleById(record.id as string);
    if (code === 200) {
      permission.data = data;
      deptKey.value = data?.deptIds as string[];
      handleRoleCheck(data?.dataScope as string);
    }
  } finally {
    isPermissionLoading.value = false;
  }
};

// 删除任务
const handleDelete = async (record: FormData) => {
  try {
    isLoading.value = true;
    const {code} = await deleteRole(record.id as number);
    if (code === 200) {
      messageAPi.success('删除成功');
    }
  } finally {
    getPage().then();
    isLoading.value = false;
  }
};

// 获取菜单树全量数据
const handleGetMenus = async () => {
  const {data, code} = await getMenuList();
  if (code === 200) {
    // @ts-ignore
    menusList.value = data;
  }
};

// 获取部门树全量数据
const handleGetAllDept = async () => {
  const {data, code} = await getDeptTreeData();
  if (code === 200) {
    // @ts-ignore
    deptList.value = data;
  }
};

// 角色菜单树选择事件
const handleMenuCheck: TreeProps['onCheck'] = (selectedKeys) => {
  // @ts-ignore
  menuKey.value = selectedKeys;
};

// 部门树选择事件
const handleDeptCheck: TreeProps['onCheck'] = (selectedKeys) => {
  // @ts-ignore
  deptKey.value = selectedKeys;
};

// 数据选择
const handleRoleCheck = (selectedKeys: string) => {
  isPermissionHidden.value = selectedKeys !== '2';
};

</script>

<style scoped lang="less">

</style>
