<script setup lang="ts">
import StatusCard from '@/components/monitoring/StatusCard.vue'
</script>

<template>
  <!-- Template for the grid of status cards -->
  <div class="main-container">
    <div class="state-grid">
      <StatusCard />
    </div>
  </div>
</template>

<style scoped lang="scss">
.state-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 1rem;
  justify-items: center;
  align-items: center;
  margin: 0 auto;
  padding: 1rem;
}
</style>
