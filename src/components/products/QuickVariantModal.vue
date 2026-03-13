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

const selectedVariantId = ref(null);

// Reset or initialize selected variant when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal && props.product.variants && props.product.variants.length > 0) {
    // Try to find if any variant is already in cart
    const inCart = props.product.variants.find(v => store.cart.some(item => item.id === props.product.id && item.variant_id === v.id));
    if (inCart) {
      selectedVariantId.value = inCart.id;
    } else {
      // Find first not sold out variant
      const firstAvailable = props.product.variants.find(v => {
        const isSoldOut = v.is_soldout == 1 || v.is_soldout === true || v.is_soldout === '1' || v.is_soldout === 'true';
        return !isSoldOut && (v.stock_qty > 0 || v.stock > 0);
      });
      selectedVariantId.value = firstAvailable ? firstAvailable.id : props.product.variants[0].id;
    }
  }
}, { immediate: true });

const selectedVariant = computed(() => {
  return props.product.variants?.find(v => v.id === selectedVariantId.value) || null;
});

const formatRupiah = (amount) => {
  if (!amount) return 'Rp 0';
  return 'Rp ' + amount.toLocaleString('id-ID');
};

const currentQuantity = computed(() => {
  if (!selectedVariantId.value) return 0;
  const item = store.cart.find(i => i.id === props.product.id && i.variant_id === selectedVariantId.value);
  return item ? item.quantity : 0;
});

const updateQuantity = (change) => {
  if (!selectedVariant.value) return;
  
  const currentQty = currentQuantity.value;
  if (change > 0) {
    const productWithVariant = {
      ...props.product,
      variant_name: selectedVariant.value.varian_name || selectedVariant.value.variant_name || selectedVariant.value.name,
      price: parseFloat(selectedVariant.value.price)
    };
    store.addToCart(productWithVariant, 1, selectedVariantId.value);
  } else if (currentQty > 0) {
    store.updateQuantity(props.product.id, -1, selectedVariantId.value);
  }
};

const totalProductQuantity = computed(() => {
  return store.cart
    .filter(item => item.id === props.product.id)
    .reduce((sum, item) => sum + item.quantity, 0);
});

const activeStock = computed(() => {
  if (!selectedVariant.value) return 0;
  const isSoldOut = selectedVariant.value.is_soldout == 1 || selectedVariant.value.is_soldout === true || selectedVariant.value.is_soldout === '1' || selectedVariant.value.is_soldout === 'true';
  if (isSoldOut) return 0;
  return (selectedVariant.value.stock_qty !== undefined ? selectedVariant.value.stock_qty : selectedVariant.value.stock) || 0;
});
</script>

<template>
  <div class="modal-overlay" :class="{ active: isOpen }" @click="$emit('close')">
    <div class="modal-content quick-variant-content" @click.stop>
      <button class="modal-close" @click="$emit('close')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div class="quick-variant-grid">
        <!-- Image Header -->
        <div class="product-image-section">
          <img :src="product.image" :alt="product.title" class="product-img-preview" />
          <div v-if="product.isPreorder" class="preorder-badge-mini">PRE-ORDER</div>
        </div>

        <div class="product-info-section">
          <h3 class="product-title">{{ product.title }}</h3>
          <p class="product-desc-mini">{{ product.description }}</p>
          
          <div class="price-display">
            <span class="current-price">{{ formatRupiah(selectedVariant ? parseFloat(selectedVariant.price) : product.price) }}</span>
            <span v-if="product.originalPrice" class="old-price">{{ formatRupiah(product.originalPrice) }}</span>
          </div>

          <div class="selection-controls">
            <div class="control-group">
              <label class="control-label">{{ product.variants[0]?.product_varian_category?.varian_name || 'Varian' }}</label>
              <div class="custom-select-wrapper">
                <select v-model="selectedVariantId" class="variant-select">
                  <option v-for="variant in product.variants" :key="variant.id" :value="variant.id">
                    {{ variant.varian_name || variant.variant_name || variant.name }} 
                    <template v-if="variant.is_soldout == 1 || variant.is_soldout === '1' || ((variant.stock_qty !== undefined ? variant.stock_qty : variant.stock) || 0) <= 0"> (Sold Out)</template>
                    - {{ formatRupiah(parseFloat(variant.price)) }}
                  </option>
                </select>
                <div class="select-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            <div class="control-group">
              <div class="qty-label-row">
                <label class="control-label">{{ t('quantity') }}</label>
                <span class="stock-info">{{ t('stock') }}: {{ activeStock }}</span>
              </div>
              <div class="qty-selector-big">
                <button 
                  class="qty-btn-large" 
                  @click="updateQuantity(-1)" 
                  :disabled="currentQuantity <= 0 || activeStock <= 0"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
                <span class="qty-value-large">{{ currentQuantity }}</span>
                <button 
                  class="qty-btn-large" 
                  @click="updateQuantity(1)"
                  :disabled="currentQuantity >= activeStock || activeStock <= 0 || (selectedVariant && (selectedVariant.is_soldout == 1 || selectedVariant.is_soldout === '1'))"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="modal-actions" v-if="totalProductQuantity > 0">
             <button class="confirm-btn" @click="$emit('close')" :disabled="activeStock <= 0">
               {{ activeStock <= 0 ? 'Sold Out' : (t('btnAddToCart') || 'Tambah ke Keranjang') }} ({{ totalProductQuantity }})
             </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.modal-overlay.active {
  opacity: 1;
  visibility: visible;
}

.modal-content {
  background: #1a1a1a;
  border-radius: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  position: relative;
  overflow: hidden;
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.7);
  transform: scale(0.95) translateY(20px);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-overlay.active .modal-content {
  transform: scale(1) translateY(0);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #9e4d3d;
  transform: rotate(90deg);
}

.quick-variant-grid {
  display: flex;
  flex-direction: column;
}

.product-image-section {
  width: 100%;
  height: 220px;
  position: relative;
  overflow: hidden;
  background: #111;
}

.product-img-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.preorder-badge-mini {
  position: absolute;
  top: 16px;
  left: 16px;
  background: #f1c40f;
  color: #000;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 800;
}

.product-info-section {
  padding: 24px;
  overflow-y: auto;
}

.product-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  color: #fff;
  margin-bottom: 6px;
  line-height: 1.2;
}

.product-desc-mini {
  color: #aaa;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price-display {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.current-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #9e4d3d;
}

.old-price {
  font-size: 1rem;
  color: #555;
  text-decoration: line-through;
}

.selection-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-label {
  color: #888;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.custom-select-wrapper {
  position: relative;
  width: 100%;
}

.variant-select {
  width: 100%;
  padding: 14px 16px;
  background: #252525;
  border: 1px solid #333;
  border-radius: 12px;
  color: #fff;
  font-size: 0.95rem;
  appearance: none;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
}

.variant-select:focus {
  border-color: #9e4d3d;
  box-shadow: 0 0 0 3px rgba(158, 77, 61, 0.15);
}

.select-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  pointer-events: none;
}

.qty-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stock-info {
  font-size: 0.8rem;
  color: #666;
}

.qty-selector-big {
  display: flex;
  align-items: center;
  background: #252525;
  border-radius: 10px;
  padding: 3px;
  border: 1px solid #333;
  justify-content: space-between;
  width: fit-content;
  min-width: 130px;
  margin-left: auto;
}

.qty-btn-large {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: #333;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn-large:hover:not(:disabled) {
  background: #9e4d3d;
  box-shadow: 0 4px 12px rgba(158, 77, 61, 0.3);
}

.qty-btn-large:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

.qty-value-large {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  min-width: 30px;
  text-align: center;
}

.modal-actions {
  margin-top: 8px;
}

.confirm-btn {
  width: 100%;
  background: #9e4d3d;
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 16px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(158, 77, 61, 0.3);
  background: #b55846;
}

@media (max-width: 480px) {
  .modal-content {
    width: 100%;
    border-radius: 24px 24px 0 0;
    margin-top: auto;
    transform: translateY(100%);
    max-height: 85vh;
  }
  
  .modal-overlay.active .modal-content {
    transform: translateY(0);
  }
  
  .modal-overlay {
    align-items: flex-end;
  }

  .product-image-section {
    height: 150px;
  }

  .product-info-section {
    padding: 16px;
  }
  
  .product-title {
    font-size: 1.1rem;
  }
  
  .selection-controls {
    gap: 12px;
  }
}
</style>
