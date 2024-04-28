<template>
  <div class="absolute left-50% top-50% -translate-x-1/2 -translate-y-1/2 text-center">
    <h1 class="animation w-full text-6rem font-bold">
      403
    </h1>
    <p class="w-full text-20px font-bold mt-15px text-dark-700">
      当前页面无法访问，可能没权限或已删除
    </p>
    <Button :loading="isLoading" class="mt-25px margin-auto" @click="goIndex">
      返回首页
    </Button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Button, message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { useTabStore } from '@/stores/tabs';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { useMenuStore } from '@/stores/menu';
import { getFirstMenu, getMenuByKey } from '@/utils/menu';
import { useToken } from '@/hooks/useToken';
import {getUserInfo, getUserMenus} from "@/servers/login";

const router = useRouter();
const tabStore = useTabStore();
const userStore = useUserStore();
const menuStore = useMenuStore();
const { menuList } = storeToRefs(menuStore);
const { menus } = storeToRefs(userStore);
const { removeToken } = useToken();
const { setMenus } = menuStore;
const { setUserInfo, setPermissions, clearInfo } = userStore;
const {
  setActiveKey,
  addTabs,
  closeAllTab,
  clearCacheRoutes
} = tabStore;

const isLoading = ref(false);

/** 获取用户信息和权限 */
const getUser = async () => {
  try {
    const result = await getUserInfo();
    if (result.data) {
      setUserInfo(result.data);
    }
    setPermissions(result.data.permissions);
    return result.data.permissions;
  } catch(err) {
    console.error(err);
  }
};

/** 获取用户菜单 */
const getUserMenu = async (permissions: string[]) => {
  try {
    isLoading.value = true;
    const { data } = await getUserMenus();
    if (!data?.length) {
      return message.error('用户权限不足!');
    }
    setMenus(data);
    return data;
  } finally {
    isLoading.value = false;
  }
};

// 跳转首页
const goIndex = async () => {
  let currentMenuList = menuList.value;
  let currentPermissions = menus.value;

  if (!currentMenuList?.length || !currentPermissions?.length) {
    const permissions = await getUser();
    const menuList = await getUserMenu([]);
    currentPermissions = permissions || [];
    currentMenuList = menuList || [];
  }

  const firstMenu = getFirstMenu(currentMenuList, currentPermissions);

  // 不存在第一个菜单则跳回登录页
  if (!firstMenu) {
    removeToken();
    clearInfo();
    closeAllTab();
    clearCacheRoutes();
    router.push('/login');
    return message.error({ content: '用户暂无权限登录', key: 'permissions' });
  }

  router.push(firstMenu);
  const menuByKeyProps = {
    menus: currentMenuList,
    permissions: currentPermissions,
    key: firstMenu
  };
  const newItems = getMenuByKey(menuByKeyProps);
  if (newItems) {
    setActiveKey(newItems.key);
    addTabs(newItems);
  }
};
</script>

<style lang="less" scoped>
.animation {
  animation: shake .6s ease-in-out infinite alternate;
}

@keyframes shake {
  0% {
    transform: translate(-1px)
  }

  10% {
    transform: translate(2px, 1px)
  }

  30% {
    transform: translate(-3px, 2px)
  }

  35% {
    transform: translate(2px, -3px);
    filter: blur(4px)
  }

  45% {
    transform: translate(2px, 2px) skewY(-8deg) scaleX(.96);
    filter: blur(0)
  }

  50% {
    transform: translate(-3px, 1px)
  }
}
</style>
