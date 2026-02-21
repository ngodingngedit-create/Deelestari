<script setup>
import ProductCard from './ProductCard.vue';
import { useLanguage } from '../../composables/useLanguage';

const props = defineProps({
  products: {
    type: Array,
    default: () => []
  },
  cartItems: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update-quantity', 'view-product']);
const { t } = useLanguage();

const getQuantity = (productId) => {
  const item = props.cartItems.find(i => i.id === productId);
  return item ? item.quantity : 0;
};
</script>

<template>
  <section class="content-grid">
    <ProductCard 
      v-for="product in products" 
      :key="product.id" 
      :product="product" 
      :quantity="getQuantity(product.id)"
      @update-quantity="(p, q) => $emit('update-quantity', p, q)"
      @view-product="(p) => $emit('view-product', p)"
    />
    <div v-if="products.length === 0" class="no-results">
      <p>{{ t('noResults') || 'Tidak ada produk yang ditemukan.' }}</p>
    </div>
  </section>
</template>

<style scoped>
.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #888;
}
</style>
