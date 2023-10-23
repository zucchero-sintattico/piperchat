<script setup lang="ts">
import AreaHeader from './AreaHeader.vue'
import ChatArea from './chat/ChatArea.vue'
import WebrtcArea from './video/WebrtcArea.vue'
import { useUserStore, ContentArea } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
  <q-page class="q-pa-auto">
    <q-layout view="lHh Lpr lFf" container style="min-height: inherit">
      <AreaHeader />
      <ChatArea v-if="userStore.inContentArea == ContentArea.Channel" />
      <WebrtcArea v-if="userStore.inContentArea == ContentArea.Multimedia" />
    </q-layout>
  </q-page>
</template>

<style scoped lang="sass"></style>
