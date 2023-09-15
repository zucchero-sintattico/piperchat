<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import BottomPopUp from '../utils/BottomPopUp.vue'
import { BannerColor } from '../utils/BannerColor'

const userStore = useUserStore()

const REDIRECT_DELAY = 2000

const username = ref('')
const email = ref('')
const password = ref('')
const password2 = ref('')

const registrationSuccess = ref(false)

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
    await userStore.register({
      username: username.value,
      email: email.value,
      password: password.value
    })
    registrationSuccess.value = true
    setTimeout(() => {
      location.reload()
    }, REDIRECT_DELAY)
  } catch (e) {
    popUpBanner(String(e), BannerColor.ERROR)
  }
}

function onReset() {
  username.value = ''
  email.value = ''
  password.value = ''
  password2.value = ''
}
</script>

<template>
  <!-- Form -->
  <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
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
      v-model="email"
      label="Email"
      lazy-rules
      :input-style="{ fontSize: '2em' }"
      :rules="[
        (val) => (val && val.length > 0) || 'Please type something',
        (val) => /.+@.+/.test(val) || 'Invalid email address'
      ]"
    />

    <q-input
      filled
      type="password"
      v-model="password"
      label="Your password"
      lazy-rules
      :input-style="{ fontSize: '2em' }"
      :rules="[
        (val) => (val && val.length > 0) || 'Please type something',
        (val) => (val && val.length > 7) || 'Password must be at least 8 characters long'
      ]"
    />

    <q-input
      filled
      type="password"
      v-model="password2"
      label="Your password"
      lazy-rules
      :input-style="{ fontSize: '2em' }"
      :rules="[(val) => (val && password === password2) || 'Passwords must match']"
    />

    <div class="buttons">
      <q-btn label="Submit" type="submit" color="primary" :disable="error" class="text-h5" />
      <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm text-h5" />
    </div>

    <!-- Error message -->
    <BottomPopUp :active="error" :color="colorBanner" :content="errorMessage" />

    <!-- Banner for successful registration -->
    <q-dialog v-model="registrationSuccess" class="success-banner text-h6">
      <q-card>
        <q-card-section>
          <div class="text-h4">Successful registration</div>
        </q-card-section>

        <q-card-section class="q-pt-none text-success-banner">
          Registration successful, you will redirected <br />
          to the login page in a few seconds...
        </q-card-section>

        <q-card-actions align="right">
          <q-circular-progress indeterminate rounded size="30px" color="lime" class="q-ma-md" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-form>
</template>

<style scoped>
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
