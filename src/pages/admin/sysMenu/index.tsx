import type { IFormData } from '#/form'
import type { RootState } from '@/stores'
import type { IPagePermission, ITableOptions } from '#/public'
import type { FormFn } from '@/components/Form/BasicForm'
import { useCallback, useEffect, useRef, useState } from 'react'
import { searchList, createList, tableColumns } from './model'
import {Button, message, RadioChangeEvent} from 'antd'
import {TransferProps} from 'antd/es/transfer'
import { useTitle } from '@/hooks/useTitle'
import { useSelector } from 'react-redux'
import {CheckPermission} from '@/utils/permissions'
import { ADD_TITLE, EDIT_TITLE } from '@/utils/config'
import { UpdateBtn, DeleteBtn } from '@/components/Buttons'
import {
  getMenuPage,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu, getMenuList
} from '@/servers/admin/menu'
import  {getApisList} from "@/servers/admin/apis"
import BasicSearch from '@/components/Search/BasicSearch'
import BasicModal from '@/components/Modal/BasicModal'
import BasicForm from '@/components/Form/BasicForm'
import BasicTable from '@/components/Table/BasicTable'
import BasicPagination from '@/components/Pagination/BasicPagination'
import PermissionWrapper from "@/components/PermissionWrapper"
import {IConstant} from "@/utils/constants"

// 当前行数据
interface IRowData {
  id: string;
  menuType: string;
}

// 初始化搜索数据
const initSearch = {
  pageIndex: 1,
  pageSize: 20
}

// 初始化新增数据
const initCreate = {
  parentId: '',
  menuType: '',
}

function Page() {
  useTitle('菜单管理')
  const searchFormRef = useRef<FormFn>(null)
  const createFormRef = useRef<FormFn>(null)
  const [isCreateOpen, setCreateOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isCreateLoading, setCreateLoading] = useState(false)
  const [createTitle, setCreateTitle] = useState(ADD_TITLE)
  const [createId, setCreateId] = useState('')
  const [createData, setCreateData] = useState<IFormData>(initCreate)
  const [page, setPage] = useState(initSearch.pageIndex)
  const [pageSize, setPageSize] = useState(initSearch.pageSize)
  const [total, setTotal] = useState(0)
  const [tableData, setTableData] = useState<IFormData[]>([])
  const userInfo = useSelector((state: RootState) => state.user.userInfo)
  const [menus, setMenus] = useState<IConstant[]>([])
  const [menType, setMenuType] = useState('')
  const [apis, setApis] = useState<IConstant[]>([])
  const [targetApi, setTargetApi] = useState<number[]>([])

  // 权限
  const pagePermission: IPagePermission = {
    page: CheckPermission("admin:sysMenu:query", userInfo.permissions),
    create: CheckPermission("admin:sysMenu:add", userInfo.permissions),
    update: CheckPermission("admin:sysMenu:edit", userInfo.permissions),
    delete: CheckPermission("admin:sysMenu:delete", userInfo.permissions),
  }

  /**
   * 点击搜索
   * @param values - 表单返回数据
   */
  const onSearch = (values: IFormData) => {
    setPage(1)
    handleSearch({ pageIndex: 1, pageSize, ...values }).then(r => {})
  }
  /*
  * 设置Transfer target值
  * */
  const onChangeTargetApi = (value: string[]) => {
      setTargetApi(value as unknown as number[])
  }

  /**
   * 处理搜索
   * @param values - 表单返回数据
   */
  const handleSearch = useCallback(async (values: IFormData) => {
    try {
      setLoading(true)
      const { data: { data } } = await getMenuPage(values)
      setTotal(data.length)
      setTableData(data)
    } finally {
      setLoading(false)
    }
  }, [])

  // 首次进入自动加载接口数据
  useEffect(() => {
    if (pagePermission.page) handleSearch({ ...initSearch }).then(r => {})
    handleGetMuns().then(r => {})
    handleGetApiList().then(r => {})
  }, [handleSearch, pagePermission.page])

  // 更新菜单类型
  const handleSetMuns = (e: RadioChangeEvent) => {
      setMenuType(e.target.value)
  }

  // 获取菜单列表
  const handleGetMuns = async () => {
    const {data} = await getMenuList()
    if (data.data) {
      data.data.unshift({ label: "主类目", value: 0, children: []})
      // @ts-ignore
      setMenus(data.data)
    }
  }

  // 获取API接口列表
  const handleGetApiList = async () => {
    const {data} = await getApisList()
    if (data.data) {
      setApis(data.data)
    }
  }

  /** 点击新增 */
  const onCreate = (record?: IRowData) => {
    setCreateOpen(true)
    setCreateTitle(ADD_TITLE)
    setCreateId('')
    if (record?.id !== undefined) {
      initCreate.parentId = record.id
      initCreate.menuType = record.menuType
      setCreateData(initCreate)
      setMenuType(record.menuType)
    }
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
      const { data: { data } } = await getMenuById(record.id)
      setCreateData(data)
      setTargetApi(data.apis)
    } finally {
      setMenuType(record.menuType)
      setCreateLoading(false)
    }
  }

  /** 表单提交 */
  const createSubmit = () => {
    createFormRef.current?.handleSubmit()
  }

  /** 关闭新增/修改弹窗 */
  const closeCreate = () => {
    setCreateOpen(false)
    initCreate.parentId = '' // 添加时重新设置父级菜单
    setCreateData(initCreate)
  }

  /** 获取表格数据 */
  const getPage = () => {
    const formData = searchFormRef.current?.getFieldsValue() || {}
    const params = { ...formData, page, pageSize }
    handleSearch(params).then(r => {})
  }

  /**
   * 新增/编辑提交
   * @param values - 表单返回数据
   */
  const handleCreate = async (values: IFormData) => {
    try {
      setCreateLoading(true)
      values.apis = targetApi // 修改API
      const functions = () => createId ? updateMenu(createId, values) : createMenu(values)
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
      const { data } = await deleteMenu(id as string)
      if (data?.code === 200) {
        message.success(data?.message || '删除成功')
        getPage()
      }
    } finally {
      setLoading(false)
    }
  }

  /*
  * 穿梭框搜索条件
  * */
  const filterOption = (inputValue: string, option: IConstant) =>
    option.label?.indexOf(inputValue) > -1;

  /**
   * API接口穿梭框参数
   */
  const transferProps: TransferProps<IConstant> = {
    dataSource: apis,
    showSearch: true,
    filterOption: filterOption,
    targetKeys: (targetApi as unknown as string[]),
    onChange: onChangeTargetApi,
    rowKey:  (item) => item.id as unknown as string,
    render: (item) => item.label
  }

  /**
   * 处理分页
   * @param page - 当前页数
   * @param pageSize - 每页条数
   */
  const onChangePagination = useCallback((page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
    const formData = searchFormRef.current?.getFieldsValue()
    handleSearch({...formData, page, pageSize})
      .then (r =>{})
  }, [handleSearch])

  /**
   * 渲染操作
   * @param _ - 当前值
   * @param record - 当前行参数
   */
  const optionRender: ITableOptions<object> = (_, record) => (
    <>
      {
        pagePermission.create === true &&
        <Button
          className='mr-5px'
          type={'primary'}
          onClick={() => onCreate(record as IRowData)}
        >
          子菜单
        </Button>
      }
      {
        pagePermission.update === true &&
        <UpdateBtn
          className='mr-5px'
          isLoading={isLoading}
          onClick={() => onUpdate((record as IRowData))}
        />
      }
      {
        pagePermission.delete === true &&
        <DeleteBtn
          className='mr-5px'
          isLoading={isLoading}
          handleDelete={() => onDelete((record as IRowData).id)}
        />
      }
    </>
  )

  return (
    <PermissionWrapper requiredPermissions={{actions: "admin:sysMenu:list"}}>
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
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={onChangePagination}
        />
        <BasicModal
          width={600}
          title={createTitle}
          open={isCreateOpen}
          confirmLoading={isCreateLoading}
          onOk={createSubmit}
          onCancel={closeCreate}
        >
          <BasicForm
            formRef={createFormRef}
            list={createList(transferProps,menus, menType, handleSetMuns)}
            data={createData}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            handleFinish={handleCreate}
          />
        </BasicModal>
      </>
    </PermissionWrapper>
  )
}

export default Page
