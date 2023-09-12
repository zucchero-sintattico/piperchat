<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import router from '../../router/index'

const username = ref('')
const password = ref('')
const userStore = useUserStore()
const error = ref(true)

const ERROR_ANIMATION_DURATION = 2000

function onSubmit() {
  userStore.login(
    { username: username.value, password: password.value },
    () => {
      router.push({ name: 'Home' })
    },
    () => {
      error.value = true
      setInterval(() => {
        error.value = false
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
      hint="Insert your username"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />

    <q-input
      filled
      type="password"
      v-model="password"
      label="Your password"
      hint="Insert your password"
      lazy-rules
      :rules="[
        (val) => (val && val.length > 0) || 'Please type something',
        (val) => (val && val.length > 7) || 'Password must be at least 8 characters long'
      ]"
    />
    <div class="buttons">
      <q-btn label="Submit" type="submit" color="primary" />
      <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
    </div>
  </q-form>
  <Transition>
    <q-banner inline-actions class="text-white bg-red error-banner" v-if="error">
      Login error: {{ userStore.error }}.
    </q-banner>
  </Transition>
</template>

<style scoped>
.buttons {
  display: flex;
  justify-content: right;
}

.error-banner {
  position: absolute;
  bottom: 5px;
  width: 50%;
  border-radius: 1em;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
