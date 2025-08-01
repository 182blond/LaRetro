<template>
    <div
        class="relative bg-white py-2 px-4 mb-4 shadow-md rounded-md border-l-12 border-[var(--color-border)] z-0 flex flex-col gap-2 overflow-hidden break-words card relative overflow-hidden card-holo">


        <!-- Card content -->
        <div class="text-gray-700 break-word pr-2">
            <p>{{ card.content }}</p>
            <div v-if="dominantEmoji" class="emojis-container z-10">
                <span v-for="(point, i) in emojiGrid" :key="i" class="emoji" :style="{
                    left: `${point.left}%`,
                    bottom: '-2rem',
                    animationDelay: `${point.delay}s`,
                    '--offset': `${point.offset}px`,
                    '--alpha': point.alpha,
                    '--scale': point.scale,
                    '--rotate': `${point.rotate}deg`
                }"> {{ dominantEmoji }}
                </span>
            </div>
        </div>

        <button
            class="absolute top-1 right-1 text-gray-500 hover:text-red-600 p-1 cursor-pointer">
                <SettingsMenu
                :card-id="card.id"
                :card-actionable="!!card.actionable" 
                :on-select="handleSettingsOption"
                :session="session"
                :card-author="card.author"
                />    
        </button>

        <!-- Footer -->
        <div class="flex justify-between items-center text-gray-500 text-sm mt-2 z-10">
            <!-- Username -->
            <span class="text-[0.6rem]">{{ card.author }}</span>

            <div class="flex gap-2 items-center">
                <!-- Reacciones existentes -->
                <div class="flex gap-1 text-base">
                    <button v-for="r in visibleReactions" :key="r.type" @click="react(r.type)"
                        class="flex items-center gap-0.5 px-1 rounded-full text-sm cursor-pointer transition"
                        :class="hasReacted(r.type) ? 'bg-purple-100/80 text-purple-800 font-bold' : 'bg-gray-100/80 hover:bg-gray-200'">
                        {{ r.emoji }} <span class="text-xs">{{ r.count }}</span>
                    </button>
                </div>
                <EmojiReactions :card-id="card.id" :emojis="emojis" :on-select="handleReaction" />

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onBeforeUnmount, onMounted, computed, nextTick } from 'vue';
import { useBoardStore } from '@/stores/board';
import { useSessionStore } from '@/stores/session';
import EmojiReactions from './EmojiReactions.vue';
import SettingsMenu from './SettingsMenu.vue';

const props = defineProps({ card: Object });
const board = useBoardStore();
const session = useSessionStore();
const emits = defineEmits(['edit', 'delete']);

const isEditing = ref(false);
const editedText = ref(props.card.text);

const startEditing = () => {
    isEditing.value = true;
};

const saveEdit = () => {
    if (editedText.value.trim()) {
        emits('edit', props.card.id, editedText.value);
    }
    isEditing.value = false;
};

const emitDelete = () => {
    if (confirm('¿Estás seguro que querés eliminar esta card?')) {
        emits('delete', props.card.id);
    }
};

const handleSettingsOption = (option) => {
    if (option === "delete") {
        emitDelete();
    }
    if (option === "actionable") {
        board.addToActionables(props.card.id);
    }
};


// Reactions
const emojis = {
    heart: '❤️',
    plus: '👍',
    laugh: '🤣',
    star: '⭐',
    fire: '🔥',
    sarcasm: '🙃',
    sad: '😢'
};

const visibleReactions = computed(() => {
    if (!props.card.reactions) return [];
    const emojiOrder = Object.keys(emojis);
    return Object.entries(props.card.reactions)
        .filter(([type, count]) => count > 0)
        .map(([type, count]) => ({
            type,
            emoji: emojis[type],
            count
        }))
        .sort((a, b) => emojiOrder.indexOf(a.type) - emojiOrder.indexOf(b.type));
});


let scrollLockTop = ref(0);


const lockScroll = () => {
  scrollLockTop.value = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollLockTop.value}px`;
  document.body.style.width = '100%';
};

const unlockScroll = () => {
  document.body.style.position = '';
  document.body.style.top = '';
  window.scrollTo(0, scrollLockTop.value);
};

const react = async (type) => {
    lockScroll();
    await board.reactToCard(props.card.id, type);
    await nextTick();
    unlockScroll();
};
const handleReaction = (type) => {
    react(type);
};

const hasReacted = (type) => {
    const userReactions = props.card.reactedBy?.[session.username] || [];
    return userReactions.includes(type);
};

// Find top emoji with at least 3 votes
const dominantEmoji = computed(() => {
    const reactions = props.card.reactions || {};
    const entries = Object.entries(reactions)
        .filter(([_, count]) => count >= 3)
        .sort((a, b) => b[1] - a[1]); // descending by count

    if (entries.length > 0) {
        const topType = entries[0][0];
        return emojis[topType]; // get the emoji character
    }

    return null;
});

const totalEmojis = 20;
const emojiGrid = Array.from({ length: totalEmojis }, () => {
    const scale = 0.8 + Math.random() * 0.6;
    const alpha = 0.4 - (scale - 0.8) * 0.4;

    return {
        left: Math.random() * 100,
        delay: -Math.random() * 4,
        offset: Math.random() * 8 - 4,
        scale,
        rotate: Math.random() * 20 - 10,
        alpha: Math.max(0.1, alpha)
    };
});


</script>