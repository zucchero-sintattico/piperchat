<script setup lang="ts">
const props = defineProps<{
  name: string
  photo?: string
  online?: boolean
}>()
</script>

<template>
  <q-item clickable class="user-item">
    <q-avatar class="user-avatar">
      <img
        v-if="props.photo == '' || props.photo == undefined"
        src="src/assets/default-user-photo.png"
        alt="Default User Photo"
      />
      <img v-else :src="props.photo" alt="User Photo" />
    </q-avatar>

    <q-icon
      name="fiber_manual_record"
      class="user-online-icon"
      :color="props.online ? 'green' : 'red'"
    ></q-icon>

    <q-item-section class="user-details">
      <div class="user-name ellipsis fit">
        {{ props.name }}
      </div>
    </q-item-section>
  </q-item>
</template>

<style scoped lang="css">
.user-item {
  font-size: 16px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
}

.user-online-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 12px;
}

.user-details {
  margin-left: 10px;
}

.user-name {
  font-weight: bold;
  margin-top: 5px;
}
</style>
