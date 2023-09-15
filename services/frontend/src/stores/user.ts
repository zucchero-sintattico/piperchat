import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AuthControllerImpl } from '@/controllers/users/auth/auth-controller-impl'
import { UserControllerImpl } from '@/controllers/users/user/user-controller-impl'
import type { AuthController } from '@/controllers/users/auth/auth-controller'
import type { UserController } from '@/controllers/users/user/user-controller'
import { LoginApi, RegisterApi } from '@api/users/auth'
import type { WhoamiApi } from '@api/users/user'

export enum SelectedTab {
  Directs = 'directs',
  Servers = 'servers'
}

export enum ContentArea {
  Empty = 'empty',
  Channel = 'channel',
  Direct = 'direct',
  Multimedie = 'multimedia'
}

export const useUserStore = defineStore(
  'user',
  () => {
    const isLoggedIn = ref(false)
    const username = ref('')
    const email = ref('')
    const description = ref('')
    const photo = ref('')

    // Display direct or channel in left bar
    const selectedTab = ref(SelectedTab.Directs)
    // Display channel of selected server in left bar
    const selectedServerId = ref('')

    // Stuffs for content area
    const selectedChannel = ref(['', ''])
    const selectedDirect = ref('')
    const inContentArea = ref(ContentArea.Empty)

    function setActiveChannel(channelId: string) {
      selectedChannel.value[0] = selectedServerId.value
      selectedChannel.value[1] = channelId
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
        console.log(e)
      }
    }

    return {
      isLoggedIn,
      username,
      email,
      description,
      photo,
      selectedServerId,
      selectedTab,
      selectedChannel,
      selectedDirect,
      inContentArea,
      setActiveChannel,
      whoami,
      login,
      register,
      logout
    }
  },
  { persist: true }
)
