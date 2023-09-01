import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const isLoggedIn = ref(false)
    const username = ref('')
    const email = ref('')
    const description = ref('')
    const photo = ref('')

    async function login(parameters: { username: string; password: string }) {
      const response = await axios.post('/auth/login', parameters)
      if (response.status === 200) {
        const data = await response.data
        username.value = data.username
        email.value = data.email
        description.value = data.description
        photo.value = data.photo
        isLoggedIn.value = true
      }
    }
    async function register(parameters: { username: string; email: string; password: string }) {
      try {
        const response = await axios.post('/auth/register', parameters)
        if (response.status === 200) {
          const data = await response.data
          username.value = data.username
          email.value = data.email
          description.value = data.description
          photo.value = data.photo
        }
      } catch (error) {
        console.log(error)
      }
    }

    async function logout() {
      const response = await axios.post('/auth/logout')
      if (response.status === 200) {
        username.value = ''
        email.value = ''
        description.value = ''
        photo.value = ''
        isLoggedIn.value = false
      }
    }

    return {
      isLoggedIn,
      username,
      email,
      description,
      photo,
      login,
      register,
      logout
    }
  },
  { persist: true }
)
