<script setup lang="ts">
import HorizontalUser from './horizontal-component/HorizontalUser.vue'
</script>
<template>
  <q-scroll-area visible class="col bg-secondary">
    <div class="column">
      <div class="col">
        <q-item>
          <q-item-label size="50px" class="text-white text-bold">Directs</q-item-label>
        </q-item>

        <q-list bordered separator class="text-white text-h5" v-for="user in 10" :key="user">
          <HorizontalUser :name="user" icon="chat" />
        </q-list>
      </div>
    </div>
  </q-scroll-area>
</template>
