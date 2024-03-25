import {useTitle} from "@/hooks/useTitle"
import {useCallback, useEffect, useRef, useState} from "react"
import BasicForm, {FormFn} from "@/components/Form/BasicForm"
import {ADD_TITLE, EDIT_TITLE} from "@/utils/config"
import {IFormData} from "#/form"
import {useSelector} from "react-redux"
import {RootState} from "@/stores"
import {IPagePermission, ITableOptions} from "#/public"
import {CheckPermission} from "@/utils/permissions"
import { message} from "antd"
import { UpdateBtn} from "@/components/Buttons"
import PermissionWrapper from "@/components/PermissionWrapper"
import BasicSearch from "@/components/Search/BasicSearch"
import {createList, searchList, tableColumns} from "@/pages/admin/sysApi/model"
import BasicTable from "@/components/Table/BasicTable"
import BasicPagination from "@/components/Pagination/BasicPagination"
import BasicModal from "@/components/Modal/BasicModal"
import {getApiById, getApiPage, updateApi} from "@/servers/admin/apis"


// 初始化新增数据
const initCreate = {
  parentId: '',
  menuType: '',
}

// 初始化搜索数据
const initSearch = {
  pageIndex: 1,
  pageSize: 20
}

// 当前行数据
interface IRowData {
  id: string;
  menuType: string;
}

function Page() {
  useTitle('接口管理')
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

  // 权限
  const pagePermission: IPagePermission = {
    list: CheckPermission("admin:sysApi:list", userInfo.permissions),
    create: CheckPermission("admin:sysApi:add", userInfo.permissions),
    update: CheckPermission("admin:sysApi:edit", userInfo.permissions),
    delete: CheckPermission("admin:sysApi:delete", userInfo.permissions),
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
      const { data: { data } } = await getApiPage(values)
      setTotal(data.count)
      setTableData(data.list)
    } finally {
      setLoading(false)
    }
  }, [])

  // 首次进入自动加载接口数据
  useEffect(() => {
    if (pagePermission.list) handleSearch({ ...initSearch }).then(r => {})
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
      const { data: { data } } = await getApiById(record.id)
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
  const onChangePagination = useCallback((pageIndex: number, pageSize: number) => {
    setPage(pageIndex)
    setPageSize(pageSize)
    const formData = searchFormRef.current?.getFieldsValue()
    handleSearch({...formData, pageIndex, pageSize}).then (r =>{})
  }, [handleSearch])

  /**
   * 编辑提交
   * @param values - 表单返回数据
   */
  const handleCreate = async (values: IFormData) => {
    try {
      setCreateLoading(true)
      const { data } = await updateApi(createId, values)
      message.success(data?.message || '操作成功')
      setCreateOpen(false)
      getPage()
    } finally {
      setCreateLoading(false)
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
        pagePermission.update === true &&
        <UpdateBtn
          className='mr-5px'
          isLoading={isLoading}
          onClick={() => onUpdate((record as IRowData))}
        />
      }
    </>
  )

  return (
    <PermissionWrapper requiredPermissions={{actions: "admin:sysApi:list"}}>
      <>
        <BasicSearch
          formRef={searchFormRef}
          list={searchList}
          data={initSearch}
          isLoading={isLoading}
          isCreate={false}
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
            list={createList()}
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
