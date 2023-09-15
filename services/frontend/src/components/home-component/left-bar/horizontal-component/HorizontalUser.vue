<script setup lang="ts">
const props = defineProps(['name', 'photo'])
</script>

<template>
  <q-item clickable style="font-size: large">
    <q-avatar size="30px" class="q-mr-md q-mb-sm">
      <img v-if="props.photo == ''" src="src/assets/default-user-photo.png" />
      <img v-else :src="props.photo" />
    </q-avatar>
    <q-item-section>
      <div class="ellipsis fit">
        {{ props.name }}
      </div>
    </q-item-section>
  </q-item>
</template>
