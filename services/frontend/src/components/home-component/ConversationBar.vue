<script setup lang="ts">
import ServerList from './ServerList.vue'
import DirectsList from './DirectsList.vue'
import ChannelsList from './ChannelsList.vue'
import { ref } from 'vue'

const areDirectVisible = ref(true)

function openChannel(channel: number) {
  areDirectVisible.value = false
  console.log(channel)
}
</script>
<template>
  <q-drawer>
    <div class="row no-wrap left-menu bg-dark">
      <ServerList v-on:openChannel="openChannel" v-on:openDirects="areDirectVisible = true" />

      <DirectsList v-if="areDirectVisible" />
      <ChannelsList v-else />
    </div>
  </q-drawer>
</template>
