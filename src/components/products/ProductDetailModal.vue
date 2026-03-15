<script setup>
import { ref, computed, watch } from 'vue';
import { store } from '../../store';
import { useLanguage } from '../../composables/useLanguage';

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  isOpen: Boolean
});

const emit = defineEmits(['close']);
const { t } = useLanguage();

const quantity = ref(0);
const selectedVariantId = ref(null);

// Reset quantity when product changes or modal opens
watch(() => props.product, (newProduct) => {
  quantity.value = 0;
  selectedVariantId.value = null; // Don't auto-select
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    quantity.value = 0;
    selectedVariantId.value = null; // Don't auto-select
  }
});

watch(selectedVariantId, () => {
  quantity.value = 0;
});

const activePrice = computed(() => {
  if (selectedVariantId.value) {
    const variant = props.product.variants?.find(v => v.id === selectedVariantId.value);
    if (variant) return parseFloat(variant.price);
  }
  return props.product.price;
});

const activeStock = computed(() => {
  if (selectedVariantId.value) {
    const variant = props.product.variants?.find(v => v.id === selectedVariantId.value);
    if (variant) {
      // Robust check for sold out status
      const isSoldOut = variant.is_soldout == 1 || variant.is_soldout === true || variant.is_soldout === '1' || variant.is_soldout === 'true';
      if (isSoldOut) return 0;
      return (variant.stock_qty !== undefined ? variant.stock_qty : variant.stock) || 0;
    }
  }
  return props.product.stock;
});

const formatRupiah = (amount) => {
  if (!amount) return 'Rp 0';
  return 'Rp ' + amount.toLocaleString('id-ID');
};

const updateQuantity = (change) => {
  const newQty = quantity.value + change;
  if (newQty >= 0 && newQty <= (activeStock.value || 0)) {
    quantity.value = newQty;
  }
};

const addToCart = () => {
  if (quantity.value > 0) {
    const variant = props.product.variants?.find(v => v.id === selectedVariantId.value);
    const productWithVariant = {
        ...props.product,
        variant_name: variant ? (variant.varian_name || variant.variant_name || variant.name) : null
    };
    store.addToCart(productWithVariant, quantity.value, selectedVariantId.value);
    emit('close');
  }
};

const totalPrice = computed(() => {
  return activePrice.value * quantity.value;
});
</script>

<template>
  <div class="modal-overlay" :class="{ active: isOpen }" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="$emit('close')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div class="product-detail-grid">
        <div class="product-image-col">
          <div class="product-image" :style="{ backgroundImage: `url(${product.image})` }"></div>
        </div>
        
        <div class="product-info-col">
          <div class="product-header">
             <div class="product-meta">
              <span class="product-category">{{ product.categoryDisplay }}</span>
              <span v-if="product.isPreorder" class="preorder-badge-inline">Pre-Order</span>
              <span class="product-year">{{ product.year }}</span>
            </div>
            <div class="header-actions">
              <button class="icon-btn" :title="t('addToFavorite')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
              <button class="icon-btn" :title="t('share')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </button>
            </div>
          </div>
         
          <h2 class="product-title">{{ product.title }}</h2>
          <div class="product-author">{{ product.author }}</div>
          
          <div class="product-price-section">
            <div class="price-main">{{ formatRupiah(activePrice) }}</div>
            <div v-if="product.originalPrice" class="price-original">{{ formatRupiah(product.originalPrice) }}</div>
            <div v-if="product.originalPrice" class="discount-pill">{{ t('save') }} {{ Math.round(((product.originalPrice - activePrice) / product.originalPrice) * 100) }}%</div>
          </div>
          
          <div class="product-description-section">
            <h4 class="section-label">{{ t('description') }}</h4>
            <p class="product-description">{{ product.description }}</p>
            
            <div v-if="product.category === 'merchandise' && (product.title.toLowerCase().includes('kaos') || product.title.toLowerCase().includes('t-shirt') || product.title.toLowerCase().includes('baju'))" class="size-guide-container">
              <h4 class="section-label size-guide-label">Panduan Ukuran (cm)</h4>
              <div class="size-table-wrapper">
                <table class="size-table">
                  <thead>
                    <tr>
                      <th>UKURAN</th>
                      <th>LEBAR DADA</th>
                      <th>PANJANG</th>
                      <th>LENGAN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>M</td>
                      <td>50</td>
                      <td>70</td>
                      <td>59</td>
                    </tr>
                    <tr>
                      <td>L</td>
                      <td>53</td>
                      <td>73</td>
                      <td>60</td>
                    </tr>
                    <tr>
                      <td>XL</td>
                      <td>56</td>
                      <td>75</td>
                      <td>61</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div v-if="product.variants && product.variants.length > 0" class="product-variants-section">
            <h4 class="section-label">{{ product.variants[0]?.product_varian_category?.varian_name || 'Varian' }}</h4>
            <div class="variants-grid">
              <button 
                v-for="variant in product.variants" 
                :key="variant.id"
                class="variant-chip"
                :class="{ 
                  active: selectedVariantId === variant.id,
                  'is-out-of-stock': ((variant.stock_qty !== undefined ? variant.stock_qty : variant.stock) || 0) <= 0 || variant.is_soldout == 1 || variant.is_soldout === '1'
                }"
                @click="selectedVariantId = variant.id"
              >
                {{ variant.varian_name || variant.variant_name || variant.name }}
                <span v-if="((variant.stock_qty !== undefined ? variant.stock_qty : variant.stock) || 0) <= 0 || variant.is_soldout == 1 || variant.is_soldout === '1'" class="habis-text"> (Sold Out)</span>
              </button>
            </div>
          </div>
          
          <div class="product-actions-container">
            <div class="qty-section">
              <div class="qty-header">
                <h4 class="section-label">{{ t('quantity') }}</h4>
                <span class="stock-label">{{ t('stock') }}: {{ activeStock }}</span>
              </div>
              <div class="qty-control big">
                <button class="qty-btn" @click="updateQuantity(-1)" :disabled="quantity <= 0 || activeStock <= 0">-</button>
                <span class="qty-val">{{ quantity }}</span>
                <button class="qty-btn" @click="updateQuantity(1)" :disabled="quantity >= activeStock || activeStock <= 0">+</button>
              </div>
            </div>
            
            <button 
              class="add-to-cart-btn" 
              @click="addToCart" 
              :disabled="quantity <= 0 || (product.variants && product.variants.length > 0 && !selectedVariantId) || activeStock <= 0"
            >
              <span v-if="activeStock <= 0">Sold Out</span>
              <span v-else-if="product.variants && product.variants.length > 0 && !selectedVariantId">Pilih Varian</span>
              <span v-else>{{ t('btnAddToCart') }}</span>
              <span v-if="quantity > 0 && activeStock > 0" class="btn-total-price">{{ formatRupiah(totalPrice) }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Keep existing modal overlay/content styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  padding: 20px;
}

.modal-overlay.active {
  opacity: 1;
  visibility: visible !important;
}

.modal-content {
  background-color: #1e1e1e;
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh; /* Ensure modal doesn't exceed viewport */
  position: relative;
  overflow-y: auto; /* Allow vertical scrolling */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  transform: scale(0.9);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid #333;
}

.modal-overlay.active .modal-content {
  transform: scale(1);
}

.modal-close {
  position: absolute;
  top: 25px;
  right: 30px;
  background: rgba(0,0,0,0.5);
  border: none;
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: #9e4d3d;
  transform: rotate(90deg);
}

.product-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
}

.product-image-col {
  background-color: #111;
  min-height: 400px;
  position: relative;
}

.product-image {
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
  min-height: 500px;
}

.product-info-col {
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Header & Meta */
.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.product-meta {
  display: flex;
  gap: 15px;
  font-size: 0.9rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.product-category {
  color: #9e4d3d;
  font-weight: 600;
}

.preorder-badge-inline {
  background: #f1c40f;
  color: #000;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
}

.header-actions {
  display: flex;
  gap: 10px;
  margin-right: 40px; /* Space for close button if needed, though close button is absolute */
}

.icon-btn {
  background: transparent;
  border: 1px solid #444;
  color: #ddd;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  border-color: #9e4d3d;
  color: #9e4d3d;
  background: rgba(158, 77, 61, 0.1);
}

/* Info */
.product-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  margin-bottom: 5px;
  line-height: 1.2;
}

.product-author {
  font-size: 1.1rem;
  color: #aaa;
  margin-bottom: 20px;
}

.product-description-section {
    margin-bottom: 30px;
}

.section-label {
    font-size: 0.95rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 10px;
    letter-spacing: 0.5px;
}

.product-description {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #ccc;
  max-width: 90%;
  margin-bottom: 20px;
}

.size-guide-container {
  margin-top: 25px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.size-guide-label {
  padding: 12px 15px;
  margin-bottom: 0;
  background: rgba(158, 77, 61, 0.1);
  font-size: 0.85rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.size-table-wrapper {
  overflow-x: auto;
}

.size-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.size-table th {
  background: rgba(0, 0, 0, 0.2);
  color: #888;
  text-align: left;
  padding: 10px 15px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.size-table td {
  padding: 12px 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  color: #ccc;
  font-weight: 500;
}

.size-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.02);
}

.size-table td:first-child {
  font-weight: 800;
  color: #fff;
}

/* Price */
.product-variants-section {
  margin-bottom: 30px;
}

.variants-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.variant-chip {
  padding: 8px 16px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  color: #ccc;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.variant-chip:hover {
  border-color: #9e4d3d;
  color: #fff;
}

.variant-chip.active {
  background: rgba(158, 77, 61, 0.1);
  border-color: #9e4d3d;
  color: #9e4d3d;
  font-weight: 600;
}

.variant-chip.is-out-of-stock {
  opacity: 0.5;
  cursor: not-allowed;
  background: #1a1a1a;
  border-style: dashed;
}

.habis-text {
  font-size: 0.75rem;
  font-weight: 400;
  font-style: italic;
  margin-left: 4px;
}

.product-price-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.price-main {
  font-family: 'Poppins', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #9e4d3d;
}

.price-original {
  text-decoration: line-through;
  color: #666;
  font-size: 1.2rem;
}

.discount-pill {
  background: #9e4d3d;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Actions */
.product-actions-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.qty-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.qty-header {
    display: flex;
    align-items: center;
    gap: 15px;
}

.qty-header .section-label {
    margin-bottom: 0;
}

.stock-label {
  font-size: 0.9rem;
  color: #888;
}

.qty-control.big {
  display: flex;
  align-items: center;
  background: #2a2a2a;
  border-radius: 50px;
  padding: 5px;
  border: 1px solid #333;
  width: fit-content;
}

.qty-control.big .qty-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #333;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-control.big .qty-btn:hover {
  background-color: #444;
}

.qty-control.big .qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-control.big .qty-val {
  width: 50px;
  text-align: center;
  font-weight: 600;
  font-size: 1.2rem;
}

.add-to-cart-btn {
  background-color: #9e4d3d;
  border: none;
  color: white;
  font-weight: 600;
  border-radius: 50px;
  height: 54px;
  padding: 0 30px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  width: 100%;
}

.add-to-cart-btn:hover {
  background-color: #b55846;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(158, 77, 61, 0.3);
}

.add-to-cart-btn:disabled {
    background-color: #444;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    color: #888;
}

.btn-total-price {
  background: rgba(0,0,0,0.2);
  padding: 4px 12px;
  border-radius: 30px;
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px; /* Less padding on small screens */
  }

  .modal-content {
    max-height: 95vh; /* More height on mobile */
  }

  .modal-close {
    top: 15px;
    right: 15px;
    width: 32px;
    height: 32px;
  }

  .product-detail-grid {
    grid-template-columns: 1fr;
  }
  
  .product-image {
    min-height: 300px;
  }
  
  .product-info-col {
    padding: 20px;
  }
  
  .product-title {
    font-size: 1.75rem;
  }

  .product-actions-container {
    padding-bottom: env(safe-area-inset-bottom, 20px); /* Account for mobile browser bars if needed */
  }

  .header-actions {
    margin-right: -10px; /* Push to the far right */
    margin-top: -10px; /* Optional: push closer to the corner/top considering smaller padding */
  }
}
</style>
