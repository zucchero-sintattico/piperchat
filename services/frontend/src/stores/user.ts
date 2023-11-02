import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AuthControllerImpl } from '@/controllers/users/auth/auth-controller-impl'
import { UserControllerImpl } from '@/controllers/users/user/user-controller-impl'
import type { AuthController } from '@/controllers/users/auth/auth-controller'
import type { UserController } from '@/controllers/users/user/user-controller'
import { LoginApi, RegisterApi } from '@api/users/auth'
import type { WhoamiApi } from '@api/users/user'
import { usePhotoStore } from './photo'

export const useUserStore = defineStore(
  'user',
  () => {
    const photoStore = usePhotoStore()

    const isLoggedIn = ref(false)
    const username = ref('')
    const email = ref('')
    const description = ref('')
    const jwt = ref('')

    let refreshing = false
    async function refresh() {
      if (refreshing) return
      refreshing = true
      console.log('Refreshing user')
      await whoami()
      refreshing = false
    }

    const authController: AuthController = new AuthControllerImpl()
    const userController: UserController = new UserControllerImpl()

    // ==================== AUTH ==================== //
    async function login(parameters: { username: string; password: string }) {
      const response: LoginApi.Response = await authController.login({
        username: parameters.username,
        password: parameters.password
      })
      if (response.statusCode === 200) {
        isLoggedIn.value = true
        jwt.value = (response as LoginApi.Responses.Success).jwt
        await whoami()
      } else {
        const typed = response as LoginApi.Errors.Type
        throw new Error(typed.error)
      }
    }

    async function register(parameters: { username: string; email: string; password: string }) {
      const response = await authController.register({
        username: parameters.username,
        email: parameters.email,
        password: parameters.password
      })
      if (response.statusCode !== 200) {
        const typed = response as RegisterApi.Errors.Type
        throw new Error(typed.error)
      }
    }

    async function logout() {
      try {
        await authController.logout()
        isLoggedIn.value = false
      } catch (e) {
        console.log(e)
      }
    }

    // ==================== USER ==================== //
    async function whoami() {
      try {
        const response = (await userController.whoami()) as WhoamiApi.Responses.Success
        username.value = response.user.username
        email.value = response.user.email
      } catch (e) {
        logout()
        console.log('automatic logout')
      }
    }

    async function updatePhoto(newPhoto: string) {
      try {
        const response = await userController.updateUserPhoto({
          photo: newPhoto
        })
        if (response.statusCode === 200) {
          photoStore.reloadUserPhoto(username.value)
        }
      } catch (e) {
        console.log(e)
      }
    }

    return {
      // ================ Data ================ //
      username,
      email,
      description,
      isLoggedIn,
      jwt,
      // ================ Fetching ================ //
      refresh,
      // ================ Requests ================ //
      login,
      register,
      logout,
      updatePhoto
    }
  },
  { persist: true }
)
