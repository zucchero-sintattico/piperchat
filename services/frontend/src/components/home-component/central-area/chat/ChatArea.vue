<script setup lang="ts">
import { watch, ref, onMounted, computed } from 'vue'
import { useMessageStore } from '@/stores/messages'
import { ContentArea, useUserStore } from '@/stores/user'
const messageStore = useMessageStore()

const userStore = useUserStore()

let intitialLoadedMessages = 15

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
        limit: intitialLoadedMessages
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
      limit: intitialLoadedMessages
    })
  }
)

function handleScroll() {
  const bottomContent = document.getElementsByClassName('scrolling-area')[0]
  if (bottomContent.scrollTop == -(bottomContent.scrollHeight - bottomContent.clientHeight)) {
    if (userStore.inContentArea == ContentArea.Direct) {
      messageStore.getMessagesFromDirect({
        username: userStore.selectedDirect.toString(),
        from: intitialLoadedMessages,
        limit: 10
      })
    } else if (userStore.inContentArea == ContentArea.Channel) {
      messageStore.getMessagesFromChannel(
        {
          serverId: userStore.selectedChannel[0],
          channelId: userStore.selectedChannel[1],
          from: intitialLoadedMessages,
          limit: 10
        },
        true
      )
    }
    intitialLoadedMessages += 10
  }
}

onMounted(() => {})
</script>

<template>
  <q-page-container padding>
    <q-page>
      <q-infinite-scroll reverse class="bottom-content scrolling-area" v-on:scroll="handleScroll">
        <div v-if="showChat">
          <div
            v-for="(message, index) in messageStore.messages"
            :key="index"
            class="justify-bottom"
          >
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
      </q-infinite-scroll>
    </q-page>
  </q-page-container>
</template>

<style scoped lang="scss">
.bottom-content {
  padding-right: 20px;
  padding-left: 20px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
  /* Reverse the order of displayed items */
}
</style>
