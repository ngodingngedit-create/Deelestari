<script setup>
import { ref, computed } from 'vue';
import HeroSection from '../components/layout/HeroSection.vue';
import CategoryFilter from '../components/products/CategoryFilter.vue';
import ProductGrid from '../components/products/ProductGrid.vue';
import ProductDetailModal from '../components/products/ProductDetailModal.vue';
import { products } from '../data/products';
import { store } from '../store';

const searchQuery = ref('');
const activeCategory = ref('Semua');
const selectedProduct = ref(null);
const isModalOpen = ref(false);

const filteredProducts = computed(() => {
  return products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    if (activeCategory.value === 'Semua') return matchesSearch;
    
    const lowerCategory = activeCategory.value.toLowerCase();
    const matchesChip = product.category === lowerCategory || product.title.toLowerCase().includes(lowerCategory);
    
    return matchesSearch && matchesChip;
  });
});

const handleSearch = (query) => {
  searchQuery.value = query;
};

const handleCategoryChange = (category) => {
  activeCategory.value = category;
};

const handleUpdateQuantity = (product, change) => {
  if (change > 0) {
    store.addToCart(product, change);
  } else {
    store.updateQuantity(product.id, change);
  }
};

const openProductModal = (product) => {
  selectedProduct.value = product;
  isModalOpen.value = true;
};

const closeProductModal = () => {
  isModalOpen.value = false;
  setTimeout(() => {
    selectedProduct.value = null;
  }, 300);
};
</script>

<template>
  <main>
    <HeroSection @search="handleSearch" />
    <CategoryFilter :activeCategory="activeCategory" @change-category="handleCategoryChange" />
    <ProductGrid 
      :products="filteredProducts" 
      :cartItems="store.cart" 
      @update-quantity="handleUpdateQuantity" 
      @view-product="openProductModal"
    />
    
    <ProductDetailModal 
      v-if="selectedProduct" 
      :product="selectedProduct" 
      :isOpen="isModalOpen" 
      @close="closeProductModal" 
    />
  </main>
</template>
