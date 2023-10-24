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
  await friendStore.fetchFriends()
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
            :key="friend.username"
          >
            <HorizontalUser
              :name="friend.username"
              :online="friend.status.online"
              @click="appStore.selectDirect(friend.username)"
            />
          </q-list>
        </q-list>

        <FriendMenu v-model:active="friendTabOpened" />
      </div>
    </div>
  </q-scroll-area>
</template>
