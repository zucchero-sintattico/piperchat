<script setup lang="ts">
import { computed } from 'vue'
import { BannerColor } from './BannerColor'

interface Props {
  active: boolean
  color: BannerColor
  content: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:active'])

const active = computed({
  get() {
    return props.active
  },
  set() {
    emit('update:active')
  }
})
</script>

<template>
  <!-- start Request Ok -->
  <q-dialog v-model="active" seamless position="bottom">
    <q-card :class="props.color" class="text-h6 text-white q-px-xl q-py-md">
      {{ props.content }}
    </q-card>
  </q-dialog>
  <!-- end Request Ok -->
</template>
