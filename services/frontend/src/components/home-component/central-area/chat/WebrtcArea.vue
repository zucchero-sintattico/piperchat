<script setup lang="ts">
import { useUserStore, ContentArea } from '@/stores/user'
import { computed } from 'vue'
const userStore = useUserStore()
const toShow = computed(() => userStore.inContentArea == ContentArea.Multimedia)
</script>

<template>
  <q-page-container padding v-if="toShow">
    <q-page>
      <div v-if="toShow">
        <video ref="localVideo" autoplay></video>
        <video ref="remoteVideo" autoplay></video>
      </div>
    </q-page>
  </q-page-container>
</template>
