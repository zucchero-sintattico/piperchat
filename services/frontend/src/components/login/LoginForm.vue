<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import router from '../../router/index'
import BottomPopUp from '../utils/BottomPopUp.vue'
import { BannerColor } from '../utils/BannerColor'
import { setCssVar } from 'quasar'

setCssVar('fontfamily', 'Roboto')

const username = ref('')
const password = ref('')
const userStore = useUserStore()

const BANNER_TIMEOUT = 3000
const error = ref(false)
const errorMessage = ref('')
const colorBanner = ref(BannerColor.OK)
function popUpBanner(content: string, color: BannerColor) {
  errorMessage.value = content
  colorBanner.value = color
  error.value = true
  setTimeout(() => {
    error.value = false
  }, BANNER_TIMEOUT)
}

async function onSubmit() {
  try {
    await userStore.login({ username: username.value, password: password.value })
    router.push({ name: 'Home' })
  } catch (e) {
    popUpBanner(String(e), BannerColor.ERROR)
  }
}

function onReset() {
  username.value = ''
  password.value = ''
}
</script>

<template>
  <q-form @submit="onSubmit" @reset="onReset">
    <q-input
      filled
      v-model="username"
      label="Username"
      lazy-rules
      :input-style="{ fontSize: '2em' }"
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />

    <q-input
      filled
      type="password"
      v-model="password"
      label="Your password"
      lazy-rules
      :input-style="{ fontSize: '1.5em' }"
      :rules="[
        (val) => (val && val.length > 0) || 'Please type something',
        (val) => (val && val.length > 7) || 'Password must be at least 8 characters long'
      ]"
    />

    <div class="buttons">
      <q-btn label="Submit" type="submit" color="primary" class="text-h5" :disable="error" />
      <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm text-h5" />
    </div>

    <!-- Error message -->
    <BottomPopUp :active="error" :color="colorBanner" :content="errorMessage" />
  </q-form>
</template>

<style scoped lang="scss">
.buttons {
  display: flex;
  justify-content: right;
}

:deep(.q-field__control) {
  margin-top: 2em;
  height: 6em;
}

:deep(.q-field__messages) {
  font-size: 1.4em;
}

:deep(.q-field__label) {
  font-size: 1.5em;
}
</style>
