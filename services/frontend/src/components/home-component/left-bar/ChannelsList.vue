<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { computed, ref } from 'vue'
import NewChannelForm from './form/NewChannelForm.vue'
import { CreateChannelApi } from '@api/piperchat/channel'
import { useServerStore } from '@/stores/server'
import HorizontalChannel from './horizontal-component/HorizontalChannel.vue'
import HorizontalUser from './horizontal-component/HorizontalUser.vue'

const userStore = useUserStore()
const serverStore = useServerStore()
const isNewChannelFormActive = ref(false)

const selectedServer = computed(() => {
  return serverStore.servers.find((s) => s._id == userStore.selectedServerId)
})
</script>

<template>
  <q-scroll-area visible class="col bg-secondary">
    <div class="column">
      <div class="col">
        <h4 class="q-ma-md text-white">{{ selectedServer?.name }}</h4>

        <!-- start Create new server -->
        <div class="q-ma-md" style="text-align: center">
          <q-btn
            color="primary"
            label="Create channel"
            icon="add"
            style="justify-content: space-between"
            @click="isNewChannelFormActive = true"
          />
        </div>
        <q-dialog
          v-model="isNewChannelFormActive"
          persistent
          transition-show="scale"
          transition-hide="scale"
        >
          <NewChannelForm @close="isNewChannelFormActive = false" />
        </q-dialog>
        <!-- end Create new server -->

        <!-- start Message channels -->
        <q-list
          bordered
          separator
          class="text-white text-h5"
          v-for="channel in selectedServer?.channels?.filter(
            (c) => c.channelType == CreateChannelApi.ChannelType.Messages
          )"
          :key="channel._id"
        >
          <HorizontalChannel :name="channel.name" icon="chat" clickable />
        </q-list>
        <!-- end Message channels -->

        <!-- start Multimedia channels -->
        <q-list
          bordered
          separator
          class="text-white text-h5"
          v-for="channel in selectedServer?.channels?.filter(
            (c) => c.channelType == CreateChannelApi.ChannelType.Multimedia
          )"
          :key="channel._id"
        >
          <HorizontalChannel
            :name="channel.name"
            icon="volume_up"
            clickable
            @click="userStore.setActiveChannel(channel._id)"
          />

          <q-list dense v-for="j in 3" :key="j">
            <HorizontalUser name="User" photo="https://cdn.quasar.dev/img/avatar3.jpg" />
          </q-list>
        </q-list>
        <!-- end Multimedia channels -->
      </div>
    </div>
  </q-scroll-area>
</template>
