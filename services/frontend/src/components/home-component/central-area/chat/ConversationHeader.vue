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

const channelName = computed(() => {
  const server = serverStore.servers.filter((server) => server._id == userStore.selectedServerId)[0]
  if (server) {
    const channel = server.channels.filter((channel) => channel._id == userStore.selectedChannel[1])
    if (channel.length > 0) {
      return channel[0].name
    }
  }
  return ''
})
</script>
<template>
  <q-header>
    <q-toolbar>
      <!-- <q-avatar>
        <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
      </q-avatar> -->
      <q-toolbar-title v-if="userStore.inContentArea == ContentArea.Channel">
        {{ channelName }}
      </q-toolbar-title>
      <q-toolbar-title v-if="userStore.inContentArea == ContentArea.Direct">
        {{ title }}
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>
