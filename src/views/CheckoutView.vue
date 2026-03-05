<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
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
  cityId: '0',
  latitude: '',
  longitude: ''
});

const selectedCourier = ref('Byteship');
const selectedRate = ref(null);
const shippingRates = ref([]);
const isCheckingOngkir = ref(false);

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
  detail: '',
  latitude: '',
  longitude: '',
  searchQuery: ''
});

const addressStep = ref(1); // 1: Search, 2: Pinpoint, 3: Details
const searchInputRef = ref(null);
let autocomplete = null;

const nextAddressStep = () => {
  if (addressStep.value < 3) addressStep.value++;
  if (addressStep.value === 2) {
    nextTick(() => initMap());
  }
};
const prevAddressStep = () => {
  if (addressStep.value > 1) addressStep.value--;
  if (addressStep.value === 2) {
    nextTick(() => initMap());
  }
};

// Map State
let map = null;
let marker = null;

// Fetch all products to get admin_fee and other details
onMounted(async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://api.kolektix.cloud';
    const creatorId = baseUrl.includes('api.kolektix.com') ? 129 : 48;
    const response = await fetch(`${baseUrl}/api/product?creator_id=${creatorId}`);
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
  addressStep.value = 1; // Reset to step 1
  fetchProvinces();
  
  // Initialize Autocomplete in step 1
  nextTick(() => {
    initAutocomplete();
  });
};

const initAutocomplete = () => {
  if (!searchInputRef.value || !window.google) return;
  
  autocomplete = new google.maps.places.Autocomplete(searchInputRef.value, {
    componentRestrictions: { country: 'id' },
    fields: ['address_components', 'geometry', 'formatted_address'],
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    addressForm.value.latitude = place.geometry.location.lat().toFixed(6);
    addressForm.value.longitude = place.geometry.location.lng().toFixed(6);
    addressForm.value.searchQuery = place.formatted_address;
    
    // Auto proceed to step 2 after selecting place
    nextAddressStep();
  });
};

const initMap = () => {
  if (typeof window.google === 'undefined') {
    console.warn('Google Maps not loaded yet');
    return;
  }

  try {
    const defaultLat = parseFloat(addressForm.value.latitude) || -6.2088;
    const defaultLng = parseFloat(addressForm.value.longitude) || 106.8456;
    const mapContainer = document.getElementById('map-picker');
    
    if (!mapContainer) return;

    map = new google.maps.Map(mapContainer, {
      center: { lat: defaultLat, lng: defaultLng },
      zoom: 17,
      mapId: import.meta.env.VITE_GOOGLE_MAP_ID || '795838f77e7bb079c78f5aac',
      disableDefaultUI: true,
      zoomControl: true,
    });

    // In Google Maps pinpoint mode, we just listen to camera movement
    map.addListener('center_changed', () => {
      const center = map.getCenter();
      addressForm.value.latitude = center.lat().toFixed(6);
      addressForm.value.longitude = center.lng().toFixed(6);
    });

  } catch (err) {
    console.error('Map init error:', err);
  }
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
  formData.value.latitude = addressForm.value.latitude;
  formData.value.longitude = addressForm.value.longitude;
  
  showAddressModal.value = false;
  map = null;
  
  // Auto-trigger shipping rates after saving address
  fetchShippingRates();
};

const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        addressForm.value.latitude = position.coords.latitude.toFixed(6);
        addressForm.value.longitude = position.coords.longitude.toFixed(6);
        
        if (map && addressStep.value === 2) {
          map.panTo({ lat: position.coords.latitude, lng: position.coords.longitude });
        }
        
        store.showNotification('Lokasi berhasil diambil', 'success');
      },
      (err) => {
        console.error('Geolocation error:', err);
        store.showNotification('Gagal mengambil lokasi. Silakan isi manual.', 'info');
      }
    );
  } else {
    store.showNotification('Browser Anda tidak mendukung lokasi', 'info');
  }
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
    let weight = product ? parseFloat(product.weight || 1000) : 1000;
    
    // Fallback to variant weight if top-level is 0
    if (product && weight === 0 && product.product_varian && product.product_varian.length > 0) {
      weight = parseFloat(product.product_varian[0].weight || 1000);
    }

    return {
      ...item,
      admin_fee: product ? parseFloat(product.admin_fee || 0) : 0,
      weight: weight
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

const fetchShippingRates = async () => {
  if (!formData.value.zip) {
    store.showNotification('Silakan pilih alamat terlebih dahulu agar kode pos terbaca', 'info');
    return;
  }

  isCheckingOngkir.value = true;
  shippingRates.value = [];
  selectedRate.value = null;

  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://api.kolektix.cloud';
    
    // Calculate total weight based on product data
    const totalWeight = enrichedCart.value.reduce((sum, item) => sum + (item.quantity * item.weight), 0);

    const response = await fetch(`${baseUrl}/api/shipping/cek-all-ongkir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        origin_postal_code: "16519",
        destination_postal_code: formData.value.zip,
        origin_latitude: -6.406675,
        origin_longitude: 106.7684233,
        destination_latitude: parseFloat(formData.value.latitude) || -6.190000,
        destination_longitude: parseFloat(formData.value.longitude) || 106.830000,
        weight: totalWeight
      })
    });

    const result = await response.json();
    if (result.success && result.rates) {
      // Flatten rates from different categories: instant, same_day, regular
      const allRates = [
        ...(result.rates.instant || []),
        ...(result.rates.same_day || []),
        ...(result.rates.regular || [])
      ].map(rate => ({
        ...rate,
        courier_name: rate.courier,
        courier_service_name: rate.service,
        price: rate.price,
        duration: rate.etd
      }));

      shippingRates.value = allRates;
      if (shippingRates.value.length === 0) {
        store.showNotification('Tidak ada pilihan pengiriman tersedia untuk lokasi ini', 'info');
      }
    } else {
      store.showNotification(result.message || 'Gagal mengambil data ongkir', 'error');
    }
  } catch (err) {
    console.error('Error fetching shipping rates:', err);
    store.showNotification('Terjadi kesalahan saat mengecek ongkir', 'info');
  } finally {
    isCheckingOngkir.value = false;
  }
};

const shippingCost = computed(() => {
  return selectedRate.value ? selectedRate.value.price : 0;
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
      creator_id: baseUrl.includes('api.kolektix.com') ? 129 : 6,
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
        main: selectedRate.value?.courier_name || "Byteship",
        type: selectedRate.value?.courier_service_name || "Standard",
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
        latitude: formData.value.latitude,
        longitude: formData.value.longitude,
        nama_penerima: formData.value.fullName,
        phone: formData.value.phone,
        is_active: 1
      },
      success_redirect_url: `https://store.deelestari.com/merch-invoice/{invoice_merch}`,
      failure_redirect_url: `https://store.deelestari.com/checkout`,
      is_microsite: 1,
      microsite_url: 'https://store.deelestari.com'
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
                  
                  <div class="map-link-wrapper" v-if="formData.latitude && formData.longitude">
                    <a :href="`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`" target="_blank" class="maps-direct-btn">
                      <span class="map-icon">📍</span> Lihat di Google Maps
                    </a>
                  </div>
                </div>

                <div class="form-group shipping-service-full">
                    <label>Servis Pengiriman <span class="required">*</span></label>
                    <div class="flex-row-action">
                      <div class="custom-select-wrapper flex-grow">
                        <select v-model="selectedRate" class="custom-select" required :disabled="shippingRates.length === 0">
                          <option :value="null" disabled>{{ shippingRates.length > 0 ? 'Pilih Servis' : (isCheckingOngkir ? 'Sedang mengecek ongkir...' : 'Silakan pilih alamat terlebih dahulu') }}</option>
                          <option v-for="rate in shippingRates" :key="rate.courier_service_code" :value="rate">
                            {{ rate.courier_name }} {{ rate.courier_service_name }} - {{ formatRupiah(rate.price) }}
                          </option>
                        </select>
                        <div class="select-arrow"></div>
                      </div>
                    </div>
                    <p v-if="selectedRate" class="shipping-info-text">
                      {{ selectedRate.description }} (Estimasi: {{ selectedRate.duration }})
                    </p>
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
    <!-- Address Modal Redesign -->
    <div class="modal-overlay" v-if="showAddressModal" @click.self="showAddressModal = false">
      <div class="address-modal multi-step">
        <div class="modal-header">
          <div class="header-main">
             <button v-if="addressStep > 1" class="back-modal" @click="prevAddressStep">←</button>
             <h3>Tambah Alamat Baru</h3>
          </div>
          <button class="close-modal" @click="showAddressModal = false">×</button>
        </div>

        <!-- Step Indicator -->
        <div class="step-indicator">
          <div class="step-item" :class="{ active: addressStep >= 1, done: addressStep > 1 }">
             <span class="step-num">1</span>
             <span class="step-label">Cari Lokasi</span>
          </div>
          <div class="step-line"></div>
          <div class="step-item" :class="{ active: addressStep >= 2, done: addressStep > 2 }">
             <span class="step-num">2</span>
             <span class="step-label">Pinpoint</span>
          </div>
          <div class="step-line"></div>
          <div class="step-item" :class="{ active: addressStep >= 3 }">
             <span class="step-num">3</span>
             <span class="step-label">Detail</span>
          </div>
        </div>
        
        <div class="modal-body">
          <!-- STEP 1: Search -->
          <div v-if="addressStep === 1" class="step-content search-step">
            <h4 class="step-title">Di mana lokasi tujuan pengirimanmu?</h4>
            <div class="search-input-wrapper">
               <input type="text" ref="searchInputRef" v-model="addressForm.searchQuery" placeholder="Tulis nama jalan / gedung / perumahan" @keyup.enter="nextAddressStep">
               <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                 <circle cx="11" cy="11" r="8"></circle>
                 <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
               </svg>
            </div>
            
            <button type="button" class="use-current-location-btn" @click="getCurrentLocation">
               <span class="gps-icon">⌖</span> Gunakan Lokasi Saat Ini
            </button>
            
            <div class="step-actions">
               <button class="primary-step-btn" @click="nextAddressStep">Pilih & Lanjut Pinpoint</button>
            </div>
          </div>

          <!-- STEP 2: Map Pinpoint -->
          <div v-if="addressStep === 2" class="step-content map-step">
             <h4 class="step-title">Tentukan pinpoint lokasi</h4>
             <div class="map-picker-section">
                <div id="map-picker" class="map-container-el"></div>
                <div class="map-center-pin">📍</div>
             </div>
             <p class="map-hint">Geser peta untuk memindahkan pin tepat di depan pintu masuk!</p>
             
             <div class="step-actions">
                <button class="primary-step-btn" @click="() => { nextAddressStep(); fetchProvinces(); }">Pilih Lokasi & Lanjut Isi Alamat</button>
             </div>
          </div>

          <!-- STEP 3: Detail Form -->
          <div v-if="addressStep === 3" class="step-content details-step">
             <h4 class="step-title">Lengkapi detail alamat</h4>
             
             <!-- field order as requested: 1. Nama Alamat, 2. Nama Penerima, 3. No Telp, 4. Provinsi & Kota, 5. Kode Pos, 6. Detail -->
             <div class="form-group">
               <label>Nama Alamat</label>
               <input type="text" v-model="addressForm.addressLabel" placeholder="Rumah, Kantor, ...">
             </div>

             <div class="form-group">
               <label>Nama Penerima</label>
               <input type="text" v-model="addressForm.recipientName" placeholder="Masukan Nama Penerima">
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
               <label>Detail Alamat / Catatan Kurir</label>
               <textarea v-model="addressForm.detail" placeholder="Kecamatan, Desa, No. Rumah, Nama Jalan, dll" rows="3"></textarea>
             </div>

             <div class="step-actions">
                <button class="save-address-btn" @click="saveAddress">
                  <span class="check-icon">✓</span> Simpan Alamat
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
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

.shipping-service-full {
  grid-column: span 2;
  margin-top: 15px;
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

.flex-row-action {
  display: flex;
  gap: 10px;
  align-items: stretch;
}

.flex-grow {
  flex-grow: 1;
}

.btn-check-ongkir {
  background: var(--secondary-accent, #9e4d3d);
  color: #fff;
  border: none;
  padding: 0 15px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
}

.btn-check-ongkir:hover:not(:disabled) {
  background: #b55846;
  transform: translateY(-1px);
}

.btn-check-ongkir:disabled {
  background: #666;
  opacity: 0.7;
  cursor: not-allowed;
}

.shipping-info-text {
  font-size: 0.8rem;
  color: #888;
  margin-top: 6px;
  font-style: italic;
}

@media (max-width: 900px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .checkout-page {
    padding: 20px 15px 120px 15px;
  }

  .checkout-header h1 {
    font-size: 1.8rem;
  }

  .section-header {
    padding: 15px 15px 0 15px;
  }

  .section-body {
    padding: 0 15px 15px 15px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .flex-row-action {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-check-ongkir {
    padding: 12px;
  }

  .order-item {
    flex-direction: row;
    gap: 12px;
    padding: 15px 0;
    align-items: flex-start;
  }

  .item-visual {
    width: 50px;
    height: 70px;
  }

  .item-header-row {
    flex-direction: row;
    gap: 10px;
    margin-bottom: 5px;
  }

  .item-title {
    font-size: 0.9rem;
    line-height: 1.3;
  }

  .item-meta-info {
    font-size: 0.75rem;
    gap: 1px;
    margin-bottom: 5px;
  }

  .item-pricing {
    text-align: right;
    align-items: flex-end;
    min-width: 80px;
  }

  .item-price {
    font-size: 0.9rem;
  }

  .price-stack {
    align-items: flex-end;
  }

  .total-val {
    font-size: 1.2rem;
  }

  .address-modal {
    padding: 15px;
    border-radius: 12px;
  }

  .modal-body {
    padding: 15px;
  }
}

.map-link-wrapper {
  margin-top: 10px;
}

.maps-direct-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #333;
  color: #fff;
  padding: 8px 16px;
  border-radius: 50px;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid #444;
  transition: all 0.3s;
}

.maps-direct-btn:hover {
  background: #444;
  border-color: var(--secondary-accent, #9e4d3d);
  transform: translateY(-1px);
}

.coordinates-row {
  background: rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #333;
  margin-top: 10px;
}

.location-action {
  margin-top: 10px;
  margin-bottom: 20px;
}

.location-btn {
  background: transparent;
  border: 1px solid #444;
  color: #ccc;
  padding: 8px 15px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
}

.location-btn:hover {
  background: #333;
  border-color: var(--secondary-accent, #9e4d3d);
  color: #fff;
}

.gps-icon {
  font-size: 1.1rem;
}

.map-picker-section {
  margin-bottom: 20px;
}

.map-container-el {
  height: 250px;
  width: 100%;
  border-radius: 12px;
  border: 1px solid #333;
  margin-top: 8px;
  z-index: 1;
}

.map-hint {
  font-size: 0.75rem;
  color: #888;
  margin-top: 6px;
  font-style: italic;
}

.coordinates-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #333;
  margin-bottom: 15px;
}

.coordinates-row .form-group {
  margin-bottom: 0;
}
/* Multi-step Modal Styles */
.address-modal.multi-step {
  width: 95%;
  max-width: 600px;
  background: #222;
  border-radius: 16px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-header {
  padding: 20px 25px;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-main {
  display: flex;
  align-items: center;
  gap: 15px;
}

.back-modal {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  line-height: 1;
}

.modal-header h3 {
  margin: 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.2rem;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 25px;
  background: #2a2a2a;
  gap: 10px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  flex: 1;
}

.step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #444;
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.step-label {
  font-size: 0.7rem;
  color: #888;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s;
}

.step-line {
  height: 2px;
  background: #444;
  flex: 0.5;
  margin-top: -15px;
}

.step-item.active .step-num {
  background: rgba(158, 77, 61, 0.2);
  color: #9e4d3d;
  border-color: #9e4d3d;
}

.step-item.active .step-label {
  color: #9e4d3d;
}

.step-item.done .step-num {
  background: #9e4d3d;
  color: #fff;
}

.step-item.done .step-label {
  color: #fff;
}

.step-content {
  padding: 25px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.step-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: #fff;
}

.search-input-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-input-wrapper input {
  padding-left: 45px;
}

.use-current-location-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #444;
  color: #fff;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  margin-bottom: 10px;
}

.use-current-location-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #666;
}

.step-actions {
  margin-top: auto;
  padding-top: 20px;
}

.primary-step-btn {
  width: 100%;
  background: #9e4d3d;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.primary-step-btn:hover {
  background: #b85a47;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(158, 77, 61, 0.3);
}

.map-picker-section {
  position: relative;
  flex-grow: 1;
  min-height: 250px;
}

.map-center-pin {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%);
  font-size: 2rem;
  pointer-events: none;
  z-index: 10;
}

.map-hint {
  font-size: 0.85rem;
  color: #888;
  text-align: center;
  margin: 10px 0;
}

@media (max-width: 768px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }
}
</style>
