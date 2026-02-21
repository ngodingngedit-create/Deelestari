<script setup>
import { useLanguage } from '../../composables/useLanguage';

const props = defineProps({
  categories: {
    type: Array,
    default: () => ['Semua', 'Supernova', 'Perahu Kertas', 'Aroma Karsa', 'Rapijali', 'Esai', 'Puisi', 'Musik', 'Diskusi', 'Jurnal']
  },
  activeCategory: {
    type: String,
    default: 'Semua'
  }
});

const emit = defineEmits(['change-category']);
const { t } = useLanguage();

const selectCategory = (category) => {
  emit('change-category', category);
};

const getCategoryLabel = (category) => {
  if (category === 'Semua') return t('categoryAll');
  // For other categories, they are mostly proper names or translated elsewhere in product data
  // but we can add more mappings here if needed.
  return category;
};
</script>

<template>
  <section class="category-section">
    <div class="category-chips">
      <button 
        v-for="category in categories" 
        :key="category" 
        class="chip" 
        :class="{ active: activeCategory === category }"
        @click="selectCategory(category)"
      >
        {{ getCategoryLabel(category) }}
      </button>
    </div>
  </section>
</template>

<style scoped>
/* Scoped styles mainly handled by global CSS */
</style>
