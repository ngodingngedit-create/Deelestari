<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { store } from '../store';
import { useLanguage } from '../composables/useLanguage';

const router = useRouter();
const route = useRoute();
const { t } = useLanguage();

const loading = ref(false);
const error = ref(null);
const orderData = ref(null);

const order = computed(() => orderData.value);

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatRupiah = (amount) => {
  if (!amount) return 'Rp 0';
  return 'Rp ' + amount.toLocaleString('id-ID');
};

const mapOrderData = async (data) => {
    console.log('Mapping Order Data:', data);
    
    // Priority fallbacks for items based on provided JSON
    const rawItems = Array.isArray(data.detail) ? data.detail :
                    Array.isArray(data.merch_order_details) ? data.merch_order_details :
                    Array.isArray(data.merch_order_detail) ? data.merch_order_detail :
                    Array.isArray(data.order_details) ? data.order_details :
                    Array.isArray(data.items) ? data.items : [];
                    
    console.log('Raw Items found:', rawItems);

    const baseUrl = import.meta.env.VITE_API_URL || 'https://api.kolektix.cloud';
    
    // Fetch all products to match items against (global catalog for invoice matching)
    let allProducts = [];
    try {
        const pResp = await fetch(`${baseUrl}/api/product`);
        const pResult = await pResp.json();
        allProducts = pResult.data || [];
    } catch (e) {
        console.error('Error fetching product catalog:', e);
    }
    
    const enrichedItems = rawItems.map(detail => {
        const productId = detail.product_id || detail.product?.id || detail.id;
        const catProd = allProducts.find(p => p.id == productId || String(p.id) === String(productId));
        
        return {
            id: detail.id,
            title: catProd?.product_name || detail.product?.product_name || detail.product_name || detail.title || 'Product',
            quantity: detail.qty || detail.quantity || 1,
            price: parseFloat(detail.price || 0),
            image: (catProd?.product_image?.[0]?.image_url) || 
                   (detail.product?.product_image?.[0]?.image_url) || 
                   (detail.product_images?.[0]?.image_url) ||
                   'https://placehold.co/100',
            note: detail.order_notes || detail.note
        };
    });

    return {
        id: data.invoice_no || data.id,
        date: data.created_at || data.created_date || data.date,
        paymentMethod: data.payment_method_custom || data.payment_method || 'Xendit',
        items: enrichedItems,
        customer: {
            fullName: data.address?.nama_penerima || data.address?.name || data.name_pemesan || data.user?.name || 'Customer',
            phone: data.address?.phone || data.address?.no_telp || data.phone_pemesan || data.user?.phone || '-',
            email: data.user?.email || data.email_pemesan || '-',
            address: data.address?.address_detail || data.address?.alamat || '-',
            storeLocation: data.pickup?.location_name || data.customer?.storeLocation
        },
        subtotal: parseFloat(data.total_price || data.subtotal || 0),
        shipping: parseFloat(data.delivery_price || data.shipping || 0),
        discount: parseFloat(data.discount || 0),
        total: parseFloat(data.grandtotal || data.total || 0)
    };
};

const fetchOrder = async (id) => {
    loading.value = true;
    error.value = null;
    try {
        const baseUrl = import.meta.env.VITE_API_URL || 'https://api.kolektix.cloud';
        const response = await fetch(`${baseUrl}/api/order-product-invoice/${id}`);
        const result = await response.json();
        console.log('API Invoice Response:', result);
        
        if (result.status && result.data) {
            const rawOrder = result.data.order || result.data || result;
            orderData.value = await mapOrderData(rawOrder);
        } else {
            error.value = result.message || 'Invoice tidak ditemukan';
        }
    } catch (err) {
        console.error('Fetch invoice error:', err);
        error.value = 'Gagal memuat data invoice';
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
  if (store.lastOrder) {
    orderData.value = await mapOrderData(store.lastOrder);
  } else if (route.params.invoiceId) {
    await fetchOrder(route.params.invoiceId);
  } else {
    setTimeout(() => {
        if (!orderData.value && !loading.value) {
            router.push('/');
        }
    }, 500);
  }
});
</script>

<template>
  <div class="invoice-page">
    <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>Memuat invoice...</p>
    </div>

    <div v-else-if="error" class="error-state">
        <div class="error-icon">!</div>
        <h3>{{ error }}</h3>
        <button class="home-btn" @click="router.push('/')">Kembali ke Beranda</button>
    </div>

    <div v-else-if="order" class="invoice-container">
      
      <!-- Success Header -->
      <div class="invoice-header">
        <div class="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <h1>{{ t('invoiceSuccess') }}</h1>
        <p>{{ t('invoiceSubtitle') }}</p>
      </div>

      <!-- Order Meta -->
      <div class="order-meta-card">
        <div class="meta-row">
          <span class="meta-label">{{ t('noPesanan') }}</span>
          <span class="meta-value copyable">#{{ order.id }}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">{{ t('waktuPesan') }}</span>
          <span class="meta-value">{{ formatDate(order.date) }}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">{{ t('metodeBayar') }}</span>
          <span class="meta-value">{{ order.paymentMethod }}</span>
        </div>
      </div>

      <!-- Order Items -->
      <div class="invoice-section">
        <h3>{{ t('rincianBarang') }}</h3>
        <div class="invoice-items">
          <div v-for="item in order.items" :key="item.id" class="invoice-item">
            <div class="item-visual" :style="{ backgroundImage: `url(${item.image})` }"></div>
            <div class="item-details">
              <h4>{{ item.title }}</h4>
              <p>{{ t('qty') }}: {{ item.quantity }}</p>
              <p v-if="item.note" class="item-note">{{ t('catatan') }}: {{ item.note }}</p>
            </div>
            <div class="item-price">
              {{ formatRupiah(item.price * item.quantity) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Customer Info -->
      <div class="invoice-section">
        <h3>{{ t('infoKirim') }}</h3>
        <div class="customer-info">
          <p><strong>{{ order.customer.fullName }}</strong></p>
          <p>{{ order.customer.phone }}</p>
          <p>{{ order.customer.email }}</p>
          <p class="address">{{ order.customer.address }}</p>
          <p v-if="order.customer.storeLocation"><strong>{{ t('ambilToko') }}</strong> {{ order.customer.storeLocation }}</p>
        </div>
      </div>

      <!-- Totals -->
      <div class="invoice-summary">
        <div class="summary-row">
          <span>{{ t('totalHarga') }}</span>
          <span>{{ formatRupiah(order.subtotal) }}</span>
        </div>
        <div class="summary-row">
          <span>{{ t('totalOngkir') }}</span>
          <span>{{ formatRupiah(order.shipping) }}</span>
        </div>
        <div class="summary-row" v-if="order.discount > 0">
          <span>Discount</span>
          <span class="discount-text">- {{ formatRupiah(order.discount) }}</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-total">
          <span>{{ t('totalBayar') }}</span>
          <span class="total-amount">{{ formatRupiah(order.total) }}</span>
        </div>
      </div>

      <!-- Action -->
      <div class="invoice-actions">
        <button class="home-btn" @click="router.push('/')">{{ t('kembali') }}</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.invoice-page {
  padding: 60px 20px 100px;
  background-color: var(--bg-dark, #1B1B1B);
  color: var(--text-light, #F4F1EC);
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

.invoice-container {
  width: 100%;
  max-width: 600px;
  background: #222;
  border-radius: 16px;
  padding: 40px;
  border: 1px solid #333;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
}

.invoice-header {
  text-align: center;
  margin-bottom: 40px;
}

.success-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  border-radius: 50%;
  margin: 0 auto 20px;
}

.invoice-header h1 {
  font-family: 'Playfair Display', serif;
  margin-bottom: 10px;
  font-size: 2rem;
}

.invoice-header p {
  color: #888;
}

.order-meta-card {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid #333;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.95rem;
}

.meta-row:last-child {
  margin-bottom: 0;
}

.meta-label {
  color: #888;
}

.meta-value {
  font-weight: 600;
  text-align: right;
}

.invoice-section {
  margin-bottom: 30px;
  border-bottom: 1px solid #333;
  padding-bottom: 25px;
}

.invoice-section h3 {
  font-size: 1.1rem;
  margin-bottom: 15px;
  color: var(--secondary-accent, #9e4d3d);
  font-family: 'Plus Jakarta Sans', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.invoice-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.invoice-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.item-visual {
  width: 50px;
  height: 50px;
  background-size: cover;
  background-position: center;
  border-radius: 6px;
  flex-shrink: 0;
  border: 1px solid #333;
}

.item-details {
  flex-grow: 1;
}

.item-details h4 {
  font-size: 0.95rem;
  margin-bottom: 2px;
  font-family: 'Playfair Display', serif;
}

.item-details p {
  font-size: 0.85rem;
  color: #888;
}

.item-note {
  font-style: italic;
  font-size: 0.8rem;
  color: #666;
  margin-top: 4px;
}

.item-price {
  font-weight: 600;
  color: var(--secondary-accent, #9e4d3d);
}

.customer-info p {
  margin-bottom: 5px;
  color: #ccc;
  font-size: 0.95rem;
}

.customer-info .address {
  margin-top: 10px;
  line-height: 1.4;
}

.invoice-summary {
  margin-bottom: 40px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #ccc;
  font-size: 0.95rem;
}

.discount-text {
  color: #ff4d4f;
}

.summary-divider {
  height: 1px;
  background: #444;
  margin: 15px 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 1.2rem;
}

.total-amount {
  color: var(--secondary-accent, #9e4d3d);
}

.invoice-actions {
  text-align: center;
}

.home-btn {
  background: var(--secondary-accent, #9e4d3d);
  color: white;
  border: none;
  padding: 14px 40px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.home-btn:hover {
  background: #b55846;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(158, 77, 61, 0.4);
}

@media (max-width: 600px) {
  .invoice-container {
    padding: 25px;
  }
}

.loading-state, .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    text-align: center;
    width: 100%;
}

.loader {
    width: 48px;
    height: 48px;
    border: 5px solid #333;
    border-bottom-color: #9e4d3d;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    margin-bottom: 20px;
}

@keyframes rotation {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.error-icon {
    width: 64px;
    height: 64px;
    background: rgba(255, 77, 79, 0.1);
    color: #ff4d4f;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 20px;
}
</style>
