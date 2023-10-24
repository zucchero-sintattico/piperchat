<script setup lang="ts">
import { computed } from 'vue'
import { SelectedTab, useAppStore } from '@/stores/app'

const appStore = useAppStore()

/**
 * Returns the title of the conversation
 * (either the username of the direct conversation
 * or the name of the channel)
 */
const title = computed(() => {
  if (appStore.selectedTab == SelectedTab.Directs) {
    return appStore.selectedDirect
  } else {
    return appStore.selectedChannel?.name
  }
})
</script>
<template>
  <q-header>
    <q-toolbar>
      <q-toolbar-title>
        {{ title }}
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>
