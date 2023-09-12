<script setup lang="ts"></script>
<template>
  <q-scroll-area visible class="col bg-secondary">
    <div class="column">
      <div class="col">
        <q-item>
          <q-item-label size="50px" class="text-white text-bold">Channel Name</q-item-label>
        </q-item>

        <div v-for="n in 3" :key="n">
          <q-item>
            <q-item-section class="text-white" avatar>
              <q-icon name="chat" />
            </q-item-section>
            <q-item-section class="text-white">Lily {{ n }}</q-item-section>
          </q-item>
        </div>
        <q-separator color="accent" inset />
        <div v-for="n in 4" :key="n" class="row">
          <q-list>
            <q-expansion-item
              dark
              icon="volume_up"
              :label="'Nome ' + n"
              caption="3 user Online"
              default-opened
            >
              <div v-for="n in 2" :key="n">
                <q-item>
                  <q-item-section avatar>
                    <q-avatar size="30px">
                      <img src="https://cdn.quasar.dev/img/avatar3.jpg" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section class="text-white">Lily {{ n }}</q-item-section>
                </q-item>
              </div>
            </q-expansion-item>
          </q-list>
        </div>
      </div>
    </div>
  </q-scroll-area>
</template>

<style lang="sass"></style>
