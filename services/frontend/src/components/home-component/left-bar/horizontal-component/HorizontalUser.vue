<script setup lang="ts">
const props = defineProps(['name', 'photo'])
</script>

<template>
  <q-item clickable style="font-size: large">
    <q-avatar size="30px" class="q-mr-md q-mb-sm">
      <img src="https://cdn.quasar.dev/img/avatar3.jpg" />
    </q-avatar>
    <q-item-section>
      {{ props.name }}
    </q-item-section>
  </q-item>
</template>
