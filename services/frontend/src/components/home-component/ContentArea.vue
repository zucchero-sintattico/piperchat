<script setup lang="ts">
import MessageInput from '@/components/home-component/MessageInput.vue'
import ConversationHeader from './ConversationHeader.vue'
import ChatArea from './ChatArea.vue'
</script>

<template>
  <!--Message-->
  <q-page class="q-pa-auto">
    <q-layout view="lHh Lpr lFf" container style="min-height: inherit">
      <ConversationHeader />
      <ChatArea />
      <MessageInput />
    </q-layout>
  </q-page>
</template>

<style scoped lang="sass"></style>
