<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

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

const isDirect = computed(() => {
  return appStore.selectedDirect != null
})

function handleCallButtonClick() {
  appStore.setDirectCall()
}
</script>
<template>
  <q-header>
    <q-toolbar>
      <q-toolbar-title>
        {{ title }}
      </q-toolbar-title>
      <q-btn v-if="isDirect" icon="video_call" flat round dense @click="handleCallButtonClick" />
    </q-toolbar>
  </q-header>
</template>
