<script setup lang="ts">
import { useMonitoringStore } from '@/stores/monitoring'
import { computed } from 'vue'
import { onMounted } from 'vue'

const monitoringStore = useMonitoringStore()

onMounted(() => {
  monitoringStore.getServicesStatus()
})
</script>
<template>
  <q-item v-for="service in monitoringStore.serviceStatus" :key="service">
    <q-card bordered class="bg-red-3">
      <q-card-section>
        <div class="text-h6">{{ service }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none"> Service Name </q-card-section>
    </q-card>
  </q-item>
</template>
