<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { CreateChannelApi } from '@api/piperchat/channel'
import { ref } from 'vue'

const userStore = useUserStore()

const event = defineEmits<{
  (e: 'close'): void
}>()

const username = ref(userStore.username)
const email = ref(userStore.email)
const description = ref(userStore.description)
const photo = ref(userStore.photo)

async function onSubmit() {
  console.log('submit')
}
</script>

<template>
  <div class="q-pa-xl bg-white">
    <q-form class="q-gutter-md">
      <!--Insert image with username-->
      <div class="avatar-and-title">
        <q-avatar>
          <img src="src/assets/user-avatar.png" />
        </q-avatar>
        <h3 style="margin-left: 10px">{{ userStore.username }}</h3>
      </div>

      <q-input v-model="email" label="Email" outlined class="q-mb-md" />

      <q-input v-model="description" label="Description" outlined class="q-mb-md" />

      <q-input v-model="photo" label="Photo" outlined class="q-mb-md" />

      <q-btn type="submit" label="Save" color="primary" class="q-mt-md" />
      <q-btn
        label="Cancel"
        type="reset"
        color="primary"
        flat
        class="q-ml-sm q-mt-md"
        @click="event('close')"
      />
    </q-form>
  </div>
</template>
