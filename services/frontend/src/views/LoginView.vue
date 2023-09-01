<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import router from '../router/index'

const username = ref('')
const password = ref('')

async function login() {
  const userStore = useUserStore()
  await userStore.login({
    username: username.value,
    password: password.value
  })
  router.push({ name: 'Home' })
}

async function register() {
  const userStore = useUserStore()
  await userStore.register({
    username: username.value,
    email: username.value,
    password: password.value
  })
}
</script>

<template>
  <div class="container">
    <h1>Login</h1>
    <form @submit.prevent>
      <label for="username">Username</label>
      <input v-model="username" type="text" id="username" name="username" />
      <label for="password">Password</label>
      <input v-model="password" type="password" id="password" name="password" />
      <input @click="login" type="submit" name="" id="" />
    </form>
  </div>

  <div class="container">
    <h1>Register</h1>
    <form @submit.prevent>
      <label for="username">Username</label>
      <input v-model="username" type="text" id="username" name="username" />
      <label for="password">Password</label>
      <input v-model="password" type="password" id="password" name="password" />
      <input @click="register" type="submit" name="" id="" />
    </form>
  </div>
</template>

<style scoped>
h1 {
  color: red;
  text-align: center;
}

.container {
  background-color: darkgray;
  border: 1px solid black;
  width: 30%;
  margin: auto;

  padding: 1rem 2rem;
  margin-top: 10%;
}

input {
  display: block;
  margin-bottom: 1rem;
  height: 2rem;
  width: 100%;
}

form {
  margin: auto;
  display: flex;
  flex-direction: column;
}
</style>
