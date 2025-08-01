<template>
  <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 space-y-5 lg:space-y-0 py-4 px-2">
    <!-- Column Category -->
    <div v-for="category in categoriesComputed" :key="category.id"
      class="p-4 flex flex-col space-y-4 overflow-hidden mx-3 rounded-xl"
      :class="[`category-${category.id}`, 'category-box']">

      <!-- Title -->
      <h2 class="text-lg font-bold border-b-2 category-title">{{ category.name }}</h2>

      <!-- Add Card container -->
      <div class="flex gap-2">
        <!-- Textarea -->
        <textarea v-model="newCards[category.id]" :data-category="category.id" placeholder="Agregar una idea..."
          class="shadow p-2 rounded w-full border border-[var(--color-border)] text-sm bg-white resize-none overflow-hidden"
          rows="1" @input="autoResize($event)"></textarea>
        <!-- Add Button -->
        <button @click="addNewCard(category.id)" 
          :disabled="!newCards[category.id]?.trim()"
          class="bg-white text-black font-bold px-3 py-1 rounded shadow border border-[var(--color-border)] hover:bg-purple-100 cursor-pointer disabled:bg-gray-200">➕</button>
      </div>

      <!-- Card container -->
      <div
        class="overflow-y-auto overflow-y-auto text-[14px] break-words whitespace-pre-line leading-[1.3em]">
        <Card v-for="card in board.myCards.filter(c => c.category === category.id)" :key="card.id" :card="card"
          @edit="editCard" @delete="deleteCard" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useBoardStore } from '@/stores/board';
import Card from '@/components/Card.vue';

const board = useBoardStore();
const newCards = ref({});

// 🚀 Load cards
onMounted(() => {
  board.loadCards();
});

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

// 🗑️ Delete card
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

// Filter categories
const categoriesComputed = computed(() => {
  return board.categories.filter(c => !c.specialField);
});
</script>
