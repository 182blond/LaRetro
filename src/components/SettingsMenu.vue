<template>
  <div class="relative flex justify-end">
    <!-- Botón de tres puntos -->
    <button
      data-reaction-trigger
      @click="togglePopup"
      class="text-xl hover:scale-110 transition cursor-pointer"
    >
      <icon-settings class="w-4 h-4 cursor-pointer" />
    </button>

    <!-- Popup -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="popupRef"
        class="absolute z-50 bg-white border border-gray-400 rounded shadow-xl p-2 flex flex-col gap-1 text-sm"
        :style="popupStyles"
      >
        <button
          v-for="(label, key) in options"
          :key="key"
          @click="selectOption(key)"
          class="hover:bg-gray-100 px-2 py-1 text-left"
        >
          {{ label }}
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import IconSettings from "@/components/icons/IconSettings.vue";

const props = defineProps({
  cardId: {
    type: [String, Number],
    required: true
  },
  cardActionable: { // <-- NUEVO: lo pasás desde card.vue
    type: Boolean,
    default: false
  },
  onSelect: {
    type: Function,
    required: true
  },
  session: {
    type: Object,
    required: true
  },
  cardAuthor: {
    type: String,
    required: true
  }
});

const isOpen = ref(false);
const popupRef = ref(null);
const popupStyles = ref({});

// Options
const options = computed(() => {
  const opts = {};

  // Solo mostrar "Eliminar" si es el autor
  if (props.cardAuthor === props.session.username) {
    opts.delete = "Eliminar";
  }

  // Acción para marcar / desmarcar como actionable
  opts.actionable = props.cardActionable
    ? "Sacar de Actionables"
    : "Marcar como Actionable";

  return opts;
});

const togglePopup = (e) => {
  isOpen.value = !isOpen.value;

  if (isOpen.value) {
    const rect = e.currentTarget.getBoundingClientRect();
    popupStyles.value = {
      top: `${rect.top + window.scrollY + rect.height + 4}px`,
      left: `${rect.left}px`,
      transform: "translateX(-100%)",
      position: "absolute"
    };
  }
};

const selectOption = (key) => {
  props.onSelect(key);
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
