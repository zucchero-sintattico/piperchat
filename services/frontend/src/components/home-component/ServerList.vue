<script setup lang="ts">
const event = defineEmits<{
  (e: 'OpenChannels'): () => void
  (e: 'OpenDirects'): () => void
}>()

function OpenChannels() {
  event('OpenChannels')
}

function OpenDirects() {
  event('OpenDirects')
}
</script>

<template>
  <div class="column">
    <q-item>
      <q-btn size="20px" color="primary" round icon="chat" @click="OpenDirects" />
    </q-item>

    <q-separator color="accent" inset />

    <q-scroll-area visible class="col bg-dark">
      <div v-for="n in 40" :key="n" class="col">
        <q-item>
          <q-btn
            size="20px"
            color="accent"
            round
            :label="n"
            text-color="primary"
            @click="OpenChannels"
          />
        </q-item>
      </div>
    </q-scroll-area>
  </div>
</template>
