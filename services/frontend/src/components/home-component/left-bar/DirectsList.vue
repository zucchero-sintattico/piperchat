<script setup lang="ts">
import HorizontalUser from './horizontal-component/HorizontalUser.vue'
import HorizontalChannel from './horizontal-component/HorizontalChannel.vue'
import { ContentArea, useUserStore } from '@/stores/user'
import FriendMenu from './menu/FriendMenu.vue'
import { useFriendStore } from '@/stores/friend'
import { onMounted, ref } from 'vue'

const userStore = useUserStore()
const friendStore = useFriendStore()

const friendTabOpened = ref(false)

function setActiveDirect(directUsarname: string) {
  userStore.inContentArea = ContentArea.Direct
  userStore.selectedDirect = directUsarname
  console.log('changed direct', userStore.selectedDirect)
}
onMounted(() => {
  friendStore.fetchFriends()
  userStore.selectedDirect = ''
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
            :key="friend"
          >
            <HorizontalUser :name="friend" icon="chat" @click="setActiveDirect(friend)" />
          </q-list>
        </q-list>

        <FriendMenu v-model:active="friendTabOpened" />
      </div>
    </div>
  </q-scroll-area>
</template>
