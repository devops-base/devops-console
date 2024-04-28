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
      <template v-slot:action="{ record }">
        <span>
          <a-tag :color="ApiActionHelper(record?.action)" >{{record?.action }}</a-tag>
          <span>{{ record?.path }}</span>
        </span>
      </template>
      <template v-slot:operate="{ record }">
        <UpdateBtn type="primary" size="small" :loading="isCreateLoading" v-if="checkPermission(pagePermission.update)" @click="onUpdate(record)" >编辑</UpdateBtn>
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
      :list="createList()"
      :labelCol="{ span: 6 }"
      :data="creates.data"
      @handleFinish="handleCreate"
    />
  </BasicModal>
</template>

<script setup lang="ts">
import type { FormData } from '#/form';
import BasicContent from "@/components/Content/BasicContent.vue";
import {ApiActionHelper, createList, pagePermission, searchList, tableColumns} from "@/pages/admin/sysApi/model";
import {checkPermission} from "@/utils/permissions";
import BasicSearch from "@/components/Search/BasicSearch.vue";
import {UpdateBtn} from "@/components/Buttons";
import {ref, shallowRef, reactive, onActivated} from "vue";
import {BasicFormProps} from "@/components/Form/model";
import {CreateData, PaginationData, TableData} from "#/public";
import {ADD_TITLE, EDIT_TITLE} from "@/utils/config";
import BasicTable from "@/components/Table/BasicTable.vue";
import BasicModal from "@/components/Modal/BasicModal.vue";
import BasicForm from "@/components/Form/BasicForm.vue";
import {message as messageAPi} from "ant-design-vue/es/components";
import {getApiById, getApiPage, updateApi} from "@/servers/admin/apis";

// 搜索数据
const searchData = ref<FormData>({});
const isLoading = ref(false);
const isCreateLoading = ref(false);
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

defineOptions({
  name: 'AdminSysApi'
});

// 新增/编辑提交
const handleCreate = async (values: FormData) => {
  try {
    isCreateLoading.value = true;
    const functions = () => creates.id ? updateApi(creates.id, values) : updateApi(creates.id, values);
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
};

/** 获取表格数据 */
const getPage = async () => {
  const newPagination = { ...pagination };
  delete newPagination.total;
  const query = { ...newPagination, ...searchData.value };
  try {
    isLoading.value = true;
    const { data: {count, list, pageIndex, pageSize} } = await getApiPage(query);
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
  creates.title = EDIT_TITLE('修改接口', record.name as string);
  creates.type = 'update';
  try {
    isCreateLoading.value = true;
    const {code, data} = await getApiById(record.id as string);
    if (code === 200) {
      creates.data = data;
    }
  } finally {
    isCreateLoading.value = false;
  }
};

</script>
