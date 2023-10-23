import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { AuthControllerImpl } from '@/controllers/users/auth/auth-controller-impl'
import { UserControllerImpl } from '@/controllers/users/user/user-controller-impl'
import type { AuthController } from '@/controllers/users/auth/auth-controller'
import type { UserController } from '@/controllers/users/user/user-controller'
import { LoginApi, RegisterApi } from '@api/users/auth'
import type { GetUserPhotoApi, WhoamiApi } from '@api/users/user'
import type { UpdatePhotoApi } from '@api/users/profile'
import { ThemesList, type Theme } from '@/assets/theme'

export enum SelectedTab {
  Directs = 'directs',
  Servers = 'servers'
}

export enum ContentArea {
  Empty = 'empty',
  Channel = 'channel',
  Direct = 'direct',
  Multimedia = 'multimedia'
}

export const useUserStore = defineStore(
  'user',
  () => {
    const isLoggedIn = ref(false)
    const username = ref('')
    const email = ref('')
    const description = ref('')

    const photoLoaded = ref(false)
    const photo = ref('')
    const jwt = ref('')

    async function reload() {
      await whoami()
      await reloadUserPhoto()
    }

    // Display direct or channel in left bar
    const selectedTab = ref(SelectedTab.Directs)
    // Display channel of selected server in left bar
    const selectedServerId = ref('')

    // Stuffs for content area
    const selectedChannelId = ref('')
    const selectedDirect = ref('')
    const inContentArea = ref(ContentArea.Empty)

    //Stuffs for Themes
    const DefaultTheme: Theme = {
      label: ThemesList[0].label,
      primary: ThemesList[0].primary,
      secondary: ThemesList[0].secondary,
      accent: ThemesList[0].accent,
      dark: ThemesList[0].dark
    }
    const selectedTheme = ref(DefaultTheme)

    function setActiveChannel(channelId: string) {
      selectedChannelId.value = channelId
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
          await reloadUserPhoto()
        }
      } catch (e) {
        console.log(e)
      }
    }

    async function reloadUserPhoto() {
      try {
        console.log(username.value)
        const response = await userController.getUserPhoto({
          username: username.value
        })
        if (response.statusCode === 200) {
          const typed = response as GetUserPhotoApi.Responses.Success
          console.log(typed)
          if (typed.photo.data === undefined) {
            photo.value = 'src/assets/user-avatar.png'
          } else {
            photo.value =
              'data:image/jpeg;base64,' +
              btoa(
                new Uint8Array(typed.photo.data.data).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  ''
                )
              )
          }
          photoLoaded.value = true
        }
      } catch (e) {
        console.log(e)
      }
    }

    return {
      isLoggedIn,
      jwt,
      username,
      email,
      description,
      photo,
      selectedServerId,
      selectedTab,
      selectedChannelId,
      selectedDirect,
      inContentArea,
      setActiveChannel,
      whoami,
      login,
      register,
      logout,
      updatePhoto,
      reloadUserPhoto,
      photoLoaded,
      reload,
      ThemesList,
      selectedTheme
    }
  },
  { persist: true }
)
