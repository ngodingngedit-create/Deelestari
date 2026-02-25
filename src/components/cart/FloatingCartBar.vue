<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { store } from '../../store';
import { useLanguage } from '../../composables/useLanguage';

const props = defineProps({
  cartItems: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update-quantity', 'checkout']);
const route = useRoute();
const { t } = useLanguage();

const isDetailOpen = ref(false);

const totalPrice = computed(() => {
  return props.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const totalCount = computed(() => {
  return props.cartItems.reduce((sum, item) => sum + item.quantity, 0);
});

const formatRupiah = (amount) => {
  return 'Rp ' + amount.toLocaleString('id-ID');
};

const toggleDetail = () => {
  isDetailOpen.value = !isDetailOpen.value;
};
</script>

<template>
  <div class="floating-cart-bar" :class="{ active: totalCount > 0 }">
    <!-- Detail Panel -->
    <div class="floating-detail-panel" :class="{ active: isDetailOpen }">
      <div class="detail-panel-header">
        <h3>{{ t('productDetails') }}</h3>
        <button class="detail-close-btn" @click="isDetailOpen = false">&times;</button>
      </div>
      <div class="detail-items-list">
        <div v-for="item in cartItems" :key="item.id" class="detail-item-row">
          <div class="detail-item-info">
            <h4>{{ item.title }}</h4>
            <span v-if="item.variant_name" class="detail-item-variant">{{ item.variant_name }}</span>
          </div>
          <div class="detail-item-actions">
            <div class="detail-qty-control">
              <button class="detail-qty-btn minus" @click="$emit('update-quantity', item.id, -1)">-</button>
              <span class="detail-qty-val">{{ item.quantity }}</span>
              <button class="detail-qty-btn plus" @click="$emit('update-quantity', item.id, 1)">+</button>
            </div>
            <span class="detail-item-price">{{ formatRupiah(item.price * item.quantity) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="floating-cart-content">
      <div class="floating-cart-info">
        <span class="floating-total-label">{{ t('total') }} <span class="floating-item-count">{{ totalCount }}</span> {{ t('itemsCount') }}</span>
        <span class="floating-total-price">{{ formatRupiah(totalPrice) }}</span>
      </div>
      <div class="floating-cart-actions">
        <button class="floating-detail-btn" @click="toggleDetail">
          {{ t('detail') }} <span class="detail-badge">{{ totalCount }}</span> 
          <i class="chevron-down" :style="{ transform: isDetailOpen ? 'rotate(-135deg)' : 'rotate(45deg)', marginTop: isDetailOpen ? '5px' : '0' }"></i>
        </button>
        <button class="floating-checkout-btn" :disabled="store.checkoutLoading" @click="$emit('checkout')">
          <span v-if="store.checkoutLoading" class="mini-loader"></span>
          <span v-else>{{ route.path === '/checkout' ? t('payNow') : t('buyNow') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles mainly handled by global CSS */
.floating-cart-bar {
  z-index: 2500; /* Ensure it stays above modal (z-index 2000) */
}

.mini-loader {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-bottom-color: #fff;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.floating-checkout-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
