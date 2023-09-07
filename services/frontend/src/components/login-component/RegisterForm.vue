<script setup lang="ts">
import { ref } from 'vue'

const username = ref('')
const email = ref('')
const password = ref('')
const accept = ref(false)

function onSubmit() {
  console.log('Submitted!')
}

function onReset() {
  console.log('Resetted!')
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
      v-model="email"
      label="Email"
      hint="Insert your email"
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

    <q-toggle v-model="accept" label="I accept the license and terms" />

    <div>
      <q-btn label="Submit" type="submit" color="primary" />
      <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
    </div>
  </q-form>
</template>
