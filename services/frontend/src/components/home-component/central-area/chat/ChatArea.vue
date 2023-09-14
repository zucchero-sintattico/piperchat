<script setup lang="ts">
import { watch, ref, onMounted } from 'vue'
import { useMessageStore } from '@/stores/messages'
import { ContentArea, useUserStore } from '@/stores/user'
const messageStore = useMessageStore()

const userStore = useUserStore()

//watch selectedDirect
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

watch(userStore.selectedChannel, () => {
  messageStore.getMessagesFromChannel({
    serverId: userStore.selectedChannel[0],
    channelId: userStore.selectedChannel[1],
    from: 0,
    limit: 1000
  })
})

//watch messages
watch(
  () => messageStore.messages,
  (newVal) => {
    console.log(newVal)
  }
)

onMounted(() => {
  console.log(messageStore)
  // console.log(messages.forEach((message) => console.log(message.content)))
  console.log(userStore.inContentArea)
  // originalLocation = location.href
  // scrollToBottom()
})
</script>

<template>
  <q-page-container>
    <q-page padding>
      <div v-if="messageStore.messages.length > 0">
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
