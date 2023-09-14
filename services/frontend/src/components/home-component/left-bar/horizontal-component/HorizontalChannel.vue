<script setup lang="ts">
const props = defineProps(['name', 'icon', 'clickable'])
</script>

<template>
  <q-item style="align-items: center" :clickable="props.clickable">
    <q-icon :name="props.icon" class="q-pr-md" />
    <q-item-section class="ellipsis">{{ props.name }}</q-item-section>
  </q-item>
</template>
