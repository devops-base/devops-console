import type { AppDispatch } from '@/stores'
import { useToken } from '@/hooks/useToken'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useOutlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {getUserInfo, getUserMenus} from '@/servers/login'
import { setPermissions, setUserInfo } from '@/stores/user'
import {setMenuList, toggleCollapsed, togglePhone} from '@/stores/menu'
import { useLocation } from 'react-router-dom'
import { useDebounceFn } from 'ahooks'
import { Icon } from '@iconify/react'
import {message, Skeleton} from 'antd'
import Menu from './components/Menu'
import Header from './components/Header'
import Tabs from './components/Tabs'
import Forbidden from '@/pages/403'
import KeepAlive from 'react-activation'
import styles from './index.module.less'
import {useCommonStore} from "@/hooks/useCommonStore"

function Layout() {
  const dispatch: AppDispatch = useDispatch()
  const navigate = useNavigate()
  const [getToken] = useToken()
  const { pathname, search } = useLocation()
  const uri = pathname + search
  const token = getToken()
  const outlet = useOutlet()
  const [isLoading, setLoading] = useState(true)

  const {
    permissions,
    userId,
    isMaximize,
    isCollapsed,
    isPhone,
    isRefresh
  } = useCommonStore();

  /** 获取用户信息和权限 */
  const getUserIfo = useCallback(async () => {
    try {
      setLoading(true)
      const result  = await getUserInfo()
      if (result.data) {
        dispatch(setUserInfo(result.data))
      }
      dispatch(setPermissions(result.data.permissions))
    } catch(err) {
      console.error('获取用户数据失败:', err)
      setPermissions([])
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // 如果没有token，则返回登录页
    if (!token) {
      navigate('/login')
    }
    console.log('111=>', userId)
    // 当用户信息缓存不存在时则重新获取
    if (token && !userId) {
      getUserIfo()
      getMenuData()
    }
  }, [getUserIfo, navigate, token, userId])

  /** 判断是否是手机端 */
  const handleIsPhone = useDebounceFn(() => {
    const isPhone = window.innerWidth <= 768
    // 手机首次进来收缩菜单
    if (isPhone) dispatch(toggleCollapsed(true))
    dispatch(togglePhone(isPhone))
  }, { wait: 500 })

  /*获取菜单数据*/
  const getMenuData = useCallback(async() => {
    try {
      setLoading(true)
      const { data } = await getUserMenus()
      if (!data?.length || !token) {
        return message.error({ content: '用户暂无权限登录', key: 'permissions' })
      }
      dispatch(setMenuList(data))
    } finally {
       setLoading(false)
    }
  }, [])

  // 监听是否是手机端
  useEffect(() => {
    window.addEventListener('resize', handleIsPhone.run())

    return () => {
      window.removeEventListener('resize', handleIsPhone.run())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div id="layout">
      <Menu />
      <div className={styles.layout_right}>
        <div
          id='header'
          className={`
            border-bottom
            transition-all
            ${styles.header}
            ${isCollapsed ? styles.headerCloseMenu : ''}
            ${isMaximize ? styles.headerNone : ''}
            ${isPhone ? `!left-0 z-999` : ''}
          `}
        >
          <Header />
          <Tabs />
        </div>
        <div
          id="layoutContent"
          className={`
            overflow-auto
            transition-all
            ${styles.con}
            ${isMaximize ? styles.conMaximize : ''}
            ${isCollapsed ? styles.conCloseMenu : ''}
            ${isPhone ? `!left-0` : ''}
          `}
        >
          {
            isLoading &&
            permissions.length === 0 &&
            <Skeleton
              active
              className='p-30px'
              paragraph={{ rows: 10 }}
            />
          }
          {
            !isLoading &&
            permissions.length === 0 &&
            <Forbidden />
          }
          {
            isRefresh &&
            <div className={`
              absolute
              left-50%
              top-50%
              -rotate-x-50%
              -rotate-y-50%
            `}>
              <Icon
                className='text-40px animate-spin'
                icon='ri:loader-2-fill'
              />
            </div>
          }
          {
            permissions.length > 0 &&
            !isRefresh &&
            <KeepAlive id={uri} name={uri}>
              { outlet }
            </KeepAlive>
          }
        </div>
      </div>
    </div>
  )
}

export default Layout
