<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { CreateChannelApi } from '@api/piperchat/channel'

const userStore = useUserStore()
userStore.whoami()

async function onSubmit() {}
</script>

<template>
  <div class="q-pa-xl bg-white">
    <q-form class="q-gutter-md" @submit="onSubmit">
      <h2 class="text-h3">Settings</h2>

      <q-input v-model="userStore.username" label="Name" outlined class="q-mb-md" />

      <q-input v-bind="userStore.email" label="Email" outlined class="q-mb-md" />

      <q-btn type="submit" label="Save" color="primary" class="q-mt-md" />
    </q-form>
  </div>
</template>
