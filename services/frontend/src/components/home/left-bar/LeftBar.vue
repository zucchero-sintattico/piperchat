<script setup lang="ts">
import ServerList from './ServerList.vue'
import DirectsList from './DirectsList.vue'
import ChannelsList from './ChannelsList.vue'
import { onMounted } from 'vue'
import { useServerStore } from '@/stores/server'
import { useAppStore } from '@/stores/app'

const serverStore = useServerStore()
const appStore = useAppStore()

onMounted(async () => {
  await serverStore.refresh()
  appStore.setDirects()
})
</script>

<template>
  <q-drawer>
    <div class="row no-wrap left-menu bg-dark">
      <ServerList />

      <DirectsList v-if="appStore.isInDirects" />
      <ChannelsList v-if="appStore.selectedServer != null" />
    </div>
  </q-drawer>
</template>
