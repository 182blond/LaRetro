<template>
  <div class="min-h-screen max-h-screen bg-gray-100 flex flex-col">
    <!-- Header -->
    <header class="bg-purple-800 text-white p-4 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <RouterLink to="/" class="text-2xl font-bold">La Retro</RouterLink>
        <nav>
          <RouterLink to="/board" class="mx-2 hover:underline">Board</RouterLink>
        </nav>
      </div>
    </header>

    <!-- Main -->
    <main class="w-full mx-auto flex flex-1 overflow-hidden">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router';
</script>
