import { defineStore } from 'pinia';
import {UserInfoResult} from "@/pages/login/model";

interface UserDataInfo extends UserInfoResult {
}

interface StateData {
  menus: string[];
  userInfo: UserDataInfo;
}

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    // 用户权限
    menus: [],
    // 用户信息
    userInfo: {
      userId: 0,
      userName: '',
      deptId: -1,
      role: '',
      name: '',
      permissions: [],
      avatar: '',
      buttons: [],
      introduction: '',
    }
  } as unknown as StateData),
  actions: {
    /**
     * 设置用户权限
     * @param permissions - 权限
     */
    setPermissions(permissions: string[]) {
      this.menus = permissions;
    },
    /**
     * 获取用户权限
     */
    getPermissions() {
      return this.menus;
    },
    /**
     * 设置用户信息
     * @param userInfo - 用户值
     */
    setUserInfo(userInfo: UserDataInfo) {
      this.userInfo = userInfo;
    },
    /**
     * 获取用户信息
     */
    getUserInfo() {
      return this.userInfo;
    },
    /**
     * 清除用户信息
     */
    clearInfo() {
      this.userInfo = {
        avatar: '',
        buttons: [],
        deptId: -1,
        introduction: '',
        name: '',
        permissions: [],
        role: [],
        userId: -1,
        userName: '',
      };
    }
  },
});
