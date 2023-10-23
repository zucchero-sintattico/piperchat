<script setup lang="ts">
import ServerList from './ServerList.vue'
import DirectsList from './DirectsList.vue'
import ChannelsList from './ChannelsList.vue'
import { SelectedTab, useUserStore } from '@/stores/user'
import { onMounted } from 'vue'
import { useServerStore } from '@/stores/server'
import { useWebRTCStore } from '@/stores/webrtc'

const userStore = useUserStore()
const serverStore = useServerStore()

onMounted(() => {
  serverStore.getServers()
  userStore.selectedTab = SelectedTab.Directs
  userStore.selectedDirect = ''
})
</script>

<template>
  <q-drawer>
    <div class="row no-wrap left-menu bg-dark">
      <ServerList />

      <DirectsList v-if="userStore.selectedTab == SelectedTab.Directs" />
      <ChannelsList v-if="userStore.selectedTab == SelectedTab.Servers" />
    </div>
  </q-drawer>
</template>
