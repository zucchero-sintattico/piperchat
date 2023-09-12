<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps(['errorMessage'])

// This component only accept v-model
const unused = ref(true)
</script>

<template>
  <q-dialog v-model="unused" seamless position="bottom">
    <q-card style="width: 100%">
      <q-card-section class="row items-center no-wrap bg-red" style="font-size: 1.1em">
        <q-banner inline-actions class="text-white bg-red error-banner">
          {{ props.errorMessage }}
        </q-banner>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
:deep(.q-banner__content) {
  font-size: 1.5em;
}

:deep(.q-card__section) {
  height: 5em;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
