<script setup lang="ts"></script>

<template>
  <div class="column">
    <q-item>
      <q-avatar color="primary" text-color="accent">
        <q-icon name="chat" size="1.5rem" />
      </q-avatar>
    </q-item>

    <q-separator color="accent" inset />

    <q-scroll-area visible class="col bg-dark">
      <div v-for="n in 40" :key="n" class="col">
        <q-item>
          <q-avatar color="accent" text-color="dark">{{ n }}</q-avatar>
        </q-item>
      </div>
    </q-scroll-area>
  </div>
</template>
