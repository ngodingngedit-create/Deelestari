<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import HeroSection from '../components/layout/HeroSection.vue';
import CategoryFilter from '../components/products/CategoryFilter.vue';
import ProductGrid from '../components/products/ProductGrid.vue';
import ProductDetailModal from '../components/products/ProductDetailModal.vue';
import { useProducts } from '../composables/useProducts';
import { store } from '../store';

const { products: apiProducts, loading, fetchProducts, loadMore, lastPage, currentPage } = useProducts();

const searchQuery = ref('');
const activeCategory = ref('Semua');
const selectedProduct = ref(null);
const isModalOpen = ref(false);

const filteredProducts = computed(() => {
  return apiProducts.value.filter(product => {
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

onMounted(() => {
  fetchProducts(1, false, 48);
});
</script>

<template>
  <main>
    <HeroSection @search="handleSearch" />
    <CategoryFilter :activeCategory="activeCategory" @change-category="handleCategoryChange" />
    <ProductGrid 
      :products="filteredProducts" 
      :cartItems="store.cart" 
      :loading="loading"
      :has-more="currentPage < lastPage"
      @update-quantity="handleUpdateQuantity" 
      @view-product="openProductModal"
      @load-more="loadMore"
    />
    
    <ProductDetailModal 
      v-if="selectedProduct" 
      :product="selectedProduct" 
      :isOpen="isModalOpen" 
      @close="closeProductModal" 
    />
  </main>
</template>
