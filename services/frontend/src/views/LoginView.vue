<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from '@/components/login/LoginForm.vue'
import RegisterForm from '@/components/login/RegisterForm.vue'

const login = ref(true)
</script>

<template>
  <div class="container">
    <img src="../assets/piperchat-logo-no-background.png" alt="logo" />
    <div v-if="login" class="form">
      <h1>Login</h1>
      <LoginForm />
      <a @click="login = false">New user? Register</a>
    </div>
    <div v-else class="form">
      <h1>Register</h1>
      <RegisterForm />
      <a @click="login = true">Already register? Login</a>
    </div>
  </div>
</template>

<style scoped>
.container {
  --left-bar: 500px;
  --green: rgb(3, 100, 95);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container::before {
  content: '';
  position: absolute;
  width: var(--left-bar);
  left: 0;
  z-index: -1;
  height: 100%;
  background-color: var(--green);
}

img {
  width: var(--left-bar);
  height: var(--left-bar);
  background-color: var(--green);
}

.form {
  display: inline-block;
  width: 100%;
  padding: 2em 5em;
  font-size: 1em;
}

h1 {
  font-weight: normal;
  font-size: 5em !important;
}

a {
  color: var(--green);
  text-decoration: underline;
  font-size: 1.5em;
  cursor: pointer;
}

a:hover {
  color: rgb(0, 0, 0);
}

@media (max-width: 1100px) {
  .container {
    --left-bar: 400px;
    flex-direction: column;
    justify-content: start;
  }

  .container::before {
    position: absolute;
    width: 100%;
    height: var(--left-bar);
  }
}
</style>
