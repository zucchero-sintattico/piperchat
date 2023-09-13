<script setup lang="ts">
import { useServerStore } from '@/stores/server'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const serverStore = useServerStore()
</script>

<template>
  <q-scroll-area visible class="col bg-secondary">
    <div class="column">
      <div class="col">
        <h4 class="q-ma-md text-white">{{ userStore.selectedServer.name }}</h4>

        <div class="q-ma-md q-flex q-items-center q-justify-center">
          <q-btn color="primary" label="Create channel" />
        </div>

        <q-separator color="accent" style="height: 2px" inset />

        <div
          v-for="channel in userStore.selectedServer.channels?.filter(
            (c) => c.channelType == 'Message'
          )"
          :key="channel._id"
        >
          <q-btn class="full-width" no-caps flat color="secondary">
            <q-item-section class="text-white" avatar>
              <q-icon name="chat" />
            </q-item-section>
            <q-item-section align="left" class="text-white"
              >Chanel chat {{ channel.name }}</q-item-section
            >
          </q-btn>
        </div>

        <q-separator color="accent" style="height: 2px" inset />

        <div v-for="n in 4" :key="n" class="row">
          <q-list>
            <q-expansion-item
              dark
              icon="volume_up"
              :label="'Nome ' + n"
              caption="Online: 2"
              default-opened
            >
              <div v-for="n in 2" :key="n">
                <q-btn class="full-width" no-caps flat color="secondary">
                  <q-item-section avatar>
                    <q-avatar size="30px">
                      <img src="https://cdn.quasar.dev/img/avatar3.jpg" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section class="text-white">Lily {{ n }}</q-item-section>
                </q-btn>
              </div>
            </q-expansion-item>
          </q-list>
        </div>
      </div>
    </div>
  </q-scroll-area>
</template>

<style lang="sass"></style>
