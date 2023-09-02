<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import router from '../router/index'

const userStore = useUserStore()

function logout() {
  userStore.logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <h1>HomePage</h1>

  <h2> Hi, {{ userStore.username }} </h2>
  <p>Your email is : {{ userStore.email }}</p>
  <button @click="logout">Logout</button>
</template>

<style scoped>
h1 {
  text-align: center;
}

button {
  margin: auto;
  display: block;
  font-size: 2em;
}
</style>
