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

        <button v-if="card.author == session.username" @click="emitDelete" class="absolute top-1 right-1 text-gray-500 hover:text-red-600 p-1 cursor-pointer"
            aria-label="Eliminar">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
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

                <!-- Botón de reacciones -->
                <div class="relative flex justify-end">
                    <button data-reaction-trigger @click="(e) => togglePopup(card.id, e)"
                        class="text-xl hover:scale-110 transition cursor-pointer">
                        <IconEmoji class="w-5 h-5" />
                    </button>
                </div>

                <!-- Popup flotante -->
                <Teleport to="body">
                    <div v-if="showReactions === card.id"
                        class="absolute z-50 bg-white border rounded shadow-lg p-2 flex gap-2" :style="popupStyles"
                        ref="popupRef">
                        <button v-for="(emoji, type) in emojis" :key="type" @click="selectReaction(type)"
                            class="text-xl hover:scale-125 transition cursor-pointer">
                            {{ emoji }}
                        </button>
                    </div>
                </Teleport>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onBeforeUnmount, onMounted, computed } from 'vue';
import { useBoardStore } from '@/stores/board';
import { useSessionStore } from '@/stores/session';
import IconEmoji from '@/components/icons/IconEmoji.vue';

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


// Reactions
const showReactions = ref(null);
const popupRef = ref(null);
const popupStyles = ref({});
const emojis = {
    heart: '❤️',
    thumb: '👍',
    laugh: '😂',
    star: '⭐'
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

const togglePopup = (id, event) => {
    if (showReactions.value === id) {
        showReactions.value = null;
    } else {
        showReactions.value = id;
        const rect = event.currentTarget.getBoundingClientRect();
        popupStyles.value = {
            top: `${rect.top + window.scrollY - 50}px`,
            left: `${rect.left + rect.width / 2}px`,
            transform: 'translateX(-90%)',
            position: 'absolute'
        };
    }
};

const react = (type) => {
    board.reactToCard(props.card.id, type);
};
const selectReaction = (type) => {
    react(type);
    showReactions.value = null;
};

const hasReacted = (type) => {
    const userReactions = props.card.reactedBy?.[session.username] || [];
    return userReactions.includes(type);
};

const onClickOutside = (e) => {
    const isOutsidePopup = popupRef.value && !popupRef.value.contains(e.target);
    const isOutsideTrigger = !e.target.closest('[data-reaction-trigger]');

    if (isOutsidePopup && isOutsideTrigger) {
        showReactions.value = null;
    }
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


onMounted(() => document.addEventListener('click', onClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside));

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