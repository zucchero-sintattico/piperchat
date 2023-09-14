<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useMessageStore } from '@/stores/messages'
import { ContentArea, useUserStore } from '@/stores/user'

const message = ref('')
const messageStore = useMessageStore()
const userStore = useUserStore()
const shown = ref(false)

async function sendMessage() {
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
          limit: 1000
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
          limit: 1000
        }),
      () => console.log('Error')
    )
  }
}

function deleteMessage() {
  message.value = ''
}

watch(
  () => userStore.inContentArea,
  (newVal) => {
    if (newVal == ContentArea.Direct || newVal == ContentArea.Channel) {
      shown.value = true
    } else {
      shown.value = false
    }
  }
)
</script>

<template>
  <div class="foot blurred" v-if="shown">
    <q-input padding filled v-model="message" label="Write..." @keydown.enter.prevent="sendMessage">
      <template v-slot:append>
        <q-icon v-if="message !== ''" name="close" @click="deleteMessage" class="cursor-pointer" />
      </template>

      <template v-slot:after>
        <q-btn round dense flat icon="send" color="primary" @click="sendMessage" id="send" />
      </template>
    </q-input>
  </div>
</template>

<style scoped lang="sass">
.foot
  position: sticky
  bottom: 0
</style>
