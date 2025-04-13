<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <div class="login-left">
        <img class="login-left-img" src="@/assets/images/login_left.png" alt="login" />
      </div>
      <el-form ref="formInstance" :model="loginForm" :rules="loginRules" class="login-form">
        <div class="mb-4 flex items-center justify-center">
          <h3 class="text-xl font-bold">{{ configSource.systemTitle }}</h3>
        </div>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" size="large" auto-complete="off" placeholder="账号">
            <template #prefix>
              <el-icon>
                <UserFilled />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" size="large" auto-complete="off" placeholder="密码"
            @keyup.enter="handleLogin">
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- <el-form-item prop="captchaCode" class="flex-nowrap justify-between">
          <el-input v-model="loginForm.captchaCode" size="large" auto-complete="off" placeholder="验证码"
            class="flex-1 pr-4" @keyup.enter="handleLogin">
            <template #prefix>
              <svg-icon icon-class="validCode" class="el-input__icon input-icon" />
            </template>
          </el-input>
          <div class="login-code">
            <img :src="captchaUrl" @click="getCaptchaCode" class="login-code-img" alt="验证码" />
          </div>
        </el-form-item> -->
        <el-form-item class="w-full">
          <el-button :loading="loading" size="large" type="primary" @click="handleLogin" class="w-full">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
      <!--        <el-checkbox v-model="loginForm.rememberMe" class="mb-4">记住密码</el-checkbox>-->
    </div>
  </div>
</template>

<script lang="ts" name="login" setup>
import { configSource, LOGIN_URL, HOME_URL } from "@/config";
import { useAuthStore, useKeepAliveStore } from "@/store";
import authLogin from "@/assets/json/authLogin.json";
import { initDynamicRoutes } from "@/router/dynamicRoutes";
import { MsgError, MsgWarning } from "@/utils/notification";
import { postAuthLoginAPI } from "@/api";
import type { FormInstance } from "element-plus";
import type { TLoginForm } from "./types";
import { setStorage } from "@/utils";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const keepAliveStore = useKeepAliveStore();
const formInstance = ref<FormInstance>();
const captchaUrl = ref("");
const loading = ref(false);
const redirect = ref("");

watch(
  route,
  (newRoute) => {
    redirect.value = (newRoute.query && (newRoute.query.redirect as string)) || "";
  },
  { immediate: true }
);

const loginForm = reactive<any>({
  username: "",
  password: "",
});
const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
  // captchaCode: [{ required: true, trigger: "change", message: "请输入验证码" }]
};

const handleLogin = async () => {
  console.log(loginForm)
  formInstance.value?.validate(async (isValid, fields) => {
    if (isValid) {
      loading.value = true;
      try {
        // 1、执行登录接口
        const { data } = await postAuthLoginAPI(loginForm)
        // authStore.setUserInfoAction(data.user);
        // authStore.setTokenTypeAction(data.tokenType);
        authStore.setTokenAction(data.accessToken);
        setStorage("accessToken", data.accessToken);
        // 2、添加动态路由 AND 用户按钮 AND 角色信息 AND 用户个人信息
        if (authStore?.token) {
          await initDynamicRoutes();
        } else {
          MsgWarning("请重新登录🌻");
          await router.replace(LOGIN_URL);
          return;
        }
        // 3、清空 tabs数据、keepAlive缓存数据
        // tabsStore.setTab([]);
        await keepAliveStore.setKeepAliveName([]);
        // 4、跳转到首页
        await router.replace(HOME_URL);
      } catch (fields) {
        // 等待1秒关闭loading
        let loadingTime = 1;
        setInterval(() => {
          loadingTime--;
          if (loadingTime === 0) loading.value = false;
        }, 1000);
      }
    } else {
      console.log("登录校验失败", fields);
      MsgError("校验失败，信息填写有误🌻");
    }
  });
};
const getCaptchaCode = () => {
  // postCaptchaAPI().then(({ data }) => {
  //   captchaUrl.value = data.captchaBs64;
  //   loginForm.captchaId = data.captchaId;
  // });
};
onMounted(() => {
  // getCaptchaCode();
});
</script>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  min-height: 550px;
  background-color: #eeeeee;
  background-image: url("@/assets/images/login_bg.svg");
  background-size: cover;

  .login-box {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    padding: 0 50px;
    background-color: rgb(255 255 255 / 80%);
    border-radius: 10px;

    .dark {
      position: absolute;
      top: 13px;
      right: 18px;
    }

    .login-left {
      width: 800px;
      margin-right: 10px;

      .login-left-img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.title {
  padding: 0 0 0 14px;
  font-size: 26px;
  font-weight: bold;
  color: #34495e;
  white-space: nowrap;
  text-align: center;
  margin-bottom: 20px;
}

.login-form {
  width: 400px;
  padding: 25px 25px 5px 25px;
  background-color: var(--el-bg-color);
  border-radius: 10px;
  box-shadow: rgb(0 0 0 / 10%) 0 2px 10px 2px;

  .el-input {
    height: 40px;

    input {
      height: 40px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0;
  }
}

.login-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
    width: 100%;
    height: 100%;
  }
}
</style>
