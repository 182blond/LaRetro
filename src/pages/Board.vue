<template>
  <div class="w-full grid grid-cols-1 sm:grid-cols-4 gap-1 p-1">
    <!-- Column Category -->
    <div v-for="category in board.categories" :key="category.id" class="p-4 flex flex-col space-y-4 overflow-hidden">

      <!-- Title -->
      <h2 class="text-lg font-bold">{{ category.name }}</h2>
      <div class="border border-b"></div>

      <!-- Add Card container -->
      <div class="flex gap-2">
        <!-- Textarea -->
        <textarea v-model="newCards[category.id]" :data-category="category.id" placeholder="Agregar una idea..."
          class="shadow p-2 rounded w-full text-sm bg-white resize-none overflow-hidden" rows="1"
          @input="autoResize($event)"></textarea>

        <!-- Add Button -->
        <button @click="addNewCard(category.id)"
          class="bg-white text-black font-bold px-3 py-1 rounded shadow hover:bg-purple-100 cursor-pointer">➕</button>
      </div>

      <!-- Card container -->
      <div
        class="space-y-2 overflow-y-auto pr-[0.5rem] overflow-y-auto text-[14px] break-words whitespace-pre-line leading-[1.3em]">
        <Card v-for="card in board.cards.filter(c => c.category === category.id)" :key="card.id" :card="card"
          @edit="editCard" @delete="deleteCard" :class="category.class" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useBoardStore } from '@/stores/board';
import Card from '@/components/Card.vue';

const board = useBoardStore();
const newCards = ref({});

// ➕ Add new card to category
const addNewCard = (category) => {
  if (newCards.value[category]?.trim()) {
    board.addCard(newCards.value[category], category);
    newCards.value[category] = '';
    resetTextarea(category);
  }
};

// ✏️ Edit card (Not implemented)
const editCard = (id, newText) => {
  board.editCard(id, newText);
};

// 🗑️ Delete card (Not implemented)
const deleteCard = (id) => {
  board.deleteCard(id);
};

// Textarea autoresize
const autoResize = (event) => {
  event.target.style.height = "auto";
  event.target.style.height = `${event.target.scrollHeight}px`;
};

// Textarea reset size
const resetTextarea = (category) => {
  const textarea = document.querySelector(`textarea[data-category="${category}"]`);
  if (textarea) {
    textarea.style.height = "auto";
  }
};
</script>
