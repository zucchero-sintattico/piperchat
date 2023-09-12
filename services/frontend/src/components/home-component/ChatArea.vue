<script setup lang="ts"></script>

<template>
  <q-page-container>
    <q-page reverse padding>
      <div v-for="n in 10" :key="n">
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

      <!-- place QPageScroller at end of page -->
      <q-page-scroller reverse position="top" :scroll-offset="20" :offset="[0, 18]">
        <q-btn fab icon="keyboard_arrow_down" color="primary" />
      </q-page-scroller>
    </q-page>
  </q-page-container>
</template>
