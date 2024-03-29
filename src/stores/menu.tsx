import { createSlice } from '@reduxjs/toolkit'
import {SideMenu} from "#/public"

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    isPhone: false,
    isCollapsed: false,
    selectedKeys: 'dashboard', // 菜单选中值
    openKeys: ['Dashboard'], // 菜单展开项
    menuList: [] as SideMenu[],
  },
  reducers: {
    toggleCollapsed: (state, action) => {
      state.isCollapsed = !!action.payload
    },
    togglePhone: (state, action) => {
      state.isPhone = !!action.payload
    },
    setSelectedKeys: (state, action) => {
      state.selectedKeys = action.payload
    },
    setOpenKeys: (state, action) => {
      state.openKeys = action.payload
    },
    setMenuList: (state, action) => {
      state.menuList = action.payload;
    },
  }
})

export const {
  toggleCollapsed,
  togglePhone,
  setSelectedKeys,
  setOpenKeys,
  setMenuList
} = menuSlice.actions

export default menuSlice.reducer
