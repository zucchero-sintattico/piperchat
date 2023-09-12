<script setup lang="ts">
import { ref } from 'vue'
import { useMessageStore } from '@/stores/messages'

const message = ref('')
const messageStore = useMessageStore()

async function sendMessage() {
  if (message.value != '') {
    await messageStore.sendMessage('me', message.value)
    message.value = ''
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
        <q-btn round dense flat icon="send" color="primary" @click="sendMessage" />
      </template>
    </q-input>
  </div>
</template>

<style scoped lang="sass">
.foot
  position: sticky
  bottom: 0
</style>
