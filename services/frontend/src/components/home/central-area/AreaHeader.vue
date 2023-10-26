<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import ChannelMenu from '@/components/home/left-bar/menu/ChannelMenu.vue'

const appStore = useAppStore()
const channelSettingMenuActive = ref(false)

/**
 * Returns the title of the conversation
 * (either the username of the direct conversation
 * or the name of the channel)
 */
const title = computed(() => {
  if (appStore.selectedDirect !== null) {
    console.log('Updating title to: ' + appStore.selectedDirect)
    return appStore.selectedDirect
  } else if (appStore.selectedChannel !== null) {
    console.log('Updating title to: ' + appStore.selectedChannel?.name)
    return appStore.selectedChannel?.name
  } else {
    console.log("Updating title to: ''")
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
        <q-btn
          v-if="appStore.selectedChannel != null"
          icon="info"
          class="q-ml-sm"
          align="right"
          color="primary"
          @click="channelSettingMenuActive = true"
        />
      </q-toolbar-title>
      <q-btn v-if="isDirect" icon="video_call" flat round dense @click="handleCallButtonClick" />
    </q-toolbar>
  </q-header>

  <ChannelMenu v-model:active="channelSettingMenuActive" />
</template>
