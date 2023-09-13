<script setup lang="ts">
import { ref } from 'vue'
import NewServerForm from './form/NewServerForm.vue'
import { SelectedTab, useUserStore } from '@/stores/user'
import { useServerStore } from '@/stores/server'
import type { GetServersApi } from '@api/piperchat/server'

const userStore = useUserStore()
const serverStore = useServerStore()

const isNewServerFormActive = ref(false)

function setActiveServer(server: GetServersApi.Responses.Server) {
  userStore.selectedServerId = server._id
  userStore.selectedTab = SelectedTab.Servers
}
</script>

<template>
  <div class="column">
    <q-item>
      <q-btn
        size="20px"
        color="primary"
        round
        icon="chat"
        @click="userStore.selectedTab = SelectedTab.Directs"
      />
    </q-item>

    <q-separator color="accent" inset />

    <!-- start Create new server -->
    <q-item>
      <q-btn size="20px" color="primary" round icon="add" @click="isNewServerFormActive = true" />
    </q-item>

    <q-dialog
      v-model="isNewServerFormActive"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <NewServerForm @close="isNewServerFormActive = false" />
    </q-dialog>
    <!-- end Create new server -->

    <q-scroll-area visible class="col bg-dark">
      <div v-for="server in serverStore.servers" :key="server._id" class="col">
        <q-item>
          <q-btn
            size="20px"
            color="accent"
            round
            :label="server.name.charAt(0).toUpperCase()"
            text-color="primary"
            @click="setActiveServer(server)"
          />
          <q-tooltip
            class="q-pa-md text-h4 bg-black"
            anchor="center right"
            self="center start"
            transition-duration="0"
          >
            {{ server.name }}
          </q-tooltip>
        </q-item>
      </div>
    </q-scroll-area>
  </div>
</template>
