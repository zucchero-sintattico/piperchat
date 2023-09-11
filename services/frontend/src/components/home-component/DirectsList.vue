<script setup lang="ts"></script>
<template>
  <q-scroll-area visible class="col bg-secondary">
    <div class="column">
      <div class="col">
        <q-item>
          <q-item-label size="50px" class="text-white text-bold">Directs</q-item-label>
        </q-item>

        <div v-for="n in 60" :key="n">
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar3.jpg" />
              </q-avatar>
            </q-item-section>
            <q-item-section class="text-white">Lily {{ n }}</q-item-section>
          </q-item>
        </div>
      </div>
    </div>
  </q-scroll-area>
</template>
