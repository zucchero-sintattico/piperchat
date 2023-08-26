<template>
  <div v-if="!userStore.getters.isLoggedIn" class="d-grid gap-2 col-6 mx-auto">
    <FormLogin />
  </div>
  <div v-else class="text-center">
    <h2>Welcome, {{ userStore.state.name }}</h2>
    <Counter />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'

import userStore from '@/stores/user'
import FormLogin from '@/components/FormLogin.vue'

export default defineComponent({
  name: 'App',
  components: { FormLogin },
  setup() {
    onMounted(userStore.getUser)
    return { userStore }
  }
})
</script>
