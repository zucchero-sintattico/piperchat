<script setup lang="ts">
import MessageInput from '@/components/home-component/MessageInput.vue'
</script>

<template>
  <!--Message-->
  <div class="q-pa-md row justify-center">
    <div v-for="n in 10" :key="n" style="width: 90%; max-width: 100%">
      <q-chat-message
        name="me"
        avatar="https://cdn.quasar.dev/img/avatar1.jpg"
        :text="['hey, how are you?']"
        sent
      />
      <q-chat-message
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar2.jpg"
        :text="['doing fine, how r you?']"
      />
    </div>
  </div>

  <MessageInput />
</template>

<style></style>
