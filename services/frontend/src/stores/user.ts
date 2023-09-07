import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AuthControllerImpl } from '../services/users/auth/auth-controller-impl'
import { UserControllerImpl } from '@/services/users/user/user-controller-impl'

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
        const response = await UserController.getUser()
        username.value = response.data.username
        email.value = response.data.email
        description.value = response.data.description
        photo.value = response.data.photo
      } catch (e) {
        console.log(e)
      }
    }

    const AuthController = new AuthControllerImpl()
    const UserController = new UserControllerImpl()

    async function login(parameters: { username: string; password: string }) {
      try {
        await AuthController.login(parameters.username, parameters.password)
        isLoggedIn.value = true
        error.value = ''
        console.log('login')
        await whoami()
      } catch (e) {
        console.log(e)
        error.value = 'Errore nel login'
      }
    }
    async function register(parameters: { username: string; email: string; password: string }) {
      try {
        await AuthController.register(
          parameters.username,
          parameters.email,
          parameters.password,
          null,
          null
        )
      } catch (e) {
        console.log(e)
        error.value = 'Errore nella registrazione'
      }
    }

    async function logout() {
      try {
        await AuthController.logout()
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
