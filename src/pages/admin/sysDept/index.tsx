import {useTitle} from "@/hooks/useTitle"
import {useCallback, useEffect, useRef, useState} from "react"
import BasicForm, {IFormFn} from "@/components/Form/BasicForm"
import {ADD_TITLE, EDIT_TITLE} from "@/utils/config"
import {IFormData} from "#/form"
import {useSelector} from "react-redux"
import {RootState} from "@/stores"
import {IPagePermission, ITableOptions} from "#/public"
import {CheckPermission} from "@/utils/permissions"
import {getDeptById, getDeptPage} from "@/servers/admin/dept"
import PermissionWrapper from "@/components/PermissionWrapper"
import BasicSearch from "@/components/Search/BasicSearch"
import {createList, searchList, tableColumns} from "@/pages/admin/sysDept/model"
import BasicTable from "@/components/Table/BasicTable"
import BasicPagination from "@/components/Pagination/BasicPagination"
import BasicModal from "@/components/Modal/BasicModal"
import {Button, message} from "antd"
import {DeleteBtn, UpdateBtn} from "@/components/Buttons"
import {createDept, deleteDept, updateDept, getAllDept} from "@/servers/admin/dept"
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
  useTitle('部门管理')
  const searchFormRef = useRef<IFormFn>(null)
  const createFormRef = useRef<IFormFn>(null)
  const [isCreateOpen, setCreateOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isCreateLoading, setCreateLoading] = useState(false)
  const [createTitle, setCreateTitle] = useState(ADD_TITLE)
  const [createId, setCreateId] = useState('')
  const [createData, setCreateData] = useState<IFormData>(initCreate)
  const [page, setPage] = useState(initSearch.pageIndex)
  const [pageSize, setPageSize] = useState(initSearch.pageSize)
  const [total, setTotal] = useState(0)
  const [dept, setDept] = useState<IConstant[]>([])
  const [tableData, setTableData] = useState<IFormData[]>([])
  const userInfo = useSelector((state: RootState) => state.user.userInfo)

  // 权限
  const pagePermission: IPagePermission = {
    list: CheckPermission("admin:sysDept:list", userInfo.permissions),
    create: CheckPermission("admin:sysDept:add", userInfo.permissions),
    update: CheckPermission("admin:sysDept:edit", userInfo.permissions),
    delete: CheckPermission("admin:sysDept:delete", userInfo.permissions),
  }

  /**
   * 点击搜索
   * @param values - 表单返回数据
   */
  const onSearch = (values: IFormData) => {
    setPage(1)
    handleSearch({ pageIndex: 1, pageSize, ...values }).then(r => {})
  }

  /**
   * 处理搜索
   * @param values - 表单返回数据
   */
  const handleSearch = useCallback(async (values: IFormData) => {
    try {
      setLoading(true)
      const { data: { data } } = await getDeptPage(values)
      setTotal(data.length)
      setTableData(data)
    } finally {
      setLoading(false)
    }
  }, [])

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
      _res.unshift({ label: "主类目", value: 0, children: []})
      setDept(_res)
    }
  }

  // 首次进入自动加载接口数据
  useEffect(() => {
    if (pagePermission.list) handleSearch({ ...initSearch }).then(r => {})
    handleGetDept().then(r => {}) // 请求部门列表
  }, [handleSearch, pagePermission.list])

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

  /** 点击新增 */
  const onCreate = (record?: IRowData) => {
    setCreateOpen(true)
    setCreateTitle(ADD_TITLE)
    setCreateId('')
    if (record?.id !== undefined) {
      initCreate.parentId = record.id
      initCreate.menuType = record.menuType
      setCreateData(initCreate)
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
      const { data: { data } } = await getDeptById(record.id)
      setCreateData(data)
    } finally {
      setCreateLoading(false)
    }
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
   * 新增/编辑提交
   * @param values - 表单返回数据
   */
  const handleCreate = async (values: IFormData) => {
    try {
      setCreateLoading(true)
      const functions = () => createId ? updateDept(createId, values) : createDept(values)
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
      const { data } = await deleteDept(id as string)
      if (data?.code === 200) {
        message.success(data?.message || '删除成功')
        getPage()
      }
    } finally {
      setLoading(false)
    }
  }

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
          子部门
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
    <PermissionWrapper requiredPermissions={{actions: "admin:sysDept:list"}}>
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
            list={createList(dept)}
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
