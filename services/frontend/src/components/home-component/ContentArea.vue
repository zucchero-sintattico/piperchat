<script setup lang="ts">
</script>
<template>
    <div class="q-ma-md">
      <q-scroll-area style="height: 200px; max-width: 100%;">
        <div class="q-pa-md row justify-center">
            <div style="width: 100%; max-width: 60%">
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
      </q-scroll-area>
      <q-input
        outlined
        placeholder="Type a message..."
        v-model="message"
        @keyup.enter="sendMessage"></q-input>
        <q-btn
        color="primary"
        label="Send"
        @click="sendMessage"
        />
    </div>
</template>