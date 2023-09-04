<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from '@/components/login-component/LoginForm.vue'

const tab = ref('login')
</script>

<template>
  <div class="q-pa-md container">
    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="login" label="Login" />
        <q-tab name="register" label="Register" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login">
          <LoginForm class="tabs" />
        </q-tab-panel>

        <q-tab-panel name="register">
          <LoginForm class="tabs" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 50%;
  margin: 5% auto;
}

.tabs {
  width: 75%;
  margin: 2% auto;
}

:deep(.q-tab__label) {
  font-size: 1.5em;
}
</style>
