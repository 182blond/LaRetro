<template>
    <div class="w-full flex flex-col gap-1 p-1">
        <!-- Column Category -->
        <div v-for="category in board.categories" :key="category.id" class="m-4 p-4 rounded flex flex-col space-y-4"
            :class="[`category-${category.id}`, 'category-box']">

            <!-- Title -->
            <h2 class="text-lg font-bold border-b-2 category-title">{{ category.name }}</h2>

            <!-- Card container - Masonry layout -->
            <masonry-wall :items="sortedCards.filter(c => {
                if (category.specialField) {
                    return c[category.specialField]
                }
                return c.category === category.id
            })" :ssr-columns="1"
                :column-width="250" :gap="16">
                <template #default="{ item }">
                    <Card :card="item" :class="category.class" />
                </template>
            </masonry-wall>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useBoardStore } from '@/stores/board';
import Card from '@/components/Card.vue';

const board = useBoardStore();

const sortedCards = computed(() => {
  return [...board.cards].sort((a, b) => {
    const aTime = a.createdAt?.seconds ?? 0;
    const bTime = b.createdAt?.seconds ?? 0;
    return bTime - aTime; // Más reciente primero
  });
});
</script>
