import { defineStore } from 'pinia';
import { ref, watch, computed } from 'vue';
import { collection, addDoc, serverTimestamp, onSnapshot, doc, updateDoc, increment, getDoc, deleteField, deleteDoc } from 'firebase/firestore';
import { db } from '@/plugins/firebase';
import { useSessionStore } from '@/stores/session';

export const useBoardStore = defineStore('board', () => {
  const cards = ref([]);
  const unsubscribe = ref(null);
  const session = useSessionStore();
  const boardId = getTodayBoardId(session.boardName);
  const author = session.username;

  const categories = [
    { id: 'good', name: 'Loved' },
    { id: 'improve', name: 'Learned' },
    { id: 'actions', name: 'Loathed' },
    { id: 'ideas', name: 'Longed for' },
  ];

  // 💾 Watch and save cards
  watch(cards, (newCards) => {
    localStorage.setItem('laretro_cards', JSON.stringify(newCards));
  }, { deep: true });

  // 🚀 Load my cards
  const loadCards = () => {
    const cardsRef = collection(db, 'boards', boardId, 'cards');

    if (unsubscribe.value) unsubscribe.value();

    unsubscribe.value = onSnapshot(cardsRef, (snapshot) => {
      cards.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    });
  };

  // 🔍 Filter my card  s
  const myCards = computed(() =>
    cards.value.filter(card => card.author === session.username)
  );

  // ➕ Add cardo
  const addCard = async (text, category) => {
    const cardsRef = collection(db, 'boards', boardId, 'cards');
    const cardValue = {
      content: text,
      category: category,
      author: author,
      reactions: {},
      createdAt: serverTimestamp()
    }

    cards.value.push(cardValue);
    await addDoc(cardsRef, cardValue);
  };

  // 👍 React card
  const reactToCard = async (cardId, type) => {
    const cardRef = doc(db, 'boards', boardId, 'cards', cardId);
    const snap = await getDoc(cardRef);
    if (!snap.exists()) return;

    const data = snap.data();
    const reactedBy = data.reactedBy || {};
    const userReactions = new Set(reactedBy[author] || []);
    const hasReacted = userReactions.has(type);
    const update = {};

    // Toggle OFF: ya había reaccionado con ese tipo
    if (hasReacted) {
      update[`reactions.${type}`] = increment(-1);
      userReactions.delete(type);
    } else {
      // Toggle ON
      update[`reactions.${type}`] = increment(1);
      userReactions.add(type);
    }

    // Guardar nuevo array de reacciones del usuario
    if (userReactions.size === 0) {
      update[`reactedBy.${author}`] = deleteField();
    } else {
      update[`reactedBy.${author}`] = Array.from(userReactions);
    }
    await updateDoc(cardRef, update);
  };

  // ✏️ Edit card (Not implemented)
  const editCard = (id, newText) => {
    const card = cards.value.find(card => card.id === id);
    if (card) card.text = newText;
  };

  // 🗑️ Delete card (Not implemented)
  const deleteCard = async (cardId) => {
    const cardRef = doc(db, 'boards', boardId, 'cards', cardId);
    await deleteDoc(cardRef);
  };

  loadCards();

  return { cards, categories, loadCards, addCard, reactToCard, editCard, deleteCard, myCards };
});

const getTodayBoardId = (rawName) => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${rawName}-${yyyy}-${mm}-${dd}`;
};