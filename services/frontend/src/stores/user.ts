import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AuthControllerImpl } from '@/controllers/users/auth/auth-controller-impl'
import { UserControllerImpl } from '@/controllers/users/user/user-controller-impl'
import type { AuthController } from '@/controllers/users/auth/auth-controller'
import type { UserController } from '@/controllers/users/user/user-controller'
import { LoginApi, RegisterApi } from '@piperchat/api/src/users/auth'

export const useUserStore = defineStore(
  'user',
  () => {
    const isLoggedIn = ref(false)
    const username = ref('')
    const email = ref('')
    const description = ref('')
    const photo = ref('')
    const error = ref('')
    async function whoami() {
      try {
        const response = await userController.getUser()
        username.value = response.data.username
        email.value = response.data.email
        description.value = response.data.description
        photo.value = response.data.photo
      } catch (e) {
        console.log(e)
      }
    }

    const authController: AuthController = new AuthControllerImpl()
    const userController: UserController = new UserControllerImpl()

    async function login(parameters: { username: string; password: string }) {
      try {
        const response: LoginApi.Response = await authController.login({
          username: parameters.username,
          password: parameters.password
        })
        if (response instanceof LoginApi.Responses.Success) {
          isLoggedIn.value = true
          error.value = ''
          console.log('login')
          await whoami()
        }
      } catch (e) {
        console.log(e)
        error.value = 'Errore nel login'
      }
    }
    async function register(parameters: { username: string; email: string; password: string }) {
      try {
        await authController.register({
          username: parameters.username,
          email: parameters.email,
          password: parameters.password
        })
      } catch (e) {
        console.log(e)
        error.value = 'Errore nella registrazione'
      }
    }

    async function logout() {
      try {
        await authController.logout()
        isLoggedIn.value = false
      } catch (e) {
        console.log(e)
        error.value = 'Errore nel logout'
      }
    }

    return {
      isLoggedIn,
      username,
      email,
      description,
      photo,
      error,
      login,
      register,
      logout
    }
  },
  { persist: true }
)
