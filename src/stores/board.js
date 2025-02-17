import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useBoardStore = defineStore('board', () => {
  const cards = ref([]);

  const categories = [
    { id: 'good', name: 'Lo que salió bien', class: 'border border-green-500' },
    { id: 'improve', name: 'Qué podemos mejorar', class: 'border border-red-500' },
    { id: 'actions', name: 'Acciones a seguir', class: 'border border-purple-500' },
    { id: 'ideas', name: 'Ideas nuevas', class: 'border border-yellow-500' }
  ];

  // 💾 Watch and save cards
  watch(cards, (newCards) => {
    localStorage.setItem('laretro_cards', JSON.stringify(newCards));
  }, { deep: true });

  // 🚀 Load my cards
  const loadCards = () => {
    const storedCards = localStorage.getItem('laretro_cards');
    if (storedCards) {
      cards.value = JSON.parse(storedCards);
    }
  };

  // ➕ Add card
  const addCard = (text, category) => {
    cards.value.push({ id: Date.now(), text, votes: 0, category });
  };

  // ⬆️ Upvote card
  const upvoteCard = (id) => {
    const card = cards.value.find(card => card.id === id);
    if (card) card.votes++;
  };

  // ✏️ Edit card (Not implemented)
  const editCard = (id, newText) => {
    const card = cards.value.find(card => card.id === id);
    if (card) card.text = newText;
  };

  // 🗑️ Delete card (Not implemented)
  const deleteCard = (id) => {
    cards.value = cards.value.filter(card => card.id !== id);
  };

  // Move card (Not implemented)
  const moveCard = (id, newCategory) => {
    const card = cards.value.find(card => card.id === id);
    if (card) card.category = newCategory;
  };

  loadCards();

  return { cards, categories, addCard, upvoteCard, editCard, deleteCard, moveCard };
});
