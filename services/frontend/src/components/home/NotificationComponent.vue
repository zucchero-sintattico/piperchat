<script setup lang="ts">
import { useNotificationStore } from '@/stores/notifications'
import { watch, type Ref, ref } from 'vue'

const notificationStore = useNotificationStore()

const messagesOnDirectNotifications = notificationStore.newMessagesOnDirect
const messagesOnChannelNotifications = notificationStore.newMessagesOnChannel
const newFriendRequestNotifications = notificationStore.newFriendRequests
const newFriendRequestAcceptedNotifications = notificationStore.newFriendRequestsAccepted

const notification: Ref<string | null> = ref(null)

watch(messagesOnDirectNotifications, (newVal) => {
  const sender = newVal[newVal.length - 1].sender
  console.log('Setting notification')
  notification.value = 'New message from ' + sender
})

watch(messagesOnChannelNotifications, (newVal) => {
  const sender = newVal[newVal.length - 1].sender
  console.log('Setting notification')
  notification.value = '[' + newVal[newVal.length - 1].channelName + '] New message from ' + sender
})

watch(newFriendRequestNotifications, (newVal) => {
  const sender = newVal[newVal.length - 1]
  console.log('Setting notification')
  notification.value = 'New friend request from ' + sender
})

watch(newFriendRequestAcceptedNotifications, (newVal) => {
  const sender = newVal[newVal.length - 1]
  console.log('Setting notification')
  notification.value = 'Friend request accepted by ' + sender
})

watch(notification, (newVal) => {
  if (newVal !== null) {
    // Show the notification
    setTimeout(() => {
      // Hide the notification after 3 second
      notification.value = null
    }, 2500)
  }
})
</script>
<template>
  <div v-if="notification !== null" class="notification">
    {{ notification }}
  </div>
</template>

<style scoped>
.notification {
  position: absolute;
  z-index: 9999;
  top: 10px;
  right: 10px;
  padding: 15px;
  background-color: whitesmoke;
  color: black;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: opacity 0.5s ease-in-out; /* Add a fade-in/out transition effect */
}

.notification.hidden {
  opacity: 0;
}
</style>
