<script setup lang="ts">
import { ref } from 'vue'

const message = ref('')

function sendMessage() {
  console.log(message.value)
  // TODO
}

function deleteMessage() {
    message.value = ""
}
</script>

<template>
  <div class="foot">
    <q-input class="textfield" filled v-model="message" label="Write...">
      <template v-slot:before>
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/avatar.png" />
        </q-avatar>
      </template>

      <template v-slot:append>
        <q-icon v-if="message !== ''" name="close" @click="deleteMessage" class="cursor-pointer" />
      </template>

      <template v-slot:after>
        <q-btn round dense flat icon="send" color="primary" @click="sendMessage" />
      </template>
    </q-input>
  </div>
</template>

<style scoped>
.foot {
  position: sticky;
  bottom: 0;
}

/* make its background blurred */
.textfield{
    background-color: gainsboro

   
}

.btnn {
  background-color: var(--primary);
}
</style>
