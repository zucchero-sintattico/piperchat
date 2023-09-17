<script setup lang="ts">
import PageGrid from '@/components/monitoring-component/PageGrid.vue'
</script>

<template>
  <q-layout view="hHh lpR fFf" class="bg-accent">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title align="center" class="title">
          <div to="/site" class="avatar-and-title">
            <q-avatar>
              <img src="/site/src/assets/piperchat-logo.jpg" />
            </q-avatar>
            <h1>Piperchat</h1>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <page-grid />
      <router-view />
    </q-page-container>
  </q-layout>
</template>
