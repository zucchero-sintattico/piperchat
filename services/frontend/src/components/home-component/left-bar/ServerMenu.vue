<script setup lang="ts">
import { computed, ref } from 'vue'
import HorizontalChannel from './horizontal-component/HorizontalChannel.vue'
import HorizontalUser from './horizontal-component/HorizontalUser.vue'
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

const serverTab = ref('setting')

const selectedServer = computed(() => {
  return serverStore.servers.find((s) => s._id == userStore.selectedServerId)
})

async function deleteChannel(channel: string) {
  // TODO
}

async function kickUser(user: string) {
  // TODO
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
                  @click="deleteChannel(channel._id)"
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
                  @click="kickUser(user)"
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
