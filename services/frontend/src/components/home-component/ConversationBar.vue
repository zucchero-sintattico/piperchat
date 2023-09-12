<script setup lang="ts">
import ServerList from './ServerList.vue'
import DirectsList from './DirectsList.vue'
import ChannelsList from './ChannelsList.vue'
</script>
<template>
  <q-drawer>
    <div class="row no-wrap left-menu bg-dark">
      <ServerList />
      <!--<<ChannelsList />-->
      <DirectsList />
    </div>
  </q-drawer>
</template>
