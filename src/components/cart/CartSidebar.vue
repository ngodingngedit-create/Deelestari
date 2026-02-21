<script setup>
import { computed } from 'vue';
import { store } from '../../store';
import { useLanguage } from '../../composables/useLanguage';

const props = defineProps({
  isOpen: Boolean,
  cartItems: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'update-quantity', 'checkout']);
const { t } = useLanguage();

// Calculate total
const totalPrice = computed(() => {
  return props.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const formatRupiah = (amount) => {
  return 'Rp ' + amount.toLocaleString('id-ID');
};
</script>

<template>
  <div>
    <div class="cart-overlay" :class="{ active: isOpen }" @click="$emit('close')"></div>
    <aside class="cart-sidebar" :class="{ active: isOpen }">
      <div class="cart-header">
        <div>
          <h3>{{ t('cartTitle') }}</h3>
          <span class="cart-subtitle">{{ store.totalItems }} {{ t('items') }}</span>
        </div>
        <button class="cart-close" aria-label="Close Cart" @click="$emit('close')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="cart-items">
        <div v-if="cartItems.length === 0" class="empty-cart-message">{{ t('emptyCart') }}</div>
        
        <div v-else v-for="item in cartItems" :key="item.id" class="cart-item">
          <div class="cart-item-image" :style="item.imageStyle"></div>
          <div class="cart-item-details">
            <div class="cart-item-author" style="font-size: 0.75rem; color: #888; margin-bottom: 2px;">{{ item.author }}</div>
            <h4 class="cart-item-title">{{ item.title }}</h4>
            <div class="cart-item-price" style="font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 1rem; color: #9e4d3d; margin-bottom: 5px;">{{ formatRupiah(item.price) }}</div>
            <div class="cart-item-controls">
              <button class="cart-qty-btn minus" @click="$emit('update-quantity', item.id, -1)">-</button>
              <span class="cart-item-qty">{{ item.quantity }}</span>
              <button class="cart-qty-btn plus" @click="$emit('update-quantity', item.id, 1)">+</button>
            </div>
          </div>
        </div>
      </div>

      <div class="cart-footer">
        <div class="cart-total">
          <span>{{ t('total') }}:</span>
          <span class="total-count">{{ formatRupiah(totalPrice) }}</span>
        </div>
        <button class="checkout-btn" @click="$emit('checkout')">{{ t('checkout') }}</button>
      </div>
    </aside>
  </div>
</template>

<style scoped>
/* Scoped styles mainly handled by global CSS */
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.cart-subtitle {
  font-size: 0.9rem;
  color: #888;
  display: block;
  margin-top: 4px;
}
</style>
