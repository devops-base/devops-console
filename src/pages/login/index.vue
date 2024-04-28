<template>
  <div v-if="!isLock" class="bg-light-600 w-screen h-screen">
    <div class="box w-300px h-300px p-20px rounded-10px bg-white box-border">
      <div class="pb-20px pt-5px flex items-center justify-center">
        <span class="text-xl font-bold tracking-2px color-#000">
          后台管理系统
        </span>
      </div>
      <a-form
        :model="formState"
        name="horizontal_login"
        @finish="handleFinish"
        @finishFailed="handleFinishFailed"
      >
        <a-form-item
          name="username"
          :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <a-input
            v-model:value="formState.username"
            allowClear
            placeholder="用户名"
            autoComplete="username"
          >
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          name="password"
          :rules="[
            { required: true, message: '请输入密码' },
          ]"
        >
          <a-input-password
            v-model:value="formState.password"
            allowClear
            placeholder="密码"
            autoComplete="current-password"
          >
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item
          name="code"
          :rules="[{ required: true, message: '请输入验证码' }]"
        >
          <a-input
            v-model:value="formState.code"
            placeholder="验证码"
            :maxlength="4"
            style="width: 65%"
          >
            <template #prefix><SafetyOutlined /></template>
          </a-input>
          <div class="validCode">
            <img
              :src="captcha"
              class="absolute right-0 h-full cursor-pointer"
              @click="setCaptcha"
             alt=""/>
          </div>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            htmlType="submit"
            class="w-100% rounded-5px tracking-2px"
            :loading="isLoading && !isLock"
            :disabled="formState.username === '' || formState.password.length < 6 || isLock"
          >
            登录
          </a-button>
<!--          <a-button-->
<!--            type="primary"-->
<!--            htmlType="submit"-->
<!--            class="w-46% ml-20px rounded-5px tracking-2px"-->
<!--            :loading="isLoading && !isLock"-->
<!--            :disabled="formState.username === '' || formState.password.length < 6 || isLock"-->
<!--          >-->
<!--            钉钉认证-->
<!--          </a-button>-->
        </a-form-item>
      </a-form>
    </div>
  </div>

  <PageLoading v-else />
</template>

<script lang="ts" setup>
import type { FormProps } from 'ant-design-vue';
import type { LoginData } from './model';
import { message } from 'ant-design-vue';
import { onMounted, reactive, ref } from 'vue';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons-vue';
import {getCaptcha, getUserInfo, getUserMenus, login} from '@/servers/login';
import { useRoute, useRouter } from 'vue-router';
import { setTitle } from '@/utils/helper';
import { useTabStore } from '@/stores/tabs';
import { useToken } from '@/hooks/useToken';
import { useMenuStore } from '@/stores/menu';
import { useUserStore } from '@/stores/user';
import { PASSWORD_RULE } from '@/utils/verify';
import { useWatermark } from '@/hooks/useWatermark';
import { getFirstMenu } from '@/utils/menu';
import NProgress from 'nprogress';
import PageLoading from '@/components/Loading/PageLoading.vue';
import {SideMenu} from "#/public";

setTitle('登录');
const route = useRoute();
const router = useRouter();
const tabStore = useTabStore();
const userStore = useUserStore();
const menuStore = useMenuStore();
const { setUserInfo, setPermissions } = userStore;
const { closeAllTab } = tabStore;
const { setMenus, menuList } = menuStore;
const { setToken } = useToken();
const [_, RemoveWatermark] = useWatermark();
const isLoading = ref(false);
const isLock = ref(false);

const formState = reactive<LoginData>({
  username: '',
  password: '',
  code: '',
  uuid: '',
});

const captcha = ref('');

onMounted(() => {
  NProgress.done();
  // 清除水印
  RemoveWatermark();

  // 如果是无权限退出，清除标签选择
  if (route.query?.state === '401') {
    closeAllTab();
  }
});

// 获取验证码
const setCaptcha = async () => {
  const {data, success, id} = await getCaptcha();
  if (success) {
    captcha.value = data;
    formState.uuid = id;
  }
};

setCaptcha();

/** 处理跳转第一个有效菜单 */
const handleGoFirstMenu = async (permissions: string[]) => {
  try {
    isLoading.value = true;
    let menuData: SideMenu[] = menuList;
    if (!menuData.length) {
      const {data} = await getUserMenus();
      menuData = data;
      setMenus(menuData);
    }
    const firstMenu = getFirstMenu(menuData || [], permissions);
    if (!firstMenu) {
      return message.error({ content: '用户暂无权限登录', key: 'menu' });
    }
    router.push(firstMenu).then();
  } finally {
    isLoading.value = false;
  }
};

/**
 * 处理登录
 * @param values - 表单数据
 */
const handleFinish: FormProps['onFinish'] = async (values: LoginData) => {
  try {
    isLoading.value = true;
    values.uuid = formState.uuid;
    const {token, success} = await login(values);
    if (success) {
      // 获取权限信息
      setToken(token);
      const result = await getUserInfo();
      if (result.data) {
        setUserInfo(result.data);
        setPermissions(result.data.permissions);
      }
      await handleGoFirstMenu(result.data.permissions);
    }
  } finally {
    isLoading.value = false;
  }
};

/**
 * 处理失败
 * @param errors - 错误信息
 */
const handleFinishFailed: FormProps['onFinishFailed'] = errors => {
  console.error('错误信息:', errors);
};
</script>

<style lang="less" scoped>
.box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.validCode {
  width: 34%;
  height: 32px;
  float: right;
  text-align: center;
  border-radius: 4px;
  background: #f0f1f5;
}
</style>
