import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    // 用户菜单
    menus: [],
    // 用户信息
    userInfo: {
      avatar: '',
      buttons: undefined,
      deptId: -1,
      introduction: '',
      name: '',
      permissions: [],
      role: undefined,
      userId: undefined,
      userName: ''
    }
  },
  reducers: {
    /** 设置用户信息 */
    setUserInfo: (state, action) => {
      state.userInfo = action.payload
    },
    /** 设置权限 */
    setPermissions: (state, action) => {
      state.menus = action.payload
    },
    /** 清除用户信息 */
    clearInfo: (state) => {
      state.userInfo = {
        avatar: '',
        buttons: undefined,
        deptId: -1,
        introduction: '',
        name: '',
        permissions: [],
        role: undefined,
        userId: undefined,
        userName: ''
      } // 清空用户信息
      state.menus = [] // 清空菜单
    }
  }
})

export const {
  setUserInfo,
  setPermissions,
  clearInfo
} = userSlice.actions

export default userSlice.reducer
