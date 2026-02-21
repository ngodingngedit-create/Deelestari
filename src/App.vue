<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import SiteHeader from './components/layout/SiteHeader.vue';
import MobileSidebar from './components/layout/MobileSidebar.vue';
import CartSidebar from './components/cart/CartSidebar.vue';
import FloatingCartBar from './components/cart/FloatingCartBar.vue';
import ToastNotification from './components/ui/ToastNotification.vue';
import { store } from './store';

import { useRouter, useRoute } from 'vue-router';

const isMobileMenuOpen = ref(false);
const isCartOpen = ref(false);
const router = useRouter();
const route = useRoute();

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value;
};

const handleUpdateQuantity = (productId, change) => {
  store.updateQuantity(productId, change);
};

const handleCheckout = () => {
  if (route.path === '/checkout') {
    // If already on checkout page, trigger form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
      checkoutForm.requestSubmit();
    }
  } else {
    isCartOpen.value = false;
    router.push('/checkout');
  }
};
</script>

<template>
  <div>
    <SiteHeader @toggle-menu="toggleMobileMenu" @toggle-cart="toggleCart" />
    
    <MobileSidebar :isOpen="isMobileMenuOpen" @close="isMobileMenuOpen = false" />
    
    <CartSidebar 
      :isOpen="isCartOpen" 
      :cartItems="store.cart" 
      @close="isCartOpen = false" 
      @update-quantity="handleUpdateQuantity"
      @checkout="handleCheckout"
    />

    <RouterView />

    <FloatingCartBar 
      v-if="!isCartOpen"
      :cartItems="store.cart" 
      @update-quantity="handleUpdateQuantity"
      @checkout="handleCheckout"
    />

    <ToastNotification />
  </div>
</template>

<style>
/* Global styles imported in main.js */
</style>
