<script setup lang="ts">
import HorizontalUser from './horizontal-component/HorizontalUser.vue'
import HorizontalChannel from './horizontal-component/HorizontalChannel.vue'
import FriendMenu from './menu/FriendMenu.vue'
import { useFriendStore } from '@/stores/friend'
import { onMounted, ref } from 'vue'
import { useAppStore } from '@/stores/app'

const friendStore = useFriendStore()

const appStore = useAppStore()

const friendTabOpened = ref(false)

onMounted(async () => {
  await friendStore.refresh()
})
</script>

<template>
  <q-scroll-area
    class="col bg-secondary fit"
    content-style="position: relative !important"
    content-active-style="position: relative !important"
  >
    <div class="column">
      <div class="col fit">
        <q-list bordered separator class="text-white text-h5">
          <HorizontalChannel
            class="bg-primary friend-button"
            name="Friends"
            icon="group"
            clickable
            @click="friendTabOpened = true"
          />
          <q-list
            bordered
            separator
            class="text-white text-h5"
            v-for="friend in friendStore.friends"
            :key="friend"
          >
            <HorizontalUser :name="friend" @click="appStore.selectDirect(friend)" />
          </q-list>
        </q-list>

        <FriendMenu v-model:active="friendTabOpened" />
      </div>
    </div>
  </q-scroll-area>
</template>

<style scoped>
.friend-button {
  border-radius: 1em !important;
  margin: 5% !important;
}
</style>
