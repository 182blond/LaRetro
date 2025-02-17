<template>
    <div class="relative bg-white p-4 shadow-md rounded-lg border-l-4 flex flex-col gap-2 overflow-hidden break-words">
        <!-- Card content -->
        <div class="text-gray-700 break-words overflow-hidden">
            <p>{{ card.text }}</p>
        </div>

        <!-- Footer -->
        <div class="flex justify-between items-center text-gray-500 text-sm mt-2">
            <!-- Username -->
            <span class="text-[0.6rem]">Usuario Test</span>

            <!-- Upvote -->
            <div class="flex gap-2 items-center">
                <button @click="vote" class="hover:text-blue-500 flex items-center gap-1 cursor-pointer">
                    👍 <span>{{ card.votes }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue';
import { useBoardStore } from '@/stores/board';

const props = defineProps({ card: Object });
const board = useBoardStore();
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

const vote = () => {
    board.upvoteCard(props.card.id);
};

const emitDelete = () => {
    emits('delete', props.card.id);
};

</script>