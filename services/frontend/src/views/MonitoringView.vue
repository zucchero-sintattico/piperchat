<script setup lang="ts">
import PageGrid from '@/components/monitoring/PageGrid.vue'
</script>

<template>
  <q-layout view="hHh lpR fFf" class="bg-accent">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title align="center" class="title">
          <router-link to="/" class="avatar-and-title text-white">
            <q-avatar>
              <img src="../assets/piperchat-logo.jpg" />
            </q-avatar>
            <text-overline>Piperchat</text-overline>
          </router-link>
          <text-overline>/monitoring</text-overline>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <page-grid />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="scss">
.title {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: underline none;
}

.avatar-and-title:link {
  text-decoration: none;
}

.avatar-and-title:visited {
  text-decoration: none;
}
</style>
