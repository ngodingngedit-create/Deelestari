<script setup>
import { ref, onMounted, computed } from 'vue';
import { RouterView } from 'vue-router';
import SiteHeader from './components/layout/SiteHeader.vue';
import MobileSidebar from './components/layout/MobileSidebar.vue';
import DashboardSidebar from './components/layout/DashboardSidebar.vue';
import CartSidebar from './components/cart/CartSidebar.vue';
import FloatingCartBar from './components/cart/FloatingCartBar.vue';
import ToastNotification from './components/ui/ToastNotification.vue';
import { store } from './store';

import { useRouter, useRoute } from 'vue-router';

const isMobileMenuOpen = ref(false);
const isCartOpen = ref(false);
const router = useRouter();
const route = useRoute();

onMounted(() => {
  store.initAuth();
});

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
const isDashboard = computed(() => route.path.startsWith('/dashboard'));
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

    <div class="main-layout" :class="{ 'has-sidebar': store.isAuthenticated && isDashboard }">
      <DashboardSidebar v-if="store.isAuthenticated && isDashboard" />
      
      <div class="content-wrapper">
        <RouterView />
      </div>
    </div>

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
.main-layout {
  display: flex;
  min-height: calc(100vh - 80px); /* Adjust based on header height */
}

.main-layout.has-sidebar .content-wrapper {
  flex: 1;
  background: #141414;
}

.content-wrapper {
  width: 100%;
}
</style>
