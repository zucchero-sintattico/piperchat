<script setup lang="ts">
import { useUserStore, ContentArea } from '@/stores/user'
import { computed, ref } from 'vue'
import NewChannelForm from './form/NewChannelForm.vue'
import { CreateChannelApi } from '@api/piperchat/channel'
import { useServerStore } from '@/stores/server'
import HorizontalChannel from './horizontal-component/HorizontalChannel.vue'
import HorizontalUser from './horizontal-component/HorizontalUser.vue'
import ServerMenu from './menu/ServerMenu.vue'
import { BannerColor } from '@/components/utils/BannerColor'
import BottomPopUp from '@/components/utils/BottomPopUp.vue'

const userStore = useUserStore()
const serverStore = useServerStore()

const isNewChannelFormActive = ref(false)
const serverSettingMenuActive = ref(false)
const dialogLeavesServer = ref(false)

function setChannelContent(channelId: string, contentArea: ContentArea) {
  console.log('Switched')
  userStore.inContentArea = contentArea
  userStore.setActiveChannel(channelId)
}
const selectedServer = computed(() => {
  return serverStore.servers.find((s) => s.id == userStore.selectedServerId)
})

const amITheOwner = computed(() => {
  return selectedServer.value?.owner == userStore.username
})

const BANNER_TIMEOUT = 3000
const resultBanner = ref(false)
const colorBanner = ref(BannerColor.OK)
const contentBanner = ref('')
function popUpBanner(error?: string) {
  if (error) {
    colorBanner.value = BannerColor.ERROR
    contentBanner.value = error
  } else {
    colorBanner.value = BannerColor.OK
    contentBanner.value = 'Server created successfully'
  }
  resultBanner.value = true
  setTimeout(() => {
    resultBanner.value = false
  }, BANNER_TIMEOUT)
  isNewChannelFormActive.value = false
}

function leaveServer() {
  if (selectedServer.value?.id) {
    serverStore.leaveServer(selectedServer.value.id as string)
    popUpBanner('You left the server')
  }
}
</script>

<template>
  <q-scroll-area
    class="col bg-secondary fit"
    content-style="position: relative !important"
    content-active-style="position: relative !important"
  >
    <div class="column">
      <div class="col fit">
        <q-item :clickable="amITheOwner" @click="serverSettingMenuActive = true">
          <h4 class="q-ma-none text-white ellipsis">
            <q-btn
              v-if="amITheOwner == true"
              icon="settings"
              color="primary"
              round
              class="q-mr-sm q-mb-sm"
            />
            <q-btn
              v-if="amITheOwner != true"
              round
              icon="exit_to_app"
              class="q-mr-sm q-mb-sm"
              color="primary"
              @click="dialogLeavesServer = true"
            />
            {{ selectedServer?.name }}
          </h4>
        </q-item>

        <ServerMenu v-model:active="serverSettingMenuActive" />

        <!-- start Create new server -->
        <div class="q-ma-md" style="text-align: center">
          <q-btn
            color="primary"
            label="channel"
            :rounded="true"
            icon="add"
            style="justify-content: space-between"
            @click="isNewChannelFormActive = true"
          />
        </div>

        <q-dialog v-model="dialogLeavesServer">
          <q-card>
            <q-card-section class="items-center q-gutter-sm">
              <div class="q-ma-none text-h5">Are you sure you want to leave this server?</div>
              <q-btn
                no-caps
                label="Leave"
                color="red justify center"
                v-close-popup
                @click="leaveServer"
              />
              <q-btn no-caps label="Close" color="primary justify center" v-close-popup />
            </q-card-section>
          </q-card>
        </q-dialog>

        <BottomPopUp v-model:active="resultBanner" :content="contentBanner" :color="colorBanner" />

        <q-dialog
          v-model="isNewChannelFormActive"
          persistent
          transition-show="scale"
          transition-hide="scale"
        >
          <NewChannelForm @close="isNewChannelFormActive = false" @result="popUpBanner($event)" />
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
          :key="channel.id"
          @click="setChannelContent(channel.id, ContentArea.Channel)"
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
          :key="channel.id"
        >
          <HorizontalChannel
            :name="channel.name"
            icon="volume_up"
            clickable
            @click="setChannelContent(channel.id, ContentArea.Multimedia)"
          />
          <!-- "userStore.setActiveChannel(channel.id)" -->

          <q-list dense v-for="j in 3" :key="j">
            <HorizontalUser name="User" photo="" />
          </q-list>
        </q-list>
        <!-- end Multimedia channels -->
      </div>
    </div>
  </q-scroll-area>
</template>
