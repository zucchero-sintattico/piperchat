<script setup lang="ts">
import { ref } from 'vue'

const message = ref('')

function sendMessage() {
  console.log(message.value)
  // TODO
}

function deleteMessage() {
  message.value = ''
}
</script>

<template>
  <div class="foot blurred">
    <q-input class="textfield" filled v-model="message" label="Write...">
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
