<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import router from '../../router/index'
import FormError from './FormError.vue'

const ERROR_ANIMATION_DURATION = 2000

const username = ref('')
const password = ref('')
const userStore = useUserStore()
const error = ref(false)
const errorMessage = ref('')

function onSubmit() {
  userStore.login(
    { username: username.value, password: password.value },
    () => {
      router.push({ name: 'Home' })
    },
    (e: any) => {
      error.value = true
      errorMessage.value = e
      setTimeout(() => {
        error.value = false
        errorMessage.value = ''
      }, ERROR_ANIMATION_DURATION)
    }
  )
}

function onReset() {
  username.value = ''
  password.value = ''
}
</script>

<template>
  <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
    <q-input
      filled
      v-model="username"
      label="Username"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />

    <q-input
      filled
      type="password"
      v-model="password"
      label="Your password"
      lazy-rules
      :rules="[
        (val) => (val && val.length > 0) || 'Please type something',
        (val) => (val && val.length > 7) || 'Password must be at least 8 characters long'
      ]"
    />

    <div class="buttons">
      <q-btn label="Submit" type="submit" color="primary" :disable="error" />
      <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
    </div>

    <Transition>
      <FormError v-if="error" :error-message="errorMessage" />
    </Transition>
  </q-form>
</template>

<style scoped>
.buttons {
  display: flex;
  justify-content: right;
}
</style>
