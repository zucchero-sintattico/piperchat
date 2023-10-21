<script setup lang="ts">
import { watch, ref, onMounted, computed } from 'vue'
import { useMessageStore } from '@/stores/messages'
import { ContentArea, useUserStore } from '@/stores/user'
import MessageInput from './MessageInput.vue'
const messageStore = useMessageStore()

const userStore = useUserStore()

let intitialLoadedMessages = 15

/**
 * Shows the chat if the user is in a valid content area
 */
const showChat = computed(
  () =>
    userStore.inContentArea == ContentArea.Direct || userStore.inContentArea == ContentArea.Channel
)

/**
 * When the user changes the selected direct,
 * refresh the messages
 */
watch(
  () => userStore.selectedDirect,
  () => {
    console.log('New direct: ' + userStore.selectedDirect)
    intitialLoadedMessages = 15
    messageStore.getMessagesFromDirect({
      username: userStore.selectedDirect,
      from: 0,
      limit: intitialLoadedMessages
    })
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
    intitialLoadedMessages = 15
    messageStore.getMessagesFromChannel({
      serverId: userStore.selectedChannel[0],
      channelId: userStore.selectedChannel[1],
      from: 0,
      limit: intitialLoadedMessages
    })
  }
)

const done = ref(true)

function handleScroll() {
  const bottomContent = document.getElementsByClassName('scrolling-area')[0]
  if (
    bottomContent.scrollTop - 5 <= -(bottomContent.scrollHeight - bottomContent.clientHeight) &&
    done.value
  ) {
    done.value = false
    setTimeout(() => {
      if (userStore.inContentArea == ContentArea.Direct) {
        messageStore.getMessagesFromDirect(
          {
            username: userStore.selectedDirect.toString(),
            from: intitialLoadedMessages,
            limit: 10
          },
          true
        )
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
      done.value = true
    }, 500)
  }
}

onMounted(() => {
  intitialLoadedMessages = 15
})
</script>

<template>
  <q-page-container padding v-if="showChat">
    <q-page>
      <template v-if="!done">
        <div class="row justify-center q-my-md">
          <q-spinner color="primary" name="dots" size="40px" />
        </div>
      </template>

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
      </q-infinite-scroll>
      <MessageInput />
    </q-page>
  </q-page-container>
</template>

<style scoped lang="scss">
.bottom-content {
  padding-right: 10px;
  padding-left: 10px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
  overflow-anchor: none;
  /* Reverse the order of displayed items */
}
</style>
