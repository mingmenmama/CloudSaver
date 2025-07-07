import { defineStore } from 'pinia'
import { login as loginApi, getUserInfo } from '@/api/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.userInfo?.role === 'admin',
    canModifySettings: (state) => state.userInfo?.role === 'admin'
  },

  actions: {
    async login(loginForm) {
      try {
        const response = await loginApi(loginForm)
        this.token = response.token
        this.userInfo = response.user
        localStorage.setItem('token', response.token)
        return response
      } catch (error) {
        throw error
      }
    },

    async getUserInfo() {
      try {
        const response = await getUserInfo()
        this.userInfo = response
        return response
      } catch (error) {
        this.logout()
        throw error
      }
    },

    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('token')
    }
  }
})
