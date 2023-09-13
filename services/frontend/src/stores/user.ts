import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { AuthControllerImpl } from '@/controllers/users/auth/auth-controller-impl'
import { UserControllerImpl } from '@/controllers/users/user/user-controller-impl'
import type { AuthController } from '@/controllers/users/auth/auth-controller'
import type { UserController } from '@/controllers/users/user/user-controller'
import type { GetServersApi } from '@api/piperchat/server'
import { LoginApi } from '@api/users/auth'
import type { WhoamiApi } from '@api/users/user'

export enum SelectedTab {
  Directs = 'directs',
  Servers = 'servers'
}

export const useUserStore = defineStore(
  'user',
  () => {
    const isLoggedIn = ref(false)
    const username = ref('')
    const email = ref('')
    const description = ref('')
    const photo = ref('')
    const error = ref('')

    // reactive objects do not persist
    const selectedServer = reactive<GetServersApi.Responses.Server>(
      {} as GetServersApi.Responses.Server
    )

    const selectedTab = ref(SelectedTab.Directs)

    async function whoami() {
      try {
        const response = (await userController.whoami()) as WhoamiApi.Responses.Success
        username.value = response.user.username
        email.value = response.user.email
      } catch (e) {
        console.log(e)
      }
    }

    const authController: AuthController = new AuthControllerImpl()
    const userController: UserController = new UserControllerImpl()

    async function login(
      parameters: { username: string; password: string },
      onSuccess: () => void,
      onError: (error: any) => void
    ) {
      try {
        const response: LoginApi.Response = await authController.login({
          username: parameters.username,
          password: parameters.password
        })
        switch (response.statusCode) {
          case 200:
            isLoggedIn.value = true
            onSuccess()
            await whoami()
            break
          case 401:
            onError('Wrong Username or Password')
            break
          default:
            onError('Error')
            break
        }
      } catch (e) {
        onError(e)
      }
    }
    async function register(
      parameters: { username: string; email: string; password: string },
      onSuccess: () => void,
      onError: (error: any) => void
    ) {
      try {
        const response = await authController.register({
          username: parameters.username,
          email: parameters.email,
          password: parameters.password
        })
        switch (response.statusCode) {
          case 200:
            onSuccess()
            break
          case 409:
            onError('User already exists')
            break
          default:
            onError('Error')
            break
        }
      } catch (e) {
        onError(e)
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
      selectedServer,
      selectedTab,
      login,
      register,
      logout
    }
  },
  { persist: true }
)
