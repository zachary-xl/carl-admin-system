<template>
    <div class="login-container">
        <!-- 顶部标题区域 -->


        <!-- 表单区域 -->
        <div class="form-container">
            <div class="header">
            </div>
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" @submit.prevent="handleLogin"
                class="login-form">
                <h2 class="title text-center mb-4">业务员登录</h2>

                <!-- 手机号输入框 -->
                <el-form-item prop="phone">
                    <el-input v-model="loginForm.phone" placeholder="请输入手机号" type="tel" prefix-icon="el-icon-mobile"
                        clearable size="large">
                        <template #prefix>
                            <el-icon>
                                <Phone />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <!-- 密码输入框 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" placeholder="请输入密码" type="password"
                        prefix-icon="el-icon-lock" show-password size="large">
                        <template #prefix>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button type="primary" :loading="loading" class="login-button" @click="submitForm" size="large"
                        round>
                        {{ loading ? '登录中...' : '登录' }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 底部版权信息 -->
        <div class="footer">
            <p>©家禽管理系统 版权所有</p>
        </div>
    </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Phone, Lock } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'SalesmanLogin',
  components: {
    Phone,
    Lock
  },
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const loginFormRef = ref(null)

    // 表单数据
    const loginForm = reactive({
      phone: '',
      password: ''
    })

    // 表单验证规则
    const loginRules = reactive({
      phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ]
    })

    // 提交表单
    const submitForm = async () => {
      if (!loginFormRef.value) return

      await loginFormRef.value.validate(async (valid, fields) => {
        if (valid) {
          loading.value = true
          try {
            // 这里替换为实际的登录API调用
            // const res = await login(loginForm)

            // 模拟登录请求
            await new Promise(resolve => setTimeout(resolve, 1500))

            // 登录成功后的处理
            console.log('登录成功', loginForm)

            // 存储登录状态
            localStorage.setItem('salesmanPhone', loginForm.phone)
            localStorage.setItem('salesmanToken', 'mock-token-' + Date.now())

            ElMessage({
              type: 'success',
              message: '登录成功'
            })

            // 跳转到首页或其他页面
            router.push('/')
          } catch (error) {
            console.error('登录失败:', error)
            ElMessage({
              type: 'error',
              message: '登录失败，请检查账号密码'
            })
          } finally {
            loading.value = false
          }
        } else {
          console.log('表单验证失败', fields)
        }
      })
    }

    // 处理登录
    const handleLogin = () => {
      submitForm()
    }

    // 页面加载时自动聚焦到手机号输入框
    onMounted(() => {
      // 可以在这里添加自动聚焦或其他初始化逻辑
    })

    return {
      loginForm,
      loginRules,
      loginFormRef,
      loading,
      handleLogin,
      submitForm
    }
  }
})
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f8f8;
}

.header {
  padding: 2rem 1rem;
  text-align: center;
}

.title {
  font-size: 1.5rem;
  color: #303133;
}

.form-container {
  flex: 1;
  padding: 0 1.5rem;
}

.login-form {
  margin-top: 1rem;
  padding: 10px;
}

.login-button {
  width: 100%;
  margin-top: 1.5rem;
  height: 3rem;
  font-size: 1rem;
}

.footer {
  padding: 1rem;
  text-align: center;
  font-size: 0.75rem;
  color: #909399;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .form-container {
    padding: 0 1rem;
  }
}
</style>
