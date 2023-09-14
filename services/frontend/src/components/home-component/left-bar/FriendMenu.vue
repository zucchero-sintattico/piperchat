<script setup lang="ts">
import HorizontalUser from './horizontal-component/HorizontalUser.vue'
import { computed, ref } from 'vue'

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

const friendTab = ref('friend')
const friendRequestPopup = ref(false)
const friendUsername = ref('')

const resultBanner = ref(false)

function sendFriendRequest() {
  console.log(friendUsername.value)
  friendUsername.value = ''
  friendRequestPopup.value = false
}
</script>

<template>
  <div>
    <!-- start Friends pop up -->
    <q-dialog v-model="active">
      <q-card class="container">
        <q-tabs
          v-model="friendTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="friend" label="Friends" />
          <q-tab name="request" label="Pending" />
          <q-btn
            icon="group_add"
            class="q-ma-sm bg-green text-white"
            @click="friendRequestPopup = true"
          />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="friendTab" animated>
          <q-tab-panel name="friend">
            <div class="text-h4">All friends</div>
            <q-list v-for="user in 10" :key="user">
              <HorizontalUser name="user" icon="chat" clickable class="q-pa-sm" />
            </q-list>
          </q-tab-panel>

          <q-tab-panel name="request">
            <div class="text-h4">Pending requests</div>
            <q-list v-for="user in 10" :key="user">
              <HorizontalUser name="user" icon="chat" clickable class="q-pa-sm" />
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-dialog>
    <!-- end Friends pop up -->

    <!-- start Friend request pop up -->
    <q-dialog v-model="friendRequestPopup" persistent>
      <q-card class="friend-popup">
        <q-card-section>
          <div class="text-h6">Insert friend name</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            label="Friend username"
            type="text"
            v-model="friendUsername"
            autofocus
            @keyup.enter="sendFriendRequest"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup @click="friendUsername = ''" />
          <q-btn color="primary" label="Send friend request" @click="sendFriendRequest" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- end Friend request pop up -->

    <!-- start Request up -->
    <q-dialog v-model="resultBanner" seamless position="bottom">
      <q-card class="bg-green text-h6 text-white q-px-xl q-py-md">
        <!-- <q-banner class="text-white bg-green error-banner q-pa-lg text-h1"> -->
        OK tutto a buon fine
        <!-- </q-banner> -->
      </q-card>
    </q-dialog>
    <!-- end Request up -->
  </div>
</template>

<style scoped>
.container {
  min-width: 30vw;
}

.friend-popup {
  min-width: 20vw;
}

@media screen and (max-width: 1200px) {
  .container {
    min-width: 80vw;
  }

  .friend-popup {
    min-width: 60vw;
  }
}
</style>
