<script setup lang="ts">
import { watch, ref, onMounted } from 'vue'
import { useMessageStore } from '../../stores/messages'
const messageStore = useMessageStore()
const messages = messageStore.messages.data
let originalLocation: string

const anchor = document.getElementById('last')
const content = document.getElementById('content')

function scrollToBottom() {
  content?.scrollTo(0, content.scrollHeight)
}

// // Scrolla in fondo al contenitore dei messaggi quando i messaggi cambiano
watch(messages, () => {
  scrollToBottom()
})

onMounted(() => {
  originalLocation = location.href
  scrollToBottom()
})
</script>

<template>
  <q-page-container>
    <q-page padding>
      <div v-for="(message, index) in messages" :key="index">
        <q-chat-message
          :name="message.sender"
          avatar="https://cdn.quasar.dev/img/avatar1.jpg"
          :text="[message.content]"
          :sent="message.sent"
        />
      </div>
      <div id="last"></div>
      <!-- place QPageScroller at end of page -->
      <q-page-scroller
        ref="pageScroller"
        reverse
        position="top"
        expand
        :scroll-offset="200"
        :offset="[0, 18]"
      >
        <q-btn fab icon="keyboard_arrow_down" color="primary" />
      </q-page-scroller>
    </q-page>
  </q-page-container>
</template>
