<script setup lang="ts">
import { computed, ref } from 'vue'
import { SelectedTab, useAppStore } from '@/stores/app'
import ChannelMenu from '@/components/home/left-bar/menu/ChannelMenu.vue'

const appStore = useAppStore()
const channelSettingMenuActive = ref(false)

/**
 * Returns the title of the conversation
 * (either the username of the direct conversation
 * or the name of the channel)
 */
const title = computed(() => {
  if (appStore.selectedDirect != null) {
    return appStore.selectedDirect
  } else if (appStore.selectedChannel != null) {
    return appStore.selectedChannel?.name
  } else {
    return ''
  }
})
</script>
<template>
  <q-header>
    <q-toolbar>
      <q-toolbar-title>
        {{ title }}
        <q-btn
          v-if="appStore.selectedChannel != null"
          icon="info"
          class="q-ml-sm"
          align="right"
          color="primary"
          @click="channelSettingMenuActive = true"
        />
      </q-toolbar-title>
    </q-toolbar>
  </q-header>

  <ChannelMenu v-model:active="channelSettingMenuActive" />
</template>
