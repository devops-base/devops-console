import type { ILoginData } from './model'
import type { FormProps } from 'antd'
import type { AppDispatch, RootState } from '@/stores'
import type { IThemeType } from '@/stores/public'
import { message } from 'antd'
import { setThemeValue } from '@/stores/public'
import { Form, Button, Input } from 'antd'
import { useEffect, useState } from 'react'
import {  THEME_KEY } from '@/utils/config'
import { UserOutlined, LockOutlined, SecurityScanOutlined } from '@ant-design/icons'
import {login, getCaptcha, getUserInfo, getPermission} from '@/servers/login'
import { useTitle } from '@/hooks/useTitle'
import { useToken } from '@/hooks/useToken'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setPermissions, setUserInfo } from '@/stores/user'
import { getFirstMenu } from '@/menus/utils/helper'
import { defaultMenus } from '@/menus'
import  style from "./login.module.less"
import {permissionsToArray} from "@/utils/permissions"

function Login() {
  useTitle('登录')
  const navigate = useNavigate()
  const dispatch: AppDispatch = useDispatch()
  const [getToken, setToken] = useToken()
  const [isLoading, setLoading] = useState(false)
  const menus = useSelector((state: RootState) => state.user.menus)
  const themeCache = (localStorage.getItem(THEME_KEY) || 'light') as IThemeType
  const [geCapCode, setCapCode] = useState("")
  const [getCapId, setCapId] = useState("")

  // 获取验证码
  useEffect(() => {
    // 请求验证码数据
    handleCaptcha().then(r =>{})
  }, [])

  useEffect(() => {
    if (!themeCache) {
      localStorage.setItem(THEME_KEY, 'light')
    }
    if (themeCache === 'dark') {
      document.body.className = 'theme-dark'
    }
    dispatch(setThemeValue(themeCache === 'dark' ? 'dark' : 'light'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeCache])

  useEffect(() => {
    // 如果存在token，则直接进入页面
    if (getToken()) {
      const firstMenu = getFirstMenu(defaultMenus, menus)
      navigate(firstMenu)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /*
  *
  * 处理验证码请求逻辑
   */
  const handleCaptcha = async () => {
    const { data: {success, data, id} } = await getCaptcha()
    if (success) {
      setCapCode(data);
      setCapId(id);
    }
  }

  /**
   * 处理登录
   * @param values - 表单数据
   */
  const handleFinish: FormProps['onFinish'] = async (values: ILoginData) => {
    try {
      setLoading(true)
      values.uuid = getCapId
      const { data: { token, success }  } = await login(values)
      if (success) {
        // 获取权限信息.
        setToken(token)
        const result  = await getUserInfo()
        if (result.data.data) {
          dispatch(setUserInfo(result.data.data))
        }
        const { data: {data} } = await getPermission()
        if (!data?.length || !token) {
          return message.error({ content: '用户暂无权限登录', key: 'permissions' })
        }
        const newPermission = permissionsToArray(data)
        dispatch(setPermissions(newPermission))
        navigate("/dashboard")
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * 处理失败
   * @param errors - 错误信息
   */
  const handleFinishFailed: FormProps['onFinishFailed'] = errors => {
    console.error('错误信息:', errors)
  }

  return (
    <>
      <div className={`
        ${themeCache === 'dark' ? 'bg-black text-white' : 'bg-light-400'}
        w-screen
        h-screen
        relative
      `}>
        <div className={`
          w-320px
          h-310px
          p-30px
          rounded-5px
          ${themeCache === 'dark' ? 'bg-black bg-dark-200' : 'bg-white'}
          box-border
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
        `}>
         <div className="pb-20px flex items-center justify-center">
            <span className="text-2xl font-bold tracking-2px">后台管理系统</span>
          </div>
          <Form
            name="horizontal_login"
            autoComplete="on"
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
            initialValues={{
              username: 'system',
              password: '123456',
              code: '',
              uuid: getCapId,
            }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input
                allow-clear="true"
                placeholder="用户名"
                data-test="username"
                autoComplete="username"
                addonBefore={<UserOutlined className='change' />}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
              ]}
            >
              <Input.Password
                placeholder="密码"
                autoComplete="current-password"
                addonBefore={<LockOutlined className='change' />}
              />
            </Form.Item>
            <Form.Item
              name="code"
              rules={[
                { required: true, message: '请输入验证码'}
              ]}
              style={{width:'65%', display: 'inline-block'}}
            >
              <Input
                allowClear={true}
                placeholder={"请输入验证码"}
                autoComplete={"code"}
                addonBefore={<SecurityScanOutlined className={'change'} />}
              />
            </Form.Item>
            <div className={style.validCode} onClick={handleCaptcha}>
              <img
                width="100%"
                height="32"
                src={geCapCode}
                alt="LOGO"
              />
            </div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full mt-5px rounded-5px tracking-2px"
                loading={isLoading}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  )
}

export default Login
