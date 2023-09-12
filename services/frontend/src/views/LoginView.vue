<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from '@/components/login-component/LoginForm.vue'
import RegisterForm from '@/components/login-component/RegisterForm.vue'

const tab = ref('login')
</script>

<template>
  <div class="container">
    <img src="../assets/piperchat-logo.jpg" alt="logo" class="logo" />

    <div class="form">
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
            <RegisterForm class="tabs" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  margin: 20vh auto;
  height: 50vh;
}

.form {
  flex-grow: 2;
  margin: 0 5%;
}

.tabs {
  width: 75%;
  margin: 5em auto;
}

:deep(.q-tab__label) {
  font-size: 1.5em;
}

.logo {
  flex-grow: 0;
  margin: auto 5em;
  height: 70%;
  border-radius: 50%;
  box-shadow: 0 0 2em rgba(0, 0, 0, 1);
}

@media only screen and (max-width: 1200px) {
  .container {
    flex-direction: column;
    margin: auto;
  }

  .logo {
    margin: 2em auto;
    width: 40%;
  }

  .form {
    margin: 0 auto;
    width: 90%;
  }
}
</style>
