import type { IFormData } from '#/form'
import type { IPagePermission, ITableOptions } from '#/public'
import type { IFormFn } from '@/components/Form/BasicForm'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createList, searchList, tableColumns } from './model'
import {  message } from 'antd'
import { useTitle } from '@/hooks/useTitle'
import { ADD_TITLE, EDIT_TITLE } from '@/utils/config'
import { UpdateBtn, DeleteBtn } from '@/components/Buttons'
import {
  createUser,
  deleteUser,
  getUserById,
  getUserPage,
  updateUser,
} from '@/servers/admin/user'
import {getAllRoles} from '@/servers/admin/role'
import  {getAllDept} from '@/servers/admin/dept'
import BasicSearch from '@/components/Search/BasicSearch'
import BasicModal from '@/components/Modal/BasicModal'
import BasicForm from '@/components/Form/BasicForm'
import BasicTable from '@/components/Table/BasicTable'
import BasicPagination from '@/components/Pagination/BasicPagination'
import PermissionWrapper from "@/components/PermissionWrapper"
import {useSelector} from "react-redux"
import {RootState} from "@/stores"
import {CheckPermission} from "@/utils/permissions"
import {IConstant} from "@/utils/constants"

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
  useTitle('用户管理')
  const searchFormRef = useRef<IFormFn>(null)
  const createFormRef = useRef<IFormFn>(null)
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
  const [roles, setRoles] = useState<IConstant[]>([])
  const [dept, setDept] = useState<IConstant[]>([])
  const userInfo = useSelector((state: RootState) => state.user.userInfo)

  // 权限
  const pagePermission: IPagePermission = {
    list: CheckPermission("admin:sysUser:query", userInfo.permissions),
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
      const { data: { data } } = await getUserPage(values)
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
      handleGetRoles().then(r => {}) // 请求角色信息
      handleGetDept().then(r => {}) // 请求部门列表
    }
  }, [handleSearch, pagePermission.list])

  /** 点击新增 */
  const onCreate = () => {
    setCreateOpen(true)
    setCreateTitle(ADD_TITLE)
    setCreateId('')
    setCreateData(initCreate)
  }

  /**
   * 点击编辑
   * @param id - 唯一值
   */
  const onUpdate = async (id: string) => {
    try {
      setCreateOpen(true)
      setCreateTitle(EDIT_TITLE(id))
      setCreateId(id)
      setCreateLoading(true)
      const { data: { data } } = await getUserById(id as string)
      handleGetRoles().then(r => {}) // 获取角色
      handleGetDept().then(r => {}) // 获取部门
      setCreateData(data)
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
   * 新增/编辑提交
   * @param values - 表单返回数据
   */
  const handleCreate = async (values: IFormData) => {
    try {
      setCreateLoading(true)
      const functions = () => createId ? updateUser(createId, values) : createUser(values)
      const { data } = await functions()
      handleGetRoles().then(r => {}) // 获取角色
      handleGetDept().then(r => {}) // 获取部门
      message.success(data?.message || '操作成功')
      setCreateOpen(false)
      getPage()
    } finally {
      setCreateLoading(false)
    }
  }
  /*
  * 查询角色列表
  * */
  const handleGetRoles = async () => {
    const {data} = await getAllRoles()
    const _res: IConstant[] = []
    if (data.data) {
        for (let i=0;i<data.data.length;i++) {
          const item: IConstant = {label: data.data[i]['roleName'] as string, value: data.data[i]['id'] as unknown as number}
          _res.push(item)
        }
      setRoles(_res)
    }
  }
  /*
  * 获取部门列表
  */
  const handleGetDept = async () => {
    const {data} = await getAllDept()
    const _res: IConstant[] =[]
    if (data.data) {
      for (let i=0;i<data.data.length;i++) {
        const item: IConstant = { label: data.data[i]['deptName'] as string, value: data.data[i]['id'] as unknown as number}
        _res.push(item)
      }
      setDept(_res)
    }
  }

  /**
   * 点击删除
   * @param id - 唯一值
   */
  const onDelete = async (id: string) => {
    try {
      setLoading(true)
      const { data } = await deleteUser(id as string)
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
          onClick={() => onUpdate((record as IRowData).id)}
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
          columns={tableColumns(optionRender, roles, dept)}
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
            list={createList(roles, dept)}
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
