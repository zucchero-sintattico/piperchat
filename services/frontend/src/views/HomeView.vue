<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import router from '../router/index'

function logout() {
  const userStore = useUserStore()
  userStore.logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <h1>HomePage</h1>
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
