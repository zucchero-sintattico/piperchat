<script setup lang="ts">
import AreaHeader from './AreaHeader.vue'
import EmptyContent from './EmptyContent.vue'
import ChatArea from './chat/ChatArea.vue'
import WebrtcArea from './video/WebrtcArea.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
</script>

<template>
  <q-page class="q-pa-auto">
    <q-layout view="lHh Lpr lFf" container style="min-height: inherit">
      <AreaHeader />
      <EmptyContent v-if="!appStore.isMessageSection && !appStore.isVideoSection" />
      <ChatArea v-if="appStore.isMessageSection" />
      <WebrtcArea v-if="appStore.isVideoSection" />
    </q-layout>
  </q-page>
</template>

<style scoped lang="sass"></style>
