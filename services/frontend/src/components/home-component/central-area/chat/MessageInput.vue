<script setup lang="ts">
import { ref } from 'vue'
import { useMessageStore } from '@/stores/messages'
import { ContentArea, useUserStore } from '@/stores/user'

const message = ref('')
const messageStore = useMessageStore()
const userStore = useUserStore()

async function sendMessage() {
  if (userStore.inContentArea == ContentArea.Direct) {
    await messageStore.sendMessageOnDirect(
      {
        content: message.value,
        username: userStore.selectedDirect
      },
      () => console.log('Sent'),
      () => console.log('Error')
    )
  } else if (userStore.inContentArea == ContentArea.Channel) {
    await messageStore.sendMessageOnChannel(
      {
        serverId: userStore.selectedChannel[0],
        channelId: userStore.selectedChannel[1],
        content: message.value
      },
      () => console.log('Sent'),
      () => console.log('Error')
    )
  }
}

function deleteMessage() {
  message.value = ''
}
</script>

<template>
  <div class="foot blurred">
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
