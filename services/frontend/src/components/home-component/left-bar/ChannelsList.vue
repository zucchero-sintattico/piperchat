<script setup lang="ts">
import { ContentArea, useUserStore } from '@/stores/user'
import { ref } from 'vue'
import NewChannelForm from './NewChannelForm.vue'
import { CreateChannelApi } from '@api/piperchat/channel'

const userStore = useUserStore()

const isNewChannelFormActive = ref(false)

function setChannelContent(channelId: string) {
  console.log('Switched')
  userStore.inContentArea = ContentArea.Channel
  userStore.selectedChannel = [userStore.selectedServer._id, channelId]
}
</script>

<template>
  <q-scroll-area visible class="col bg-secondary">
    <div class="column">
      <div class="col">
        <h4 class="q-ma-md text-white">{{ userStore.selectedServer.name }}</h4>

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

        <q-separator color="accent" style="height: 2px" inset />

        <div
          v-for="channel in userStore.selectedServer.channels?.filter(
            (c) => c.channelType == CreateChannelApi.ChannelType.Messages
          )"
          :key="channel._id"
          @click="setChannelContent(channel._id)"
        >
          <q-btn class="full-width" no-caps flat color="secondary">
            <q-item-section class="text-white" avatar>
              <q-icon name="chat" />
            </q-item-section>
            <q-item-section align="left" class="text-white"
              >Chanel chat {{ channel.name }}</q-item-section
            >
          </q-btn>
        </div>

        <q-separator color="accent" style="height: 2px" inset />

        <div
          v-for="channel in userStore.selectedServer.channels?.filter(
            (c) => c.channelType == CreateChannelApi.ChannelType.Messages
          )"
          :key="channel._id"
        >
          <q-list>
            <q-expansion-item dark icon="volume_up" :label="channel.name" default-opened>
              <div v-for="n in 2" :key="n">
                <q-btn class="full-width" no-caps flat color="secondary">
                  <q-item-section avatar>
                    <q-avatar size="30px">
                      <img src="https://cdn.quasar.dev/img/avatar3.jpg" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section class="text-white">Lily {{ n }}</q-item-section>
                </q-btn>
              </div>
            </q-expansion-item>
          </q-list>
        </div>
      </div>
    </div>
  </q-scroll-area>
</template>

<style lang="sass"></style>
