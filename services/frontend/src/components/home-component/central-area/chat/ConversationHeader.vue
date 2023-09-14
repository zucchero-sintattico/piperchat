<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ContentArea, useUserStore } from '@/stores/user'
import { useServerStore } from '@/stores/server'

const title = ref('')
const userStore = useUserStore()
const serverStore = useServerStore()

watch(
  () => userStore.selectedDirect,
  (newVal) => {
    console.log('changed direct')
    if (newVal !== '') {
      title.value = newVal
    }
  }
)

watch(
  () => userStore.selectedChannel,
  (newVal) => {
    if (newVal[1] !== '') {
      const server = serverStore.servers.filter((server) => server._id == newVal[0])[0]

      if (server) {
        const channel = server.channels.filter((channel) => channel._id == newVal[1])

        if (channel.length > 0) {
          title.value = channel[0].name
        }
      }
    }
  }
)
</script>
<template>
  <q-header>
    <q-toolbar>
      <!-- <q-avatar>
        <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
      </q-avatar> -->
      <q-toolbar-title>
        {{ title }}
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>
