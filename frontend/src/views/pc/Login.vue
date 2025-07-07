<template>
  <div class="login-container">
    <el-form 
      :model="loginForm" 
      :rules="loginRules" 
      ref="loginFormRef"
      class="login-form"
    >
      <h2>CloudSaver 登录</h2>
      
      <el-form-item prop="username">
        <el-input 
          v-model="loginForm.username" 
          placeholder="用户名"
          prefix-icon="User"
        />
      </el-form-item>
      
      <el-form-item prop="password">
        <el-input 
          v-model="loginForm.password" 
          type="password" 
          placeholder="密码"
          prefix-icon="Lock"
          @keyup.enter="handleLogin"
        />
      </el-form-item>
      
      <el-form-item>
        <el-button 
          type="primary" 
          @click="handleLogin" 
          :loading="loading"
          class="login-btn"
        >
          登录
        </el-button>
      </el-form-item>
      
      <!-- 移除注册相关的按钮和链接 -->
      
      <div class="login-tips">
        <p>默认管理员: admin / mingmenmama</p>
        <p>默认用户: 10000 / 10000</p>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const loginFormRef = ref()

const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await userStore.login(loginForm)
        ElMessage.success('登录成功')
        router.push('/')
      } catch (error) {
        ElMessage.error(error.message || '登录失败')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-form {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 400px;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.login-btn {
  width: 100%;
  height: 45px;
  font-size: 16px;
}

.login-tips {
  margin-top: 20px;
  text-align: center;
  font-size: 12px;
  color: #666;
}

.login-tips p {
  margin: 5px 0;
}
</style>
