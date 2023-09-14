<script setup lang="ts">
import { computed, ref } from 'vue'
import HorizontalChannel from '../horizontal-component/HorizontalChannel.vue'
import HorizontalUser from '../horizontal-component/HorizontalUser.vue'
import { CreateChannelApi } from '@api/piperchat/channel'
import { useUserStore } from '@/stores/user'
import { useServerStore } from '@/stores/server'

const userStore = useUserStore()
const serverStore = useServerStore()

const BANNER_TIMEOUT = 3000

const props = defineProps(['active'])
const emit = defineEmits(['update:active'])

const active = computed({
  get() {
    return props.active
  },
  set() {
    emit('update:active')
  }
})

const selectedChannel = ref<{ id: string; name: string }>({ id: '', name: '' })
const confirmDeleteChannel = ref(false)

const confirmKickUser = ref(false)
const userToKick = ref('')

const serverTab = ref('setting')

enum Banner {
  OK = 'bg-green',
  ERROR = 'bg-red'
}

const resultBanner = ref(false)
const colorBanner = ref(Banner.OK)
const contentBanner = ref('')
function popUpBanner() {
  resultBanner.value = true
  setTimeout(() => {
    resultBanner.value = false
  }, BANNER_TIMEOUT)
}

const selectedServer = computed(() => {
  return serverStore.servers.find((s) => s._id == userStore.selectedServerId)
})

function setChannelToDelete(channel: { id: string; name: string }) {
  selectedChannel.value = channel
  confirmDeleteChannel.value = true
}

async function deleteSelectedChannel() {
  try {
    await serverStore.deleteChannel(selectedServer.value!._id, selectedChannel.value.id)
    contentBanner.value = 'Channel deleted'
    colorBanner.value = Banner.OK
    popUpBanner()
  } catch (error) {
    contentBanner.value = String(error)
    colorBanner.value = Banner.ERROR
    popUpBanner()
  }
}

function setUserToKick(user: string) {
  userToKick.value = user
  confirmKickUser.value = true
}

async function kickSelectedUser() {
  try {
    await serverStore.kickUser(selectedServer.value!._id, userToKick.value)
    contentBanner.value = 'Channel deleted'
    colorBanner.value = Banner.OK
    popUpBanner()
  } catch (error) {
    contentBanner.value = String(error)
    colorBanner.value = Banner.ERROR
    popUpBanner()
  }
}
</script>

<template>
  <div>
    <!-- start Server pop up -->
    <q-dialog v-model="active">
      <q-card class="container">
        <q-tabs
          v-model="serverTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="setting" label="Settings" />
          <q-tab name="channels" label="Channels" />
          <q-tab name="partecipants" label="Partecipants" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="serverTab" animated>
          <!-- start Setting Tab -->
          <q-tab-panel name="setting">
            <div class="text-h4">Settings</div>
            <!-- TODO -->
          </q-tab-panel>
          <!-- end Setting Tab -->

          <!-- start Channels Tab -->
          <q-tab-panel name="channels">
            <div class="text-h4">Channels</div>
            <q-list v-for="channel in selectedServer?.channels" :key="channel._id">
              <q-item>
                <q-item-section style="font-size: 1.5em">
                  <HorizontalChannel
                    clickable
                    :name="channel.name"
                    :icon="
                      channel.channelType == CreateChannelApi.ChannelType.Messages
                        ? 'chat'
                        : 'volume_up'
                    "
                    class="q-pa-sm"
                  />
                </q-item-section>
                <!-- start Cancel button -->
                <q-btn
                  style="width: fit-content"
                  icon="close"
                  class="bg-red text-white"
                  @click="setChannelToDelete({ id: channel._id, name: channel.name })"
                />
                <!-- start Cancel button -->
              </q-item>
            </q-list>
          </q-tab-panel>
          <!-- end Channels Tab -->

          <!-- start Partecipants Tab -->
          <q-tab-panel name="partecipants">
            <div class="text-h4">Partecipants</div>
            <!-- Display only partecipants, not the owner -->
            <q-list
              v-for="user in selectedServer?.participants.filter((p) => p !== userStore.username)"
              :key="user"
            >
              <q-item>
                <q-item-section style="font-size: 1.5em">
                  <HorizontalUser :name="user" class="q-pa-sm" />
                </q-item-section>
                <!-- start Kick button -->
                <q-btn
                  style="width: fit-content"
                  icon="close"
                  class="bg-red text-white"
                  @click="setUserToKick(user)"
                />
                <!-- start Kick button -->
              </q-item>
            </q-list>
          </q-tab-panel>
          <!-- end Partecipants Tab -->
        </q-tab-panels>
      </q-card>
    </q-dialog>
    <!-- end Friends pop up -->

    <!-- start Confirm pop up -->
    <q-dialog v-model="confirmDeleteChannel">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="black" text-color="white" />
          <span class="q-ml-sm"
            >Are you sure to delete
            <strong>{{ selectedChannel.name }}</strong>
            channel?
          </span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            label="I want to delete the channel"
            color="red"
            v-close-popup
            @click="deleteSelectedChannel"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- end Confirm pop up -->

    <!-- start Confirm pop up -->
    <q-dialog v-model="confirmKickUser">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="black" text-color="white" />
          <span class="q-ml-sm">
            Are you sure to kick
            <strong>{{ userToKick }}</strong>
            ?
          </span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            label="I want to delete the channel"
            color="red"
            v-close-popup
            @click="kickSelectedUser"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- end Confirm pop up -->

    <!-- start Request Ok -->
    <q-dialog v-model="resultBanner" seamless position="bottom">
      <q-card :class="colorBanner" class="text-h6 text-white q-px-xl q-py-md">
        {{ contentBanner }}
      </q-card>
    </q-dialog>
    <!-- end Request Ok -->
  </div>
</template>

<style scoped>
.container {
  min-width: 30vw;
}

@media screen and (max-width: 1200px) {
  .container {
    min-width: 80vw;
  }
}
</style>
