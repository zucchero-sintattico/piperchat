import { computed, reactive } from 'vue'
import axios from 'axios'
import { UserRequestImpl } from '../services/users/user-requests-impl'

const Request: UserRequest = new UserRequestImpl()

const state = reactive({
  name: '',
  username: '',
  email: '',
  error: ''
})

const getters = reactive({
  isLoggedIn: computed(() => state.username !== '')
})

const actions = {
  async getUser() {
    Request.getUserFromToken()
  },
  async login(username: string, password: string) {
    Request.login(username, password)
  }
}

export default { state, getters, ...actions }
