<script setup lang="ts">
import { useMonitoringStore } from '@/stores/monitoring'
import { onMounted } from 'vue'

const monitoringStore = useMonitoringStore()

onMounted(() => {
  monitoringStore.getServicesStatus()
  window.setInterval(monitoringStore.getServicesStatus, 10000)
})
</script>

<template>
  <!-- Template for the status card -->
  <q-item v-for="service in monitoringStore.serviceStatus" :key="service">
    <q-card bordered :class="service.status">
      <q-card-section>
        <div class="text-h6">{{ service.service }}</div>
      </q-card-section>

      <q-card-section>Status: {{ service.status }} </q-card-section>
      <q-card-section>Timestamp: {{ service.timestamp }} </q-card-section>
    </q-card>
  </q-item>
</template>

<style scoped lang="scss">
.offline {
  background-color: $red-3;
}

.online {
  background-color: $green-3;
}
</style>
