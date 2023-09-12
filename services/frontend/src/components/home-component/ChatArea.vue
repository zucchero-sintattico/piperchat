<script setup lang="ts">
// define array of messages
import { useMessageStore } from '../../stores/messages'

const messageStore = useMessageStore()
const messages = messageStore.messages.data
console.log(messages)
</script>

<template>
  <q-page-container>
    <q-page reverse padding>
      <div v-for="(message, index) in messages" :key="index">
        <q-chat-message
          :name="message.sender"
          avatar="https://cdn.quasar.dev/img/avatar1.jpg"
          :text="[message.content]"
          :sent="message.sent"
        />
      </div>

      <!-- place QPageScroller at end of page -->
      <q-page-scroller
        ref="page-scroller"
        reverse
        position="top"
        :scroll-offset="200"
        :offset="[0, 18]"
      >
        <q-btn fab icon="keyboard_arrow_down" color="primary" />
      </q-page-scroller>
    </q-page>
  </q-page-container>
</template>
