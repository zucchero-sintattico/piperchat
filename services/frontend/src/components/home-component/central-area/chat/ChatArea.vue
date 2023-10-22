<script setup lang="ts">
import { watch, ref, onMounted, computed } from 'vue'
import { useMessageStore } from '@/stores/messages'
import { ContentArea, useUserStore } from '@/stores/user'
const messageStore = useMessageStore()

const userStore = useUserStore()

const areMessageLoaded = ref(true)
let loadedMessages: number
function resetLoadedMessages() {
  loadedMessages = 50
}

function incrementLoadedMessages() {
  loadedMessages += 25
}

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
  () => {
    console.log('New direct: ' + userStore.selectedDirect)
    resetLoadedMessages()
    messageStore.getMessagesFromDirect({
      username: userStore.selectedDirect,
      from: 0,
      limit: loadedMessages
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
    resetLoadedMessages()
    messageStore.getMessagesFromChannel({
      serverId: userStore.selectedChannel[0],
      channelId: userStore.selectedChannel[1],
      from: 0,
      limit: loadedMessages
    })
  }
)

function handleScroll() {
  const bottomContent = document.getElementsByClassName('scrolling-area')[0]
  if (
    bottomContent.scrollTop - 5 <= -(bottomContent.scrollHeight - bottomContent.clientHeight) &&
    areMessageLoaded.value
  ) {
    areMessageLoaded.value = false
    setTimeout(() => {
      if (userStore.inContentArea == ContentArea.Direct) {
        messageStore.getMessagesFromDirect(
          {
            username: userStore.selectedDirect.toString(),
            from: loadedMessages,
            limit: 10
          },
          true
        )
      } else if (userStore.inContentArea == ContentArea.Channel) {
        messageStore.getMessagesFromChannel(
          {
            serverId: userStore.selectedChannel[0],
            channelId: userStore.selectedChannel[1],
            from: loadedMessages,
            limit: 10
          },
          true
        )
      }
      incrementLoadedMessages()
      areMessageLoaded.value = true
    }, 500)
  }
}

onMounted(() => {
  resetLoadedMessages()
})
</script>

<template>
  <q-page-container padding>
    <q-page>
      <template v-if="!areMessageLoaded">
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
            <!-- if sender is the user show the image, default image otherwise -->
            <q-chat-message
              :name="message.sender"
              :text="[message.content]"
              :sent="userStore.username == message.sender"
              :avatar="
                userStore.username == message.sender
                  ? userStore.photo
                  : message.sender.charAt(0).toUpperCase()
              "
            />
          </div>
        </div>
        <div id="last"></div>
      </q-infinite-scroll>
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
