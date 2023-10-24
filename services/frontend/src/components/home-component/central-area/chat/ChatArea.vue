<script setup lang="ts">
import { watch, ref, onMounted, computed } from 'vue'
import { useMessageStore } from '@/stores/messages'
import { ContentArea, useUserStore } from '@/stores/user'
import { useServerStore } from '@/stores/server'

const messageStore = useMessageStore()
const serverStore = useServerStore()
const userStore = useUserStore()
const usersPhotos = ref(new Map<string, string>())

const areMessagesLoaded = ref(true)
const messagesLimit = 30

let tempLastScrollPosition = 0
let loadedMessages: number

function resetLoadedMessages() {
  loadedMessages = messagesLimit
}

function incrementLoadedMessages() {
  loadedMessages += messagesLimit
}

/**
 * Fetches the photos of the users in the current content area
 */
async function fetchUsersPhotos() {
  // If the user is in a direct, fetch the photo of the other user
  if (userStore.inContentArea == ContentArea.Direct && userStore.selectedDirect != null) {
    if (!usersPhotos.value.has(userStore.selectedDirect)) {
      const photo = await userStore.getUserPhoto(userStore.selectedDirect)
      usersPhotos.value.set(userStore.selectedDirect, photo?.toString() || '')
    }
  }
  // If the user is in a channel, fetch the photos of all the partecipants of the server
  if (userStore.inContentArea == ContentArea.Channel && userStore.selectedDirect != null) {
    for (const user of await serverStore.getServerPartecipants(userStore.selectedServerId)) {
      if (!usersPhotos.value.has(user)) {
        const photo = await userStore.getUserPhoto(user)
        usersPhotos.value.set(user, photo?.toString() || '')
      }
    }
  }
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

//if was send or receve a message, reset the scrolling position
watch(
  () => messageStore.messages[messageStore.messages.length - 1],
  async () => {
    resetLoadedMessages()
    tempLastScrollPosition = 0
  }
)

/**
 * When the user changes the selected direct,
 * refresh the messages and the photos
 */
watch(
  () => userStore.selectedDirect,
  async () => {
    console.log('New direct: ' + userStore.selectedDirect)
    resetLoadedMessages()
    await messageStore.getMessagesFromDirect({
      username: userStore.selectedDirect,
      from: 0,
      limit: loadedMessages
    })
    await fetchUsersPhotos()
  }
)

/**
 * When the user changes the selected channel,
 * refresh the messages and the photos
 */
watch(
  () => userStore.selectedChannel,
  async () => {
    console.log('New channel: ' + userStore.selectedChannel)
    resetLoadedMessages()
    await messageStore.getMessagesFromChannel({
      serverId: userStore.selectedChannel[0],
      channelId: userStore.selectedChannel[1],
      from: 0,
      limit: loadedMessages
    })
    await fetchUsersPhotos()
  }
)

function handleScroll() {
  const bottomContent = document.getElementsByClassName('scrolling-area')[0]
  if (
    bottomContent.scrollTop - 5 <= -(bottomContent.scrollHeight - bottomContent.clientHeight) &&
    areMessagesLoaded.value &&
    tempLastScrollPosition >= bottomContent.scrollTop
  ) {
    areMessagesLoaded.value = false
    setTimeout(() => {
      if (userStore.inContentArea == ContentArea.Direct) {
        messageStore.getMessagesFromDirect(
          {
            username: userStore.selectedDirect.toString(),
            from: loadedMessages,
            limit: messagesLimit
          },
          true
        )
      } else if (userStore.inContentArea == ContentArea.Channel) {
        messageStore.getMessagesFromChannel(
          {
            serverId: userStore.selectedChannel[0],
            channelId: userStore.selectedChannel[1],
            from: loadedMessages,
            limit: messagesLimit
          },
          true
        )
      }
      incrementLoadedMessages()
      areMessagesLoaded.value = true
    }, 500)
  }
  tempLastScrollPosition = bottomContent.scrollTop
}

onMounted(() => {
  resetLoadedMessages()
})
</script>

<template>
  <q-page-container padding>
    <q-page>
      <template v-if="!areMessagesLoaded">
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
                message.sender == userStore.username
                  ? userStore.photo
                  : usersPhotos.get(message.sender)
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
