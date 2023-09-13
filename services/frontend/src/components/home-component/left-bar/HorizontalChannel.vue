<script setup lang="ts">
const props = defineProps(['name', 'icon'])
</script>

<template>
  <q-item style="align-items: center" clickable>
    <q-icon :name="props.icon" class="q-pr-md" />
    <q-item-section>{{ props.name }}</q-item-section>
  </q-item>
</template>
