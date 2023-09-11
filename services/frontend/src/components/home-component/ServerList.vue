<script setup lang="ts"></script>

<template>
    <q-scroll-area visible class="col-4 bg-dark">
        <div class="column items-center">
            <div v-for="n in 40" :key="n" class="col q-mt-md">
                <q-avatar color="accent" text-color="dark">{{ n }}</q-avatar>
            </div>
        </div>
    </q-scroll-area>
</template>
