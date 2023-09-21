<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMessageStore } from '@/stores/messages'
import { ContentArea, useUserStore } from '@/stores/user'

const messageStore = useMessageStore()
const userStore = useUserStore()
const message = ref('')

/**
 * Checks if the user is in a valid content area (direct or channel)
 */
const shown = computed(() => {
  if (
    userStore.inContentArea == ContentArea.Direct ||
    userStore.inContentArea == ContentArea.Channel
  ) {
    return true
  } else {
    return false
  }
})

/**
 * Sends a message to the server,
 * then refreshes the messages
 */
async function sendMessage() {
  let intitialLoadedMessages = 15
  if (userStore.inContentArea == ContentArea.Direct) {
    await messageStore.sendMessageOnDirect(
      {
        content: message.value,
        username: userStore.selectedDirect
      },
      // Refresh messages
      () =>
        messageStore.getMessagesFromDirect({
          username: userStore.selectedDirect,
          from: 0,
          limit: intitialLoadedMessages
        }),
      () => console.log('Error')
    )
  } else if (userStore.inContentArea == ContentArea.Channel) {
    console.log('sending message on channel')
    await messageStore.sendMessageOnChannel(
      {
        serverId: userStore.selectedChannel[0],
        channelId: userStore.selectedChannel[1],
        content: message.value
      },
      () =>
        messageStore.getMessagesFromChannel({
          serverId: userStore.selectedChannel[0],
          channelId: userStore.selectedChannel[1],
          from: 0,
          limit: intitialLoadedMessages
        }),
      () => console.log('Error')
    )
  }
  deleteMessage()
}

function deleteMessage() {
  message.value = ''
}
</script>

<template>
  <q-footer>
    <q-input padding filled v-model="message" label="Write..." @keydown.enter.prevent="sendMessage">
      <template v-slot:append>
        <q-icon v-if="message !== ''" name="close" @click="deleteMessage" class="cursor-pointer" />
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
