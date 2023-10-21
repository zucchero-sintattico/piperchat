<script setup lang="ts">
import { computed } from 'vue'
import { ContentArea, useUserStore } from '@/stores/user'
import { useServerStore } from '@/stores/server'

const userStore = useUserStore()
const serverStore = useServerStore()

/**
 * Returns the title of the conversation
 * (either the username of the direct conversation
 * or the name of the channel)
 */
const title = computed(() => {
  if (userStore.inContentArea == ContentArea.Direct) {
    return userStore.selectedDirect
  } else if (
    userStore.inContentArea == ContentArea.Channel ||
    userStore.inContentArea == ContentArea.Multimedia
  ) {
    const server = serverStore.servers.filter(
      (server) => server.id == userStore.selectedChannel[0]
    )[0]
    if (server) {
      const channel = server.channels.filter(
        (channel) => channel.id == userStore.selectedChannel[1]
      )
      if (channel.length > 0) {
        return channel[0].name
      }
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
      <q-toolbar-title>
        {{ title }}
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>
