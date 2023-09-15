<script setup lang="ts">
import { useServerStore } from '@/stores/server'
import { ref } from 'vue'

const event = defineEmits<{
  (e: 'result', error?: string): void
  (e: 'close'): void
}>()

const serverStore = useServerStore()

const name = ref('')
const description = ref('')

async function onSubmit() {
  try {
    await serverStore.createServer(name.value, description.value)
    event('result')
  } catch (e) {
    event('result', String(e))
  }
}
</script>

<template>
  <div class="q-pa-xl bg-white">
    <q-form class="q-gutter-md" @submit="onSubmit">
      <h2 class="text-h3">Create a new server</h2>

      <q-input
        filled
        v-model="name"
        label="Server name"
        hint="Name of your server"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        filled
        v-model="description"
        label="Server description"
        hint="Description of your server"
        lazy-rules
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn
          label="Cancel"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
          @click="event('close')"
        />
      </div>
    </q-form>
  </div>
</template>
