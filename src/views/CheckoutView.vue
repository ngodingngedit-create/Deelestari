<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../store';
import { useLanguage } from '../composables/useLanguage';

const router = useRouter();
const { t } = useLanguage();

const formData = ref({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  zip: '',
  notes: '',
  storeLocation: '',
  provinceId: '0',
  cityId: '0'
});

const selectedCourier = ref('');
const selectedCourierType = ref('');

const voucherCode = ref('');
const paymentMethod = ref('QRIS');
const allProducts = ref([]);

// Address Modal State
const showAddressModal = ref(false);
const provinces = ref([]);
const cities = ref([]);
const loadingProvinces = ref(false);
const loadingCities = ref(false);

const addressForm = ref({
  recipientName: '',
  addressLabel: '', // e.g., 'Rumah', 'Kantor'
  phone: '',
  provinceId: '',
  cityName: '',
  zip: '',
  detail: ''
});

// Fetch all products to get admin_fee and other details
onMounted(async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://api.kolektix.cloud';
    const response = await fetch(`${baseUrl}/api/product?creator_id=48`);
    const result = await response.json();
    allProducts.value = result.data || [];
  } catch (err) {
    console.error('Error fetching products for checkout:', err);
  }
});

const fetchProvinces = async () => {
  if (provinces.value.length > 0) return;
  loadingProvinces.value = true;
  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://api.kolektix.cloud';
    const response = await fetch(`${baseUrl}/api/province`);
    const result = await response.json();
    provinces.value = result.data || [];
  } catch (err) {
    console.error('Error fetching provinces:', err);
  } finally {
    loadingProvinces.value = false;
  }
};

const fetchCities = async (provinceId) => {
  if (!provinceId) return;
  loadingCities.value = true;
  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://api.kolektix.cloud';
    const response = await fetch(`${baseUrl}/api/city?province_id=${provinceId}`);
    const result = await response.json();
    cities.value = result.data || [];
  } catch (err) {
    console.error('Error fetching cities:', err);
  } finally {
    loadingCities.value = false;
  }
};

const openAddressModal = () => {
  showAddressModal.value = true;
  fetchProvinces();
};

const saveAddress = () => {
  const selectedProvince = provinces.value.find(p => p.id == addressForm.value.provinceId);
  const selectedCity = cities.value.find(c => c.name == addressForm.value.cityName);
  const provinceName = selectedProvince ? selectedProvince.name : '';
  
  formData.value.fullName = addressForm.value.recipientName;
  formData.value.phone = addressForm.value.phone;
  formData.value.address = `${addressForm.value.detail}, ${addressForm.value.cityName}, ${provinceName}`;
  formData.value.city = addressForm.value.cityName;
  formData.value.zip = addressForm.value.zip;
  formData.value.provinceId = addressForm.value.provinceId || '0';
  formData.value.cityId = selectedCity ? selectedCity.id : '0';
  
  showAddressModal.value = false;
};

const availableStores = computed(() => {
  const stores = [];
  enrichedCart.value.forEach(item => {
    const product = allProducts.value.find(p => p.id == item.id);
    if (product && product.has_store_location) {
      const loc = product.has_store_location;
      // Add if not already in list
      if (!stores.find(s => s.id === loc.id)) {
        stores.push(loc);
      }
    }
  });
  return stores;
});

const enrichedCart = computed(() => {
  return store.cart.map(item => {
    const product = allProducts.value.find(p => p.id == item.id);
    return {
      ...item,
      admin_fee: product ? parseFloat(product.admin_fee || 0) : 0
    };
  });
});

const subtotal = computed(() => {
  return enrichedCart.value.reduce((sum, item) => {
    const price = item.originalPrice || item.price;
    return sum + (price * item.quantity);
  }, 0);
});

const totalAdminFee = computed(() => {
  return enrichedCart.value.reduce((sum, item) => sum + (item.admin_fee * item.quantity), 0);
});

const totalDiscount = computed(() => {
  return enrichedCart.value.reduce((sum, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0);
});

const shippingCost = computed(() => {
  return (selectedCourier.value && selectedCourierType.value) ? 10000 : 0;
});

const voucherDiscount = computed(() => {
  return 0;
});

const total = computed(() => {
  return subtotal.value + totalAdminFee.value + shippingCost.value - totalDiscount.value - voucherDiscount.value;
});

const formatRupiah = (amount) => {
  if (amount === undefined || amount === null) return 'Rp 0';
  return 'Rp ' + amount.toLocaleString('id-ID');
};

const placeOrder = async () => {
  if (store.cart.length === 0) {
    store.showNotification(t('cartEmpty'), 'info');
    return;
  }

  store.checkoutLoading = true;
  
  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://api.kolektix.cloud';
    
    const payload = {
      user_id: 6,
      name_pemesan: formData.value.fullName,
      email_pemesan: formData.value.email,
      phone_pemesan: formData.value.phone,
      creator_id: 6,
      grandtotal: total.value,
      product: store.cart.map(item => {
        const prod = {
          product_id: item.id,
          qty: item.quantity,
          price: item.price,
          order_notes: item.note || ''
        };
        if (item.variant_id) {
          prod.variant_id = item.variant_id;
        }
        return prod;
      }),
      payment_method: "xendit",
      payment_method_id: 4,
      courier: {
        main: selectedCourier.value || "JNE",
        type: selectedCourierType.value || "REG",
        price: shippingCost.value
      },
      address: {
        user_id: 12,
        is_main_address: 1,
        province_id: formData.value.provinceId || "0",
        city_id: formData.value.cityId || "0",
        address_detail: formData.value.address,
        address_name: "Shipping Address",
        zipcode: formData.value.zip || "15147",
        latitude: "",
        longitude: "",
        nama_penerima: formData.value.fullName,
        phone: formData.value.phone,
        is_active: 1
      },
      success_redirect_url: `${window.location.origin}/merch-invoice/{invoice_merch}`,
      failure_redirect_url: `${window.location.origin}/checkout`,
      is_microsite: 1,
      microsite_url: window.location.origin
    };

    const response = await fetch(`${baseUrl}/api/order-product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status && result.data && result.data.order) {
      // Success
      store.setLastOrder(result.data.order);
      store.clearCart();
      
      // Redirect to Xendit
      if (result.data.order.xendit_url) {
        window.location.href = result.data.order.xendit_url;
      } else if (result.xendit_invoice) {
        window.location.href = result.xendit_invoice;
      } else {
        router.push('/invoice');
      }
    } else {
      store.showNotification(result.message || 'Failed to place order', 'error');
    }
  } catch (err) {
    console.error('Checkout error:', err);
    store.showNotification('An error occurred during checkout', 'info');
  } finally {
    store.checkoutLoading = false;
  }
};
</script>

<template>
  <div class="checkout-page">
    <div class="checkout-container">
      <div class="checkout-header">
        <h1>{{ t('checkoutTitle') }}</h1>
      </div>

      <div class="checkout-layout">
        <!-- LEFT COLUMN -->
        <div class="checkout-main">
          
          <!-- Section: Data Pemesan -->
          <section class="checkout-section">
            <div class="section-header">
              <h2>{{ t('dataPemesan') }}</h2>
            </div>
            <div class="section-body">
              <form @submit.prevent="placeOrder" id="checkoutForm">
                <div class="form-group">
                  <label>{{ t('namaLengkap') }} <span class="required">*</span></label>
                  <input type="text" v-model="formData.fullName" :placeholder="t('namaPlaceholder')" required>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>{{ t('email') }} <span class="required">*</span></label>
                    <input type="email" v-model="formData.email" :placeholder="t('emailPlaceholder')" required>
                  </div>
                  <div class="form-group">
                    <label>{{ t('phone') }} <span class="required">*</span></label>
                    <input type="tel" v-model="formData.phone" :placeholder="t('phonePlaceholder')" required>
                  </div>
                </div>

                <div class="form-group">
                  <label>{{ t('storePengambilan') }}</label>
                  <div class="custom-select-wrapper">
                    <select v-model="formData.storeLocation" class="custom-select">
                      <option value="" disabled selected>{{ t('storePlaceholder') }}</option>
                      <option v-for="store in availableStores" :key="store.id" :value="store.store_name">
                        {{ store.store_name }} ({{ store.full_addres }})
                      </option>
                    </select>
                    <div class="select-arrow"></div>
                  </div>
                </div>

                <div class="form-group">
                  <div class="label-with-action">
                    <label>{{ t('alamat') }} <span class="required">*</span></label>
                    <button type="button" class="text-btn" @click="openAddressModal">Pilih Alamat</button>
                  </div>
                  <div class="address-display" v-if="formData.address">
                    <p>{{ formData.address }}</p>
                  </div>
                  <div class="address-placeholder" v-else @click="openAddressModal">
                    <p>Klik untuk memilih atau memasukkan alamat</p>
                  </div>
                </div>

                <!-- Courier Selection -->
                <div class="form-row">
                  <div class="form-group">
                    <label>{{ t('pilihKurir') }} <span class="required">*</span></label>
                    <div class="custom-select-wrapper">
                      <select v-model="selectedCourier" class="custom-select" required>
                        <option value="" disabled selected>{{ t('kurirPlaceholder') }}</option>
                        <option value="JNE">JNE</option>
                        <option value="POS">POS Indonesia</option>
                        <option value="TIKI">TIKI</option>
                      </select>
                      <div class="select-arrow"></div>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>{{ t('tipeKurir') }} <span class="required">*</span></label>
                    <div class="custom-select-wrapper">
                      <select v-model="selectedCourierType" class="custom-select" required>
                        <option value="" disabled selected>{{ t('tipePlaceholder') }}</option>
                        <option value="REG">Reguler</option>
                        <option value="KARGO">Kargo</option>
                        <option value="INSTAN">Instan / Same Day</option>
                      </select>
                      <div class="select-arrow"></div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </section>

          <!-- Section: Order Details -->
          <section class="checkout-section">
            <div class="section-header">
              <h2>{{ t('orderDetails') }}</h2>
            </div>
            <div class="section-body">
              <div class="order-list">
                <div v-if="store.cart.length === 0" class="empty-msg">{{ t('emptyCart') }}</div>
                <div v-else v-for="item in enrichedCart" :key="item.id + (item.variant_id || '')" class="order-item">
                  <div class="item-visual" :style="{ backgroundImage: `url(${item.image})` }"></div>
                  
                  <div class="item-content">
                    <div class="item-header-row">
                        <div class="item-main-info">
                            <h3 class="item-title">{{ item.title }}</h3>
                            <div class="item-meta-info">
                                <span class="info-qty">{{ t('qty') }}: {{ item.quantity }}</span>
                                <span v-if="item.admin_fee > 0" class="info-fee">Admin Fee: {{ formatRupiah(item.admin_fee) }}</span>
                            </div>
                            <div v-if="item.variant_name" class="item-meta">
                                <span class="item-variant">{{ item.variant_name }}</span>
                            </div>
                        </div>
                        <div class="item-pricing">
                            <div class="price-stack">
                                <div class="item-price">{{ formatRupiah(item.price) }}</div>
                                <div v-if="item.originalPrice && item.originalPrice > item.price" class="item-original-price">
                                    <span class="strikethrough">{{ formatRupiah(item.originalPrice) }}</span>
                                    <span class="discount-badge">{{ Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) }}%</span>
                                </div>
                            </div>
                            <div class="checkout-qty-control">
                                <button class="qty-btn small" @click="store.updateQuantity(item.id, -1)">-</button>
                                <span class="qty-val">{{ item.quantity }}</span>
                                <button class="qty-btn small" @click="store.updateQuantity(item.id, 1)">+</button>
                            </div>
                        </div>
                    </div>

                    <div class="item-note-row">
                        <input type="text" class="item-note-input" :placeholder="t('itemNotePlaceholder')" v-model="item.note">
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="checkout-sidebar">
          
          <!-- Voucher -->
          <div class="sidebar-card">
            <h3>{{ t('voucher') }}</h3>
            <div class="voucher-input-group">
              <input type="text" v-model="voucherCode" :placeholder="t('voucherPlaceholder')">
              <button class="apply-btn">{{ t('gunakan') }}</button>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="sidebar-card">
            <h3>{{ t('metodePembayaran') }}</h3>
            <div class="payment-option selected">
              <div class="radio-circle">
                <div class="inner-circle"></div>
              </div>
              <span>QRIS</span>
            </div>
          </div>

          <!-- Summary -->
          <div class="sidebar-card summary-card">
            <h3>{{ t('ringkasan') }}</h3>
            
            <div class="summary-row">
              <span>{{ t('totalHarga') }} ({{ store.totalItems }} {{ t('barang') }})</span>
              <span>{{ formatRupiah(subtotal) }}</span>
            </div>
            <div class="summary-row">
              <span>{{ t('totalOngkir') }}</span>
              <span>{{ formatRupiah(shippingCost) }}</span>
            </div>
            <div class="summary-row" v-if="totalAdminFee > 0">
              <span>Biaya Layanan (Admin Fee)</span>
              <span>{{ formatRupiah(totalAdminFee) }}</span>
            </div>
            <div class="summary-row" v-if="totalDiscount > 0">
              <span>{{ t('totalDiskon') }}</span>
              <span class="discount-text">- {{ formatRupiah(totalDiscount) }}</span>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-total-row">
              <span>{{ t('totalBelanja') }}</span>
              <span class="total-val">{{ formatRupiah(total) }}</span>
            </div>

            <!-- Pay Now button removed, handled by Floating Cart Bar -->
          </div>

        </div>
      </div>
    </div>
  </div>

    <!-- Address Modal -->
    <div class="modal-overlay" v-if="showAddressModal" @click.self="showAddressModal = false">
      <div class="address-modal">
        <div class="modal-header">
          <h3>Pilih Alamat</h3>
          <button class="close-modal" @click="showAddressModal = false">×</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Nama Penerima</label>
            <input type="text" v-model="addressForm.recipientName" placeholder="Masukan Nama Penerima">
          </div>

          <div class="form-group">
            <label>Nama Alamat</label>
            <input type="text" v-model="addressForm.addressLabel" placeholder="Rumah, Kantor, ...">
          </div>

          <div class="form-group">
            <label>No. Telp</label>
            <input type="text" v-model="addressForm.phone" placeholder="08XX XXXX XXXX">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Provinsi</label>
              <div class="custom-select-wrapper">
                <select v-model="addressForm.provinceId" @change="fetchCities(addressForm.provinceId)" class="custom-select">
                  <option value="" disabled>Pilih Provinsi</option>
                  <option v-for="prov in provinces" :key="prov.id" :value="prov.id">{{ prov.name }}</option>
                </select>
                <div class="select-arrow"></div>
              </div>
            </div>
            <div class="form-group">
              <label>Kota</label>
              <div class="custom-select-wrapper">
                <select v-model="addressForm.cityName" class="custom-select" :disabled="!addressForm.provinceId">
                  <option value="" disabled>Pilih Kota</option>
                  <option v-for="city in cities" :key="city.id" :value="city.name">{{ city.name }}</option>
                </select>
                <div class="select-arrow"></div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Kode Pos</label>
            <input type="text" v-model="addressForm.zip" placeholder="Masukan Kode Pos">
          </div>

          <div class="form-group">
            <label>Detail Alamat</label>
            <textarea v-model="addressForm.detail" placeholder="Kecamatan, Desa, No. Rumah, dll" rows="3"></textarea>
          </div>

          <p class="disclaimer">Periksa kembali alamat yang Anda masukkan untuk memastikan tidak ada kesalahan.</p>
          
          <button class="save-address-btn" @click="saveAddress">
            <span class="check-icon">✓</span> Simpan Alamat
          </button>
        </div>
      </div>
    </div>
  </template>

<style scoped>
.checkout-page {
  padding: 40px 20px 140px 20px;
  background-color: var(--bg-dark, #1B1B1B);
  color: var(--text-light, #F4F1EC);
  min-height: 100vh;
}

.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
}

.checkout-header {
  margin-bottom: 30px;
}

.checkout-header h1 {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  color: var(--text-light, #F4F1EC);
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 30px;
}

/* Sections */
.checkout-section {
  background: #222;
  border-radius: 12px;
  border: 1px solid #333;
  margin-bottom: 12px;
  overflow: hidden;
}

.section-header {
  padding: 15px 25px 0 25px;
  border-bottom: none;
}

.section-header h2 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  color: var(--secondary-accent, #9e4d3d);
}

.section-body {
  padding: 0 25px 15px 25px;
  margin-top: -10px;
}

/* Form */
.form-group {
  margin-bottom: 12px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #ccc;
  font-weight: 500;
}

.required {
  color: #9e4d3d;
}

input, textarea {
  width: 100%;
  padding: 12px 15px;
  background-color: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 0.3s;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #9e4d3d;
  background-color: #252525;
}

.custom-select-wrapper {
  position: relative;
}

.custom-select {
  width: 100%;
  padding: 12px 15px;
  background-color: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s;
}

.custom-select:focus {
  outline: none;
  border-color: #9e4d3d;
}

.select-arrow {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  width: 0; 
  height: 0; 
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #ccc;
  pointer-events: none;
}

/* Order List */
.order-item {
  display: flex;
  gap: 20px;
  padding: 25px 0;
  border-bottom: 1px solid #333;
}

.order-item:last-child {
  border-bottom: none;
}

.item-visual {
  width: 80px;
  height: 100px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  flex-shrink: 0;
  border: 1px solid #333;
}

.item-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.item-main-info {
  flex-grow: 1;
  padding-right: 20px;
}

.item-title {
  font-size: 1.1rem;
  font-family: 'Playfair Display', serif;
  margin-bottom: 5px;
  color: var(--text-light, #F4F1EC);
}

.item-variant {
  font-size: 0.85rem;
  color: #888;
  background: #333;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
}

.item-meta-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 8px;
}

.info-qty, .info-fee {
  font-size: 0.85rem;
  color: #aaa;
}

.info-fee {
  color: var(--secondary-accent, #9e4d3d);
}

.item-pricing {
  text-align: right;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.item-price {
  font-weight: 700;
  color: var(--secondary-accent, #9e4d3d);
  font-size: 1.1rem;
}


.price-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.item-original-price {
  font-size: 0.8rem;
  color: #888;
  display: flex;
  align-items: center;
  gap: 6px;
}

.strikethrough {
  text-decoration: line-through;
}

.discount-badge {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
  padding: 1px 4px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.75rem;
}

.checkout-qty-control {
  display: flex;
  align-items: center;
  background: #333;
  border-radius: 50px;
  padding: 2px;
  border: 1px solid #444;
  margin-top: 6px;
}

.qty-btn.small {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: background 0.2s;
}

.qty-btn.small:hover {
  background: #555;
  color: #fff;
}

.qty-val {
  min-width: 30px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
}

.item-note-row {
  width: 100%;
}

.item-note-input {
  width: 100%;
  padding: 8px 0;
  background: transparent;
  border: none;
  border-bottom: 1px solid #444;
  color: #ccc;
  font-size: 0.9rem;
  border-radius: 0;
  transition: border-color 0.3s;
}

.item-note-input:focus {
  outline: none;
  border-bottom-color: #9e4d3d;
  background: transparent;
}

.item-note-input::placeholder {
  color: #555;
  font-style: italic;
}

/* Sidebar Cards */
.sidebar-card {
  background: #222;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}


.sidebar-card h3 {
  font-size: 1.1rem;
  margin-bottom: 15px;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Voucher */
.voucher-input-group {
  display: flex;
  gap: 10px;
}

.voucher-input-group input {
  background: #1a1a1a;
  border: 1px solid #444;
}

.apply-btn {
  background: #444;
  color: #fff;
  border: none;
  padding: 0 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.apply-btn:hover {
  background: #555;
}

/* Payment Method */
.payment-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border: 1px solid #9e4d3d;
  background: rgba(158, 77, 61, 0.1);
  border-radius: 8px;
  cursor: pointer;
}

.radio-circle {
  width: 20px;
  height: 20px;
  border: 2px solid #9e4d3d;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.inner-circle {
  width: 10px;
  height: 10px;
  background: #9e4d3d;
  border-radius: 50%;
}

/* Summary */
.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 0.95rem;
  color: #ccc;
}

.discount-text {
  color: #ff4d4f;
  font-weight: 600;
}

.summary-divider {
  height: 1px;
  background: #444;
  margin: 15px 0;
}

.summary-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  font-size: 1.1rem;
  font-weight: 700;
}

.total-val {
  color: #9e4d3d;
  font-size: 1.4rem;
}

.pay-btn {
  width: 100%;
  background-color: #9e4d3d;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(158, 77, 61, 0.3);
}

.pay-btn:hover {
  background-color: #b55846;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(158, 77, 61, 0.4);
}

.pay-btn:disabled {
  background-color: #555;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.label-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.text-btn {
  background: transparent;
  border: none;
  color: var(--secondary-accent, #9e4d3d);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}

.address-display {
  padding: 15px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  min-height: 60px;
}

.address-display p {
  margin: 0;
  color: #fff;
  font-size: 0.95rem;
  line-height: 1.5;
}

.address-placeholder {
  padding: 20px;
  background: #1a1a1a;
  border: 1px dashed #444;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.address-placeholder:hover {
  border-color: var(--secondary-accent, #9e4d3d);
  background: #222;
}

.address-placeholder p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  backdrop-filter: blur(5px);
  padding: 20px;
}

.address-modal {
  background: #222;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  border-radius: 16px;
  border: 1px solid #333;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  animation: modalIn 0.3s ease-out;
}

@keyframes modalIn {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  padding: 20px 25px;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #fff;
}

.close-modal {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
}

.modal-body {
  padding: 25px;
  overflow-y: auto;
}

.modal-body .form-group {
  margin-bottom: 18px;
}

.modal-body label {
  font-size: 0.85rem;
  color: #aaa;
  font-weight: 600;
  margin-bottom: 6px;
}

.modal-body input, 
.modal-body textarea, 
.modal-body .custom-select {
  background: #111;
  border-color: #333;
}

.modal-body input:focus, 
.modal-body textarea:focus, 
.modal-body .custom-select:focus {
  border-color: var(--secondary-accent, #9e4d3d);
}

.disclaimer {
  font-size: 0.8rem;
  color: #888;
  line-height: 1.4;
  margin: 20px 0;
}

.save-address-btn {
  width: 100%;
  padding: 14px;
  background: #003366; /* Deep blue as in screenshot */
  color: #fff;
  border: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s;
}

.save-address-btn:hover {
  background: #004488;
  transform: translateY(-2px);
}

.check-icon {
  font-size: 1.1rem;
}

@media (max-width: 900px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }
}
</style>
