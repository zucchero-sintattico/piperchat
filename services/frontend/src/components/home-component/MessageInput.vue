<script setup lang="ts">
import { ref } from 'vue'

const message = ref('')

function sendMessage() {
  console.log(message.value)
  // TODO
}
</script>

<template>
  <div class="row justify-center foot">
    <q-input
      class="col-11 text"
      outlined
      placeholder="Type a message..."
      v-model="message"
      @keyup.enter="sendMessage"
    ></q-input>
    <q-btn class="col-1 btnn" color="primary" dense flat icon="send" @click="sendMessage" />
  </div>
</template>

<style scoped>
.foot {
  position: sticky;
  bottom: 0;
}

.text {
  background-color: white;
}

.btnn {
  background-color: var(--primary);
}
</style>
