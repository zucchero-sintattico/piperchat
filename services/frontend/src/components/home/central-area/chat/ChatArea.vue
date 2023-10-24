<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useMessageStore } from '@/stores/messages'
import { useUserStore } from '@/stores/user'
import MessageInput from './MessageInput.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const messageStore = useMessageStore()
const userStore = useUserStore()

async function handleScroll() {
  const bottomContent = document.getElementsByClassName('scrolling-area')[0]
  if (bottomContent.scrollTop - 5 <= -(bottomContent.scrollHeight - bottomContent.clientHeight)) {
    messageStore.loadNewMessages()
  }
}

onMounted(() => {
  messageStore.resetMessagesNumber()
})
</script>

<template>
  <q-page-container padding v-if="appStore.isMessageSection">
    <q-page>
      <div
        class="row justify-center q-my-md spinner-overlay"
        v-if="messageStore.loadingNewMessages"
      >
        <q-spinner color="primary" name="dots" size="40px" />
      </div>
      <q-infinite-scroll reverse class="bottom-content scrolling-area" v-on:scroll="handleScroll">
        <div v-if="appStore.isMessageSection">
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
                  : messageStore.usersPhotos.get(message.sender)
              "
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

.spinner-overlay {
  position: absolute;
  top: 0%; /* Adjust as needed */
  left: 50%; /* Adjust as needed */
  transform: translate(-50%, -50%);
  z-index: 999; /* Ensure it's above other elements */
}
</style>
