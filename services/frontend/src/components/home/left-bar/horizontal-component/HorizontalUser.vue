<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const props = defineProps<{
  name: string
  photo?: string
  online?: boolean
  lastActive?: string
}>()

const formattedLastActive = ref<string>('')

watchEffect(() => {
  if (props.lastActive) {
    const date = new Date(props.lastActive)
    formattedLastActive.value = date.toLocaleString('en-US', {
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric'
    })
  }
})
</script>

<template>
  <q-item clickable class="user-item">
    <!-- Top right: Last access and red/green icon -->
    <div class="top-row">
      <div class="status-row">
        <div class="status-icon-container">
          <q-icon
            name="fiber_manual_record"
            class="user-online-icon"
            :color="props.online ? 'green' : 'red'"
          ></q-icon>
        </div>
        <div class="status-text">
          {{ props.online ? 'Online' : 'Last Active: ' + formattedLastActive }}
        </div>
      </div>
    </div>

    <!-- Bottom row: Avatar, Username, and Icon -->
    <div class="bottom-row">
      <q-avatar class="user-avatar">
        <img
          v-if="props.photo == '' || props.photo == undefined"
          src="../../../../assets/user-avatar.png"
          alt="Default User Photo"
        />
        <img v-else :src="props.photo" alt="User Photo" />
      </q-avatar>

      <div class="user-details">
        <div class="user-name ellipsis fit">
          {{ props.name }}
        </div>
      </div>
    </div>
  </q-item>
</template>

<style scoped lang="css">
.user-item {
  font-size: 16px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  position: relative;
  display: flex;
  flex-direction: column;
}

.top-row {
  display: flex;
  align-items: center; /* Align vertically */
  margin-bottom: 2px; /* Reduced height */
}

.status-row {
  display: flex;
  align-items: center; /* Align the status row vertically */
}

.status-icon-container {
  margin-right: 5px; /* Adjust the margin as needed */
}

.user-online-icon {
  font-size: 12px;
}

.status-text {
  font-size: 10px;
  color: #777;
}

.bottom-row {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
}

.user-details {
  margin-left: 10px;
  flex-grow: 1;
}

.user-name {
  font-weight: bold;
  margin-top: 5px;
}
</style>
