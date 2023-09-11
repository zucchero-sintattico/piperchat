<script setup lang="ts"></script>

<template>
  <div class="q-ma-md full-height chat">
    <q-scroll-area visible class="full-height">
      <div class="q-pa-md row justify-center">
        <div v-for="n in 10" :key="n">
          <q-chat-message
            name="me"
            avatar="https://cdn.quasar.dev/img/avatar1.jpg"
            :text="['hey, how are you?']"
            sent
            bg-color="primary"
            text-color="white"
          />
          <q-chat-message
            name="Jane"
            avatar="https://cdn.quasar.dev/img/avatar2.jpg"
            :text="['doing fine, how r you?']"
          />
        </div>
      </div>
    </q-scroll-area>
    <div class="row justify-center" style="bottom: sticky">
      <q-input
        style="width: 90%"
        outlined
        placeholder="Type a message..."
        v-model="message"
        @keyup.enter="sendMessage"
      ></q-input>
      <q-btn color="primary" round dense flat icon="send" @click="sendMessage" />
    </div>
  </div>
</template>

<style></style>
