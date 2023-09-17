<template>
  <q-item v-for="index in 10" :key="index">
    <q-card bordered class="bg-red-3">
      <q-card-section>
        <div class="text-h6">Service</div>
      </q-card-section>

      <q-card-section class="q-pt-none"> Service Name </q-card-section>
    </q-card>
  </q-item>
</template>
