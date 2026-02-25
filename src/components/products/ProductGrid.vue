<script setup>
import { onMounted, ref } from 'vue';
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
  },
  loading: {
    type: Boolean,
    default: false
  },
  hasMore: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update-quantity', 'view-product', 'load-more']);
const { t } = useLanguage();
const sentinel = ref(null);

const getQuantity = (productId) => {
  const item = props.cartItems.find(i => i.id === productId);
  return item ? item.quantity : 0;
};

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && props.hasMore && !props.loading) {
      emit('load-more');
    }
  }, { threshold: 0.1 });

  if (sentinel.value) {
    observer.observe(sentinel.value);
  }
});
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
    
    <div v-if="products.length === 0 && !loading" class="no-results">
      <p>{{ t('noResults') || 'Tidak ada produk yang ditemukan.' }}</p>
    </div>

    <!-- Infinite Scroll Sentinel -->
    <div ref="sentinel" class="sentinel">
      <div v-if="loading" class="loading-indicator">
        <span class="loader"></span>
        <p>Memuat produk...</p>
      </div>
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

.sentinel {
  grid-column: 1 / -1;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #888;
}

.loader {
  width: 24px;
  height: 24px;
  border: 3px solid #333;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
