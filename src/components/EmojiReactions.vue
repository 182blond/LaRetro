<template>
  <div class="relative flex justify-end">
    <!-- Botón Emoji -->
    <button
      data-reaction-trigger
      @click="togglePopup"
      class="text-xl hover:scale-110 transition cursor-pointer"
    >
      <IconEmoji class="w-5 h-5" />
    </button>

    <!-- Popup -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="popupRef"
        class="absolute z-50 bg-white border border-gray-400 rounded shadow-xl p-2 flex gap-1 text-sm"
        :style="popupStyles"
      >
        <button
          v-for="(emoji, type) in emojis"
          :key="type"
          @click="selectReaction(type)"
          class="text-xl hover:scale-125 transition cursor-pointer"
        >
          {{ emoji }}
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import IconEmoji from "@/components/icons/IconEmoji.vue";

const props = defineProps({
  cardId: {
    type: [String, Number],
    required: true
  },
  emojis: {
    type: Object,
    default: () => ({
      heart: '❤️',
      plus: '👍',
      laugh: '🤣',
      star: '⭐',
      fire: '🔥',
      sarcasm: '🙃',
      sad: '😢'
    })
  },
  onSelect: {
    type: Function,
    required: true
  }
});

const isOpen = ref(false);
const popupRef = ref(null);
const popupStyles = ref({});

const togglePopup = (e) => {
  isOpen.value = !isOpen.value;

  if (isOpen.value) {
    const rect = e.currentTarget.getBoundingClientRect();
    popupStyles.value = {
      top: `${rect.top + window.scrollY - 50}px`,
      left: `${rect.left + rect.width / 2}px`,
      transform: "translateX(-90%)",
      position: "absolute"
    };
  }
};

const selectReaction = (type) => {
  props.onSelect(type);
  isOpen.value = false;
};

const handleClickOutside = (e) => {
  if (
    popupRef.value &&
    !popupRef.value.contains(e.target) &&
    !e.target.closest("[data-reaction-trigger]")
  ) {
    isOpen.value = false;
  }
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() => document.removeEventListener("click", handleClickOutside));
</script>
