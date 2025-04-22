<template>
  <div class="w-full h-full flex items-center justify-center h-screen app-bg-login">
    <div class="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
      
      <img class="h-18 w-18" src="/logo.png" alt="La Retro Logo" />
      <img class="mt-3 mb-5 h-10 w-auto opacity-75" src="/logo2.png" alt="La Retro Logo2" />
  
      <div class="flex flex-col gap-2">
        <div class="relative">
          <icon-user alt="User Icon"
            class="w-4 h-4 text-gray-600 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"></icon-user>
          <input v-model="usernameInput" type="text" placeholder="Nombre"
            class="pl-10 py-2 pr-4 border border-gray-300 rounded-md" @keyup.enter="login()">
        </div>

        <div class="relative">
          <icon-session alt="Session Icon"
            class="w-4 h-4 text-gray-600 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"></icon-session>
          <input v-model="sessionIdInput" type="text" placeholder="Sala"
            class="pl-10 py-2 pr-4 border border-gray-300 rounded-md" @keyup.enter="login()">
        </div>

        <button id="submitButton"
          class="disabled:bg-gray-400 disabled:cursor-default cursor-pointer bg-[#003366] hover:bg-[#003366] hover:bg-opacity-80 text-white font-semibold py-2 px-4 rounded-md focus:outline-none"
          :disabled="!(usernameInput && sessionIdInput)" @click="login()">
          Entrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { useSessionStore } from '@/stores/session';

import IconUser from "../components/icons/IconUser.vue";
import IconSession from "../components/icons/IconSession.vue";

const router = useRouter()
const route = useRoute();
const session = useSessionStore();

const usernameInput = ref('');
const sessionIdInput = ref(route.params.sessionId);

function login(){
  let safeBoardname = sessionIdInput.value.trim().toLowerCase().replace(/\s+/g, '-');

  session.setUsername(usernameInput.value);
  session.setBoardName(safeBoardname);
  router.push({ name: 'Board', params: { sessionId: safeBoardname } });
}
</script>

<style>
html,
body,
#app {
  height: 100%;
}
</style>
