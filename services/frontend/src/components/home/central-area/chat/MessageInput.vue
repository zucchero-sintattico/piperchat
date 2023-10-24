<script setup lang="ts">
import { ref } from 'vue'
import { useMessageStore } from '@/stores/messages'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const messageStore = useMessageStore()
const message = ref('')

/**
 * Sends a message to the server,
 * then refreshes the messages
 */
async function sendMessage() {
  // check if message is empty
  if (message.value.match(/^\s*$/)) {
    return
  }
  await messageStore.sendMessage(message.value)
  deleteMessage()
}

function deleteMessage() {
  message.value = ''
}
</script>

<template>
  <q-footer v-if="appStore.isMessageSection">
    <q-input padding filled v-model="message" label="Write..." @keydown.enter.prevent="sendMessage">
      <template v-slot:append>
        <q-icon v-if="message != ''" name="close" @click="deleteMessage" class="cursor-pointer" />
      </template>
      <template v-slot:after>
        <q-btn round dense flat icon="send" color="primary" @click="sendMessage" id="send" />
      </template>
    </q-input>
  </q-footer>
</template>

<style scoped lang="scss">
footer {
  background-color: transparent !important;
}
</style>
