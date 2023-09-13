<script setup lang="ts">
import { useServerStore } from '@/stores/server'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import { CreateChannelApi } from '@api/piperchat/channel'

const event = defineEmits<{
  (e: 'close'): void
}>()

const userStore = useUserStore()
const serverStore = useServerStore()

const name = ref('')
const description = ref('')
const channelType = ref(CreateChannelApi.ChannelType.Messages)

async function onSubmit() {
  const id = userStore.selectedServer._id

  await serverStore.createChannel(name.value, description.value, channelType.value, id as string)
  event('close')
}
</script>

<template>
  <div class="q-pa-xl bg-white">
    <q-form class="q-gutter-md" @submit="onSubmit">
      <h2 class="text-h3">Create a new channel in {{ userStore.selectedServer.name }} server</h2>

      <q-input
        filled
        v-model="name"
        label="Server name"
        hint="Name of your server"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        filled
        v-model="description"
        label="Server description"
        hint="Description of your server"
        lazy-rules
      />

      <div class="q-gutter-sm text-center">
        <q-radio
          defa
          v-model="channelType"
          :val="CreateChannelApi.ChannelType.Messages"
          label="Message"
        />
        <q-radio
          v-model="channelType"
          :val="CreateChannelApi.ChannelType.Multimedia"
          label="Multimedia"
        />
      </div>

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn
          label="Cancel"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
          @click="event('close')"
        />
      </div>
    </q-form>
  </div>
</template>
