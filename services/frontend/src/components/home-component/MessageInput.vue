<script setup lang="ts">
import { ref } from 'vue'

const message = ref('')

function sendMessage() {
  console.log(message.value)
  // TODO
}
</script>

<template>
  <div class=" justify-center foot">
    <q-input filled class="full-width full-height" v-model="message" label="Write...">
      <template v-slot:before>
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/avatar.png" />
        </q-avatar>
      </template>

      <template v-slot:hint>
        <q-icon v-if="message !== ''" name="close" @click="sendMessage" />
      </template>

      <template v-slot:after>
        <q-btn round dense flat icon="send" color="primary" />
      </template>
    </q-input>
  </div>
</template>

<style scoped>
.foot {
  position: sticky;
  bottom: 0;
  background-color: lightgray;
}

.textfield {
  background-color: white;
}

.btnn {
  background-color: var(--primary);
}
</style>
