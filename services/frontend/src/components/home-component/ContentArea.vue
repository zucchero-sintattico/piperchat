<script setup lang="ts">
import MessageInput from '@/components/home-component/MessageInput.vue'
</script>

<template>
  <!--Message-->
  <div class="q-pa-m">
    <q-layout view="lHh Lpr lFf" container style="height: 1000px">
      <q-header>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
          </q-avatar>
          <q-toolbar-title> Jane </q-toolbar-title>
        </q-toolbar>
      </q-header>
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
    </q-layout>
    <MessageInput />
  </div>
</template>

<style scoped lang="sass"></style>
