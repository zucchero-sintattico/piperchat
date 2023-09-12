<script setup lang="ts">
const props = defineProps(['errorMessage'])
</script>

<template>
  <q-banner inline-actions class="text-white bg-red error-banner">
    Login error: {{ props.errorMessage }}
  </q-banner>
</template>

<style scoped>
.error-banner {
  position: absolute;
  bottom: 5px;
  width: 50%;
  border-radius: 1em;
}

:deep(.q-banner__content) {
  font-size: 1.5em;
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
