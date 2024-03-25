import type { IFormData } from '#/form'
import type { IPagePermission, ITableOptions } from '#/public'
import type { FormFn } from '@/components/Form/BasicForm'
import {Key, useCallback, useEffect, useRef, useState} from 'react'
import { createList, searchList, tableColumns } from './model'
import { message } from 'antd'
import { useTitle } from '@/hooks/useTitle'
import { ADD_TITLE, EDIT_TITLE } from '@/utils/config'
import { UpdateBtn, DeleteBtn } from '@/components/Buttons'
import {getRolePage, getRoleById, updateRole, createRole,deleteRole} from '@/servers/admin/role'
import BasicSearch from '@/components/Search/BasicSearch'
import BasicModal from '@/components/Modal/BasicModal'
import BasicForm from '@/components/Form/BasicForm'
import BasicTable from '@/components/Table/BasicTable'
import BasicPagination from '@/components/Pagination/BasicPagination'
import PermissionWrapper from "@/components/PermissionWrapper"
import {useSelector} from "react-redux"
import {RootState} from "@/stores"
import {CheckPermission} from "@/utils/permissions"
import {DataNode, TreeProps} from "antd/es/tree"
import {getMenuList} from "@/servers/admin/menu"
import {ITreeProps} from "@/components/Tree/BasicTree"

// 当前行数据
interface IRowData {
  id: string;
}

// 初始化搜索
const initSearch = {
  pageIndex: 1,
  pageSize: 20
}

// 初始化新增数据
const initCreate = {
  status: '2'
}

function Page() {
  useTitle('角色管理')
  const searchFormRef = useRef<FormFn>(null)
  const createFormRef = useRef<FormFn>(null)
  const [isLoading, setLoading] = useState(false)
  const [isCreateLoading, setCreateLoading] = useState(false)
  const [isCreateOpen, setCreateOpen] = useState(false)
  const [createTitle, setCreateTitle] = useState(ADD_TITLE)
  const [createId, setCreateId] = useState('')
  const [createData, setCreateData] = useState<IFormData>(initCreate)
  const [pageIndex, setPageIndex] = useState(initSearch.pageIndex)
  const [pageSize, setPageSize] = useState(initSearch.pageSize)
  const [total, setTotal] = useState(0)
  const [tableData, setTableData] = useState<IFormData[]>([])
  const [selectKey, setSelectKey] = useState<Key[]>([])
  const [allMenus,setAllMenus] = useState<DataNode[]>()
  const userInfo = useSelector((state: RootState) => state.user.userInfo)

  // 权限
  const pagePermission: IPagePermission = {
    list: CheckPermission("admin:sysRole:list", userInfo.permissions),
    create: CheckPermission("admin:sysUser:add", userInfo.permissions),
    update: CheckPermission("admin:sysUser:update", userInfo.permissions),
    delete: CheckPermission("admin:sysUser:delete", userInfo.permissions),
  }

  /**
   * 点击搜索
   * @param values - 表单返回数据
   */
  const onSearch = (values: IFormData) => {
    setPageIndex(1)
    handleSearch({ page: 1, pageSize, ...values }).then(r=> {})
  }

  /**
   * 搜索提交
   * @param values - 表单返回数据
   */
  const handleSearch = useCallback(async (values: IFormData) => {
    try {
      setLoading(true)
      const { data: { data } } = await getRolePage(values)
      const { list, count } = data
      setTotal(count)
      setTableData(list)
    } finally {
      setLoading(false)
    }
  }, [])

  // 首次进入自动加载接口数据
  useEffect(() => {
    if (pagePermission.list) {
      handleSearch({ ...initSearch }).then(r => {})
      handleGetMenus().then(r => {}) // 请求菜单数据
    }
  }, [handleSearch, pagePermission.list])

  /** 点击新增 */
  const onCreate = () => {
    setCreateOpen(true)
    setCreateTitle(ADD_TITLE)
    setCreateId('')
    setCreateData(initCreate)
    setSelectKey([])
  }

  /**
   * 点击编辑
   * @param record
   */
  const onUpdate = async (record: IRowData) => {
    try {
      setCreateOpen(true)
      setCreateTitle(EDIT_TITLE(record.id))
      setCreateId(record.id)
      setCreateLoading(true)
      const { data: { data } } = await getRoleById(record.id as string)
      setCreateData(data)
      setSelectKey(data.menuIds)
    } finally {
      setCreateLoading(false)
    }
  }

  /** 表格提交 */
  const createSubmit = () => {
    createFormRef.current?.handleSubmit()
  }

  /** 关闭新增/修改弹窗 */
  const closeCreate = () => {
    setCreateOpen(false)
  }

  /** 获取表格数据 */
  const getPage = () => {
    const formData = searchFormRef.current?.getFieldsValue() || {}
    const params = { ...formData, pageIndex, pageSize }
    handleSearch(params)
      .then(r =>{})
  }

  /**
   * 获取菜单树全量数据
   */
  const handleGetMenus = async () => {
    const {data} = await getMenuList()
    if (data.data) {
      // @ts-ignore
      setAllMenus(data.data)
    }
  }

  /**
   * 新增/编辑提交
   * @param values - 表单返回数据
   */
  const handleCreate = async (values: IFormData) => {
    try {
      setCreateLoading(true)
      if (createId) {
        values.menuIds = selectKey // 修改菜单权限
      }
      const functions = () => createId ? updateRole(createId, values) : createRole(values)
      const { data } = await functions()
      message.success(data?.message || '操作成功')
      setCreateOpen(false)
      getPage()
    } finally {
      setCreateLoading(false)
    }
  }

  /**
   * 点击删除
   * @param id - 唯一值
   */
  const onDelete = async (id: string) => {
    try {
      setLoading(true)
      const { data } = await deleteRole(id as string)
      if (data?.code === 200) {
        message.success(data?.message || '删除成功')
        getPage()
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * 处理分页
   * @param pageIndex - 当前页数
   * @param pageSize - 每页条数
   */
  const onChangePagination = (pageIndex: number, pageSize: number) => {
    setPageIndex(pageIndex)
    setPageSize(pageSize)
    const formData = searchFormRef.current?.getFieldsValue()
    handleSearch({...formData, pageIndex, pageSize})
      .then (r =>{})
  }

  /**
   * 角色菜单树选择事件
   */
  const onHandleCheck: TreeProps['onCheck'] = (selectedKeys) => {
    // @ts-ignore
    setSelectKey(selectedKeys)
  }

  /**
   * 菜单选择数参数
   */
  const menuTreeProp: ITreeProps = {
      treeData: allMenus,        // 树菜单全量数据
      selectKeys: selectKey,
      onCheck: onHandleCheck,  // 选中事件方法
      fieldNames: {title: 'label', key: 'value'} // 转换字段
  }

  /**
   * 渲染操作
   * @param _ - 当前值
   * @param record - 当前行参数
   */
  const optionRender: ITableOptions<object> = (_, record) => (
    <>
      {
        pagePermission.update &&
        <UpdateBtn
          className='mr-5px'
          isLoading={isLoading}
          onClick={() => onUpdate((record as IRowData))}
        />
      }
      {
        pagePermission.delete &&
        <DeleteBtn
          className='mr-5px'
          isLoading={isLoading}
          handleDelete={() => onDelete((record as IRowData).id)}
        />
      }
    </>
  )

  return (
    <PermissionWrapper requiredPermissions={{actions: "admin:sysUser:list"}}>
      <>
        <BasicSearch
          formRef={searchFormRef}
          list={searchList}
          data={initSearch}
          isLoading={isLoading}
          isCreate={pagePermission.create}
          onCreate={onCreate}
          handleFinish={onSearch}
        />

        <BasicTable
          loading={isLoading}
          columns={tableColumns(optionRender)}
          dataSource={tableData}
        />
        <BasicPagination
          disabled={isLoading}
          current={pageIndex}
          pageSize={pageSize}
          total={total}
          onChange={onChangePagination}
        />

        <BasicModal
          title={createTitle}
          open={isCreateOpen}
          confirmLoading={isCreateLoading}
          onOk={createSubmit}
          onCancel={closeCreate}
        >
          <BasicForm
            formRef={createFormRef}
            list={createList(menuTreeProp)}
            data={createData}
            labelCol={{ span: 6 }}
            handleFinish={handleCreate}
          />
        </BasicModal>
      </>
    </PermissionWrapper>
  )
}

export default Page
