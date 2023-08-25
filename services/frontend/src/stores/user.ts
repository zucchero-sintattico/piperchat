import { computed, reactive } from 'vue'
import axios from 'axios'

const state = reactive({
  name: '',
  username: '',

  error: ''
})

const getters = reactive({
  isLoggedIn: computed(() => state.username !== '')
})

const actions = {
  async getUser() {

  },
  async login(username: string, password: string) {

    const data = JSON.stringify({
      username: username,
      password: password
    })

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:3000/auth/login',
      headers: {
        'Access-Control-Allow-Origin':'*',
        'Content-Type': 'application/json',
      },
      data: data
    }

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data))
      })
      .catch((error) => {
        console.log(error)
      })
  }


}

export default { state, getters, ...actions }