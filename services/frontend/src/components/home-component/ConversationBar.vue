<script setup lang="ts">
import ServerList from './ServerList.vue'
import DirectsList from './DirectsList.vue'
import ChannelsList from './ChannelsList.vue'
import { ref } from 'vue'

const areDirectVisible = ref(true)
console.log(areDirectVisible.value)
</script>
<template>
  <q-drawer>
    <div class="row no-wrap left-menu bg-dark">
      <ServerList
        v-on:OpenChannels="areDirectVisible = false"
        v-on:OpenDirects="areDirectVisible = true"
      />

      <DirectsList v-if="areDirectVisible" />
      <ChannelsList v-if="!areDirectVisible" />
    </div>
  </q-drawer>
</template>
