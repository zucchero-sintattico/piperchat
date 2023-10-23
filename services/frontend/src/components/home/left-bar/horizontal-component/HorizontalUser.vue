<script setup lang="ts">
const props = defineProps<{
  name: string
  photo?: string
  online?: boolean
}>()
</script>

<template>
  <q-item clickable style="font-size: large" class="items-center">
    <q-avatar size="30px" class="q-mr-md q-mb-sm">
      <img v-if="props.photo == ''" src="src/assets/default-user-photo.png" />
      <img v-else-if="props.photo == undefined" src="src/assets/default-user-photo.png" />
      <img v-else :src="props.photo" />
    </q-avatar>

    <q-icon v-if="props.online" name="fiber_manual_record" color="green" />

    <q-item-section>
      <div class="ellipsis fit">
        {{ props.name }}
      </div>
    </q-item-section>
  </q-item>
</template>
