<script setup lang="ts">
import HorizontalUser from './horizontal-component/HorizontalUser.vue'
import HorizontalChannel from './horizontal-component/HorizontalChannel.vue'
import FriendMenu from './menu/FriendMenu.vue'
import { useUserStore } from '@/stores/user'
import { useFriendStore } from '@/stores/friend'
import { onMounted, ref } from 'vue'

const userStore = useUserStore()
const friendStore = useFriendStore()

const friendTabOpened = ref(false)

onMounted(() => {
  friendStore.fetchFriends()
})
</script>

<template>
  <q-scroll-area visible class="col bg-secondary">
    <div class="column">
      <div class="col">
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
            <HorizontalUser :name="friend" icon="chat" @click="userStore.selectedDirect = friend" />
          </q-list>
        </q-list>

        <FriendMenu v-model:active="friendTabOpened" />
      </div>
    </div>
  </q-scroll-area>
</template>
