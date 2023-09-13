<script setup lang="ts">
import { ref } from 'vue'
import NewServerForm from './NewServerForm.vue'

const event = defineEmits<{
  (e: 'openChannel', id: number): void
  (e: 'openDirects'): void
}>()

const isNewServerFormActive = ref(false)
</script>

<template>
  <div class="column">
    <q-item>
      <q-btn size="20px" color="primary" round icon="chat" @click="event('openDirects')" />
    </q-item>

    <q-separator color="accent" inset />

    <!-- start Create new server -->
    <q-item>
      <q-btn size="20px" color="primary" round icon="add" @click="isNewServerFormActive = true" />
    </q-item>

    <q-dialog
      v-model="isNewServerFormActive"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <NewServerForm @close="isNewServerFormActive = false" />
    </q-dialog>
    <!-- end Create new server -->

    <q-scroll-area visible class="col bg-dark">
      <div v-for="n in 40" :key="n" class="col">
        <q-item>
          <q-btn
            size="20px"
            color="accent"
            round
            :label="n"
            text-color="primary"
            @click="event('openChannel', n)"
          />
        </q-item>
      </div>
    </q-scroll-area>
  </div>
</template>
