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
      :key="'key'+keyNum"
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
        <a-button type="primary" size="small" :loading="isCreateLoading" v-if="checkPermission(pagePermission.create)" @click="onCreate(record)">子部门</a-button>
        <UpdateBtn type="primary" size="small" class="ml-2px" :loading="isCreateLoading" v-if="checkPermission(pagePermission.update)" @click="onUpdate(record)" >编辑</UpdateBtn>
        <DeleteBtn type="primary" danger class="ml-2px" size="small" v-if="checkPermission(pagePermission.delete)" :message="'确定要删除当前部门:' + record?.deptName + '?'" @click="handleDelete(record)">删除</DeleteBtn>
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
      :list="createList(deptList)"
      :labelCol="{ span: 6 }"
      :data="creates.data"
      @handleFinish="handleCreate"
    />
  </BasicModal>
</template>

<script setup lang="ts">
import type { FormData } from '#/form';
import BasicContent from "@/components/Content/BasicContent.vue";
import {createList, IRowData, pagePermission, searchList, tableColumns} from "@/pages/admin/sysDept/model";
import {checkPermission} from "@/utils/permissions";
import BasicSearch from "@/components/Search/BasicSearch.vue";
import {CreateBtn, DeleteBtn, UpdateBtn} from "@/components/Buttons";
import {ref, shallowRef, reactive, onActivated, onMounted} from "vue";
import {BasicFormProps} from "@/components/Form/model";
import {CreateData, PaginationData, TableData} from "#/public";
import {ADD_TITLE, EDIT_TITLE} from "@/utils/config";
import {createDept, deleteDept, getAllDept, getDeptId, getDeptPage, updateDept} from "@/servers/admin/dept";
import BasicTable from "@/components/Table/BasicTable.vue";
import BasicModal from "@/components/Modal/BasicModal.vue";
import BasicForm from "@/components/Form/BasicForm.vue";
import {IConstant} from "@/utils/constants";
import {message} from "ant-design-vue";
import {message as messageAPi} from "ant-design-vue/es/components";

// 搜索数据
const searchData = ref<FormData>({});
const isLoading = ref(false);
const keyNum = ref(0);
const isCreateLoading = ref(false);
const deptList = ref<IConstant[]>([]);
const createFormRef = shallowRef<BasicFormProps>();
// 表格数据
const tableData = ref<TableData[]>([]);
// 分页数据
const pagination = reactive<PaginationData>({
  total: 0,
  pageIndex: 1,
  pageSize: 20,
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

onActivated(() => {
  getPage();
});

onMounted(() => {
  handleGetAllDept();
});

defineOptions({
  name: 'AdminSysDept'
});

/** 点击新增 */
const onCreate = (record: IRowData) => {
  creates.isOpen = !creates.isOpen;
  creates.title = ADD_TITLE;
  creates.id = '';
  if (record.id !== '') {
    initCreate.menuType = record.menuType;
    initCreate.parentId = record.id;
  }
  creates.data = initCreate;
};

// 新增/编辑提交
const handleCreate = async (values: FormData) => {
  try {
    isCreateLoading.value = true;
    const functions = () => creates.id ? updateDept(creates.id, values) : createDept(values);
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

/** 关闭新增/编辑 */
const onCloseCreate = () => {
  creates.isOpen = false;
  createFormRef.value?.handleReset();
};

/** 获取表格数据 */
const getPage = async () => {
  const newPagination = { ...pagination };
  delete newPagination.total;
  const query = { ...newPagination, ...searchData.value };
  try {
    isLoading.value = true;
    const { data } = await getDeptPage(query);
    tableData.value = data;
    // pagination.pageIndex = pageIndex;
    // pagination.pageSize = pageSize;
    pagination.total = data.length;
  } finally {
    keyNum.value++;
    isLoading.value = false;
  }
};

/** 表格提交 */
const createSubmit = () => {
  createFormRef.value?.handleSubmit();
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
const onUpdate = async (record: FormData) => {
  creates.isOpen = !creates.isOpen;
  creates.id = record.id as string;
  creates.title = EDIT_TITLE('修改用户', record.name as string);
  creates.type = 'update';
  try {
    isCreateLoading.value = true;
    const {code, data} = await getDeptId(record.id as string);
    if (code === 200) {
      creates.data = data;
    }
  } finally {
    isCreateLoading.value = false;
  }
};

// 删除任务
const handleDelete = async (record: FormData) => {
  try {
    isLoading.value = true;
    const {code} = await deleteDept(record.id as number);
    if (code === 200) {
      message.success('删除成功');
    }
  } finally {
    getPage().then();
    isLoading.value = false;
  }
};

// 部门列表
const handleGetAllDept = async () => {
  const {data, code} = await getAllDept();
  const _res: IConstant[] = [];
  if (code === 200) {
    for (let i = 0;i < data.length;i++) {
      const item: IConstant = { label: data[i].deptName as string, value: data[i].id as unknown as number};
      _res.push(item);
    }
    _res.unshift({ label: '主目录', value: 0});
  }
  deptList.value = _res;
};

</script>
