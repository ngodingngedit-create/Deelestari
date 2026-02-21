<script setup>
import { computed } from 'vue';
import { useLanguage } from '../../composables/useLanguage';

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['update-quantity', 'view-product']);
const { t } = useLanguage();

const formatRupiah = (amount) => {
  return 'Rp ' + amount.toLocaleString('id-ID');
};

const discountPercentage = computed(() => {
  if (props.product.originalPrice && props.product.price) {
    return Math.round(((props.product.originalPrice - props.product.price) / props.product.originalPrice) * 100);
  }
  return 0;
});
</script>

<template>
  <article class="card" @click="$emit('view-product', product)">
    <div class="card-image placeholder-image"
      :style="{ backgroundImage: `url(${product.image})` }"></div>
    <div class="card-content">
      <div class="card-author">Dee Lestari</div>
      <span class="card-category">{{ product.categoryDisplay }}</span>
      <h3 class="card-title">{{ product.title }}</h3>
      <p class="card-desc">{{ product.description }}</p>
      <div class="card-price-container" style="margin-top: auto;">
        <div class="price-main">{{ formatRupiah(product.price) }}</div>
        <div v-if="product.originalPrice" class="price-discount-row">
          <span class="discount-badge">{{ discountPercentage }}%</span>
          <span class="price-original">{{ formatRupiah(product.originalPrice) }}</span>
        </div>
      </div>
      <div class="card-actions" style="margin-top: 0.75rem;">
        <div class="qty-control">
          <button class="qty-btn minus" :aria-label="t('decreaseQty')" @click.stop="$emit('update-quantity', product, -1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <span class="qty-val">{{ quantity }}</span>
          <button class="qty-btn plus" :aria-label="t('increaseQty')" @click.stop="$emit('update-quantity', product, 1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
/* Global styles used */
.card {
  cursor: pointer;
}
</style>
