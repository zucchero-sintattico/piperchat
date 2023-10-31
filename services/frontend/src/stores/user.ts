import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AuthControllerImpl } from '@/controllers/users/auth/auth-controller-impl'
import { UserControllerImpl } from '@/controllers/users/user/user-controller-impl'
import type { AuthController } from '@/controllers/users/auth/auth-controller'
import type { UserController } from '@/controllers/users/user/user-controller'
import { LoginApi, RegisterApi } from '@api/users/auth'
import type { GetUserPhotoApi, WhoamiApi } from '@api/users/user'

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

    async function getUserPhoto(targetUsername: string) {
      try {
        const response = await userController.getUserPhoto({
          username: targetUsername
        })
        if (response.statusCode === 200) {
          const typed = response as GetUserPhotoApi.Responses.Success
          if (typed.photo.data === undefined) {
            return 'src/assets/user-avatar.png'
          } else {
            return (
              'data:image/jpeg;base64,' +
              btoa(
                new Uint8Array(typed.photo.data.data).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  ''
                )
              )
            )
          }
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
      whoami,
      login,
      register,
      logout,
      updatePhoto,
      getUserPhoto,
      reloadUserPhoto,
      photoLoaded,
      reload
    }
  },
  { persist: true }
)
