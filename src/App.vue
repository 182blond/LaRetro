<template>
  <div class="min-h-screen max-h-screen flex flex-col bg-white">
    <!-- Header -->
    <header v-if="!['Login'].includes(route.name)" class="text-white px-4 border-b flex"
      style="font-family: 'Mona Sans', sans-serif">
      <div class="flex flex-1">
        <img src="/logo.png" class="w-20 h-20 p-3 -pr-4" alt="">
        <div class="w-40 flex items-center">
          <img class="mt-3 mb-5 h-8 w-auto opacity-75" src="/logo2.png" alt="La Retro Logo2" />
        </div>
      </div>
      <div class="container mx-auto flex justify-end items-center space-x-4 text-black text-xl">
        <RouterLink v-slot="{ isActive }" :to="`/board/${session.boardName}`" class="hover:underline">
          <span :class="isActive ? 'font-bold' : ''">Mi board</span>
        </RouterLink>
        <RouterLink v-slot="{ isActive }" :to="`/general/${session.boardName}`" class="hover:underline">
          <span :class="isActive ? 'font-bold' : ''">Equipo</span>
        </RouterLink>
      </div>
    </header>

    <!-- Main -->
    <main class="w-full mx-auto flex flex-1 board-bg">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView, RouterLink, useRoute } from 'vue-router';
import { useSessionStore } from '@/stores/session';

const session = useSessionStore();
const route = useRoute();
</script>
