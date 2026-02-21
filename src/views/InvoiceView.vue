<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../store';
import { useLanguage } from '../composables/useLanguage';

const router = useRouter();
const { t } = useLanguage();

const order = computed(() => store.lastOrder);

const formatDate = (date) => {
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
  return 'Rp ' + amount.toLocaleString('id-ID');
};

onMounted(() => {
  if (!store.lastOrder) {
    router.push('/');
  }
});
</script>

<template>
  <div class="invoice-page" v-if="order">
    <div class="invoice-container">
      
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
</style>
