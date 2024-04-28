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
      <template v-slot:visible="{record}">
        <span v-if="record?.visible !== '1'">
          <a-tag color="success">显示</a-tag>
        </span>
        <span v-else>
          <a-tag color="error">隐藏</a-tag>
        </span>
      </template>
      <template v-slot:operate="{ record }">
        <UpdateBtn type="primary" size="small" :loading="isCreateLoading" v-if="checkPermission(pagePermission.update)" @click="onUpdate(record)" >编辑</UpdateBtn>
        <UpdateBtn type="primary" size="small" class="ml-2px" :loading="isPermissionLoading" v-if="checkPermission(pagePermission.update)" @click="onCreate(record)">子菜单</UpdateBtn>
        <DeleteBtn type="primary" danger class="ml-2px" size="small" v-if="checkPermission(pagePermission.delete)" :message="'确定要删除菜单:' + record?.title + '?'" @click="handleDelete(record)">删除</DeleteBtn>
      </template>
    </BasicTable>
  </BasicContent>
  <BasicModal
    v-model:isOpen="creates.isOpen"
    :isLoading="isCreateLoading"
    :title="creates.title"
    @handleFinish="createSubmit"
    @handleCancel="onCloseCreate"
    width="30%"
  >
    <BasicForm
      ref="createFormRef"
      :list="createList(menuList, apiList, targetKey, menuType, findOption, onChange, handleSetMeu)"
      :labelCol="{ span: 6 }"
      :data="creates.data"
      @handleFinish="handleCreate"
    />
  </BasicModal>
</template>

<script setup lang="ts">
import type {FormData} from '#/form';
import {onActivated, onMounted, reactive, ref, shallowRef} from "vue";
import {checkPermission} from "@/utils/permissions";
import {createList, pagePermission, RowData, searchList, tableColumns} from "@/pages/admin/sysMenu/model";
import BasicTable from "@/components/Table/BasicTable.vue";
import BasicContent from "@/components/Content/BasicContent.vue";
import BasicSearch from "@/components/Search/BasicSearch.vue";
import {CreateBtn, DeleteBtn, UpdateBtn} from "@/components/Buttons";
import {BasicFormProps} from "@/components/Form/model";
import {CreateData, PaginationData, TableData} from "#/public";
import {ADD_TITLE, EDIT_TITLE} from "@/utils/config";
import {createMenu, deleteMenu, getMenuById, getMenuList, getMenuPage, updateMenu} from "@/servers/admin/menu";
import {message, TransferProps} from "ant-design-vue";
import BasicModal from "@/components/Modal/BasicModal.vue";
import BasicForm from "@/components/Form/BasicForm.vue";
import {IConstant} from "@/utils/constants";
import {getApisList} from "@/servers/admin/apis";
import {RadioChangeEvent} from "ant-design-vue/es/radio/interface";
import {TransferItem} from "ant-design-vue/es/transfer";

// 搜索数据
const searchData = ref<FormData>({});
const isLoading = ref(false);
const isCreateLoading = ref(false);
const isPermissionLoading = ref(false);
const menuList = ref<IConstant[]>([]);
const apiList = ref<TransferItem[]>([]);
const targetKey = ref<string[]>([]);
const menuType = ref('');

const createFormRef = shallowRef<BasicFormProps>();
// 表格数据
const tableData = ref<TableData[]>([]);

// 分页数据
const pagination = reactive<PaginationData>({
  total: 0,
  pageIndex: 1,
  pageSize: 20,
});

defineOptions({
  name: 'AdminSysMenu'
});

onActivated(() => {
  getPage();
});

onMounted(() => {
  handleGetMenus();
  handleGetApis();
});

// 初始化新增数据
const initCreate = {
  parentId: '',
  menuType: '',
};

// 新增数据
const creates = reactive<CreateData>({
  id: '',
  isOpen: false,
  title: ADD_TITLE,
  data: initCreate
});

// 搜索提交
const handleSearch = (values: FormData) => {
  searchData.value = values;
  pagination.pageIndex = 1;
  getPage();
};

/** 获取表格数据 */
const getPage = async () => {
  const newPagination = { ...pagination };
  delete newPagination.total;
  const query = { ...newPagination, ...searchData.value };
  try {
    isLoading.value = true;
    const { data } = await getMenuPage(query);
    tableData.value = data;
    // pagination.pageIndex = pageIndex;
    // pagination.pageSize = pageSize;
    pagination.total = data.length;
  } finally {
    isLoading.value = false;
  }
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

/** 关闭新增/编辑 */
const onCloseCreate = () => {
  creates.isOpen = false;
};

/** 点击新增 */
const onCreate = (record?: RowData) => {
  creates.isOpen = !creates.isOpen;
  creates.title = ADD_TITLE;
  creates.id = '';
  creates.data = initCreate;
  if (record?.id !== '') {
    initCreate.parentId = record?.id as string;
    initCreate.menuType = record?.menuType as string;
    menuType.value = record?.menuType as string;
  }
};

// 点击编辑
const onUpdate = async (record: RowData) => {
  creates.isOpen = !creates.isOpen;
  creates.id = record.id as string;
  creates.title = EDIT_TITLE('修改菜单', record.id as string);
  creates.type = 'update';
  try {
    isCreateLoading.value = true;
    const {code, data} = await getMenuById(record.id as string);
    if (code === 200) {
      creates.data = data;
      // @ts-ignore
      if (data?.apis.length > 0) {
        // @ts-ignore
        targetKey.value = data.apis.map((item: number) => item.toString());
      }
    }
  } finally {
    menuType.value = record.menuType;
    isCreateLoading.value = false;
  }
};

// 删除任务
const handleDelete = async (record: FormData) => {
  try {
    isLoading.value = true;
    const {code} = await deleteMenu(record.id as number);
    if (code === 200) {
      message.success('删除成功');
    }
  } finally {
    getPage().then();
    isLoading.value = false;
  }
};

/** 表格提交 */
const createSubmit = () => {
  createFormRef.value?.handleSubmit();
};

// 新增/编辑提交
const handleCreate = async (values: FormData) => {
  try {
    isCreateLoading.value = true;
    values.apis = (targetKey.value.map((item: string) => Number(item)));
    const functions = () => creates.id ? updateMenu(creates.id, values) : createMenu(values);
    const {code} = await functions();
    if (code === 200) {
      creates.id = '';
      creates.isOpen = false;
      creates.data = {...initCreate};
      createFormRef.value?.handleReset();
      message.success('操作成功');
    }
  } finally {
    getPage().then();
    isCreateLoading.value = false;
  }
};

// 获取菜单树全量数据
const handleGetMenus = async () => {
  const {data, code} = await getMenuList();
  if (code === 200) {
    data.unshift({ label: "主类目", value: 0, children: []});
    // @ts-ignore
    menuList.value = data;
  }
};

// 获取接口列表
const handleGetApis = async () => {
  const {data, code} = await getApisList();
  if (code === 200) {
    // @ts-ignore
    apiList.value = data;
  }
};

const findOption = (inputValue: string, option: IConstant) => option.label?.indexOf(inputValue) > -1;

const onChange:TransferProps['onChange'] = (keys) => {
  // console.log("onChange=>", keys)
  targetKey.value = keys;
};

const handleSetMeu = (e: RadioChangeEvent) => {
  menuType.value = e.target.value;
};
</script>
