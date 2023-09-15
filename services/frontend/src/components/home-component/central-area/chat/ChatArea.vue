<script setup lang="ts">
import { watch, ref, onMounted, computed } from 'vue'
import { useMessageStore } from '@/stores/messages'
import { ContentArea, useUserStore } from '@/stores/user'
const messageStore = useMessageStore()

const userStore = useUserStore()

/**
 * Shows the chat if the user is in a valid content area
 */
const showChat = computed(() => {
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
 * When the user changes the selected direct,
 * refresh the messages
 */
watch(
  () => userStore.selectedDirect,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      messageStore.getMessagesFromDirect({
        username: newVal.toString(),
        from: 0,
        limit: 1000
      })
    }
  }
)

/**
 * When the user changes the selected channel,
 * refresh the messages
 */
watch(
  () => userStore.selectedChannel,
  () => {
    console.log('New channel: ' + userStore.selectedChannel)
    messageStore.getMessagesFromChannel({
      serverId: userStore.selectedChannel[0],
      channelId: userStore.selectedChannel[1],
      from: 0,
      limit: 1000
    })
  }
)

onMounted(() => {
  // console.log(messages.forEach((message) => console.log(message.content)))
  // originalLocation = location.href
  // scrollToBottom()
})
</script>

<template>
  <q-page-container>
    <q-page padding>
      <div v-if="showChat">
        <div v-for="(message, index) in messageStore.messages" :key="index">
          <q-chat-message
            :name="message.sender"
            avatar="https://cdn.quasar.dev/img/avatar1.jpg"
            :text="[message.content]"
            :sent="userStore.username == message.sender"
          />
        </div>
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
