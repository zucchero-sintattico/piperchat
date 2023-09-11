<script setup lang="ts"></script>

<template>
  <div class="col-4 bg-dark q-pa-md scroll">
    <div class="column items-center">
      <div v-for="n in 100" :key="n" class="col q-mt-md">
        <q-avatar color="accent" text-color="dark">{{ n }}</q-avatar>
      </div>
    </div>
  </div>
</template>
