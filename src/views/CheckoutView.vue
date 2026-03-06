<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../store';
import { useLanguage } from '../composables/useLanguage';

const router = useRouter();
const { t } = useLanguage();

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBxZekg89Ut1U72fFpQldJAenvgTy197As';
const googleMapId = import.meta.env.VITE_GOOGLE_MAP_ID || '795838f77e7bb079c78f5aac';

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
// Map State
const searchInputRef = ref(null);
const mapContainerRef = ref(null);
let autocomplete = null;
let map = null;
let marker = null;
const predictions = ref([]);
const isSearching = ref(false);
let autocompleteService = null;
let geocoder = null;

const nextAddressStep = () => {
  if (addressStep.value < 3) addressStep.value++;
  if (addressStep.value === 2) {
    nextTick(() => {
      initMap();
    });
  }
};
const prevAddressStep = () => {
  if (addressStep.value > 1) addressStep.value--;
  if (addressStep.value === 2) {
    nextTick(() => {
      initMap();
    });
  }
};

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
  initServices();
};

const initServices = () => {
  if (window.google && window.google.maps) {
    if (!autocompleteService) autocompleteService = new google.maps.places.AutocompleteService();
    if (!geocoder) geocoder = new google.maps.Geocoder();
  } else {
    setTimeout(initServices, 500);
  }
};

const onSearchInput = () => {
  if (!addressForm.value.searchQuery || addressForm.value.searchQuery.length < 3) {
    predictions.value = [];
    return;
  }
  
  if (!autocompleteService) return;

  isSearching.value = true;
  autocompleteService.getPlacePredictions({
    input: addressForm.value.searchQuery,
    componentRestrictions: { country: 'id' }
  }, (results, status) => {
    isSearching.value = false;
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      predictions.value = results;
    } else {
      predictions.value = [];
    }
  });
};

const selectPrediction = (prediction) => {
  if (!geocoder) return;

  addressForm.value.searchQuery = prediction.description;
  predictions.value = [];

  geocoder.geocode({ placeId: prediction.place_id }, async (results, status) => {
    if (status === google.maps.GeocoderStatus.OK && results[0]) {
      const place = results[0];
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      
      addressForm.value.latitude = lat.toFixed(6);
      addressForm.value.longitude = lng.toFixed(6);
      
      // Extract Components
      let gProvince = '';
      let gCity = '';
      let gZip = '';

      if (place.address_components) {
        for (const component of place.address_components) {
          const types = component.types;
          if (types.includes('postal_code')) {
            gZip = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            gProvince = component.long_name;
          } else if (types.includes('administrative_area_level_2')) {
            gCity = component.long_name;
          }
        }
      }

      addressForm.value.zip = gZip;
      const cleanCity = gCity.replace(/^(Kota|Kabupaten)\s+/i, '');

      // Auto-match Province and City
      if (provinces.value.length === 0) await fetchProvinces();
      
      const matchedProv = provinces.value.find(p => 
        p.name.toLowerCase().includes(gProvince.toLowerCase()) || 
        gProvince.toLowerCase().includes(p.name.toLowerCase())
      );
      
      if (matchedProv) {
        addressForm.value.provinceId = matchedProv.id;
        await fetchCities(matchedProv.id);
        
        const matchedCity = cities.value.find(c => 
          c.name.toLowerCase().includes(cleanCity.toLowerCase()) || 
          cleanCity.toLowerCase().includes(c.name.toLowerCase())
        );
        
        if (matchedCity) {
          addressForm.value.cityName = matchedCity.name;
        }
      }
      
      nextAddressStep();
    }
  });
};

// Autocomplete initialized via Service manually

const initMap = () => {
  if (!mapContainerRef.value) return;
  
  const center = { 
    lat: parseFloat(addressForm.value.latitude) || -6.2088, 
    lng: parseFloat(addressForm.value.longitude) || 106.8456 
  };

  map = new google.maps.Map(mapContainerRef.value, {
    center,
    zoom: 17,
    mapId: googleMapId,
    disableDefaultUI: true,
    zoomControl: true,
  });

  marker = new google.maps.Marker({
    position: center,
    map,
    draggable: true,
    animation: google.maps.Animation.DROP
  });

  marker.addListener('dragend', () => {
    const pos = marker.getPosition();
    addressForm.value.latitude = pos.lat().toFixed(6);
    addressForm.value.longitude = pos.lng().toFixed(6);
    
    // Reverse Geocode to update Zip/City/Province if pinned manually
    if (geocoder) {
      geocoder.geocode({ location: pos }, async (results, status) => {
        if (status === 'OK' && results[0]) {
          const place = results[0];
          let gProvince = '';
          let gCity = '';
          let gZip = '';
          for (const component of place.address_components) {
            const types = component.types;
            if (types.includes('postal_code')) gZip = component.long_name;
            else if (types.includes('administrative_area_level_1')) gProvince = component.long_name;
            else if (types.includes('administrative_area_level_2')) gCity = component.long_name;
          }
          if (gZip) addressForm.value.zip = gZip;
          
          // Auto-match Province and City from Pinpoint
          if (provinces.value.length === 0) await fetchProvinces();
          
          const matchedProv = provinces.value.find(p => 
            p.name.toLowerCase().includes(gProvince.toLowerCase()) || 
            gProvince.toLowerCase().includes(p.name.toLowerCase())
          );
          
          if (matchedProv) {
            addressForm.value.provinceId = matchedProv.id;
            await fetchCities(matchedProv.id);
            
            const cleanCity = gCity.replace(/^(Kota|Kabupaten)\s+/i, '');
            const matchedCity = cities.value.find(c => 
              c.name.toLowerCase().includes(cleanCity.toLowerCase()) || 
              cleanCity.toLowerCase().includes(c.name.toLowerCase())
            );
            
            if (matchedCity) {
              addressForm.value.cityName = matchedCity.name;
            }
          }
        }
      });
    }
  });

  map.addListener('center_changed', () => {
    // Optionally update marker to center
  });
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
        const { latitude, longitude } = position.coords;
        addressForm.value.latitude = latitude.toFixed(6);
        addressForm.value.longitude = longitude.toFixed(6);
        
        // Update gmp-map if in step 2
        if (addressStep.value === 2) {
          const mapEl = document.getElementById('map-picker');
          if (mapEl) {
            mapEl.center = { lat: latitude, lng: longitude };
          }
        }
        
        if (addressStep.value === 1) {
          nextAddressStep();
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
 
 const groupedShippingRates = computed(() => {
   const groups = {
     'Instant': [],
     'Sameday': [],
     'Reguler': []
   };
   
   shippingRates.value.forEach(rate => {
     if (groups[rate.type]) {
       groups[rate.type].push(rate);
     } else {
       // Fallback for unexpected types
       if (!groups['Reguler']) groups['Reguler'] = [];
       groups['Reguler'].push(rate);
     }
   });
   
   return groups;
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

const canPickup = computed(() => {
  return enrichedCart.value.some(item => {
    const product = allProducts.value.find(p => p.id == item.id);
    return product && product.is_pickup_inorder == 1;
  });
});

const canDeliver = computed(() => {
  return enrichedCart.value.some(item => {
    const product = allProducts.value.find(p => p.id == item.id);
    return product && product.is_delivery == 1;
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
      // Keep rates categorized for grouping display
      // Ensure any service with "Instant" in its name is categorized as Instant
      const processRate = (rate, defaultType) => {
        const serviceName = (rate.courier_service_name || rate.service || '').toLowerCase();
        if (serviceName.includes('instant')) return { ...rate, type: 'Instant' };
        return { ...rate, type: defaultType };
      };

      const instant = (result.rates.instant || []).map(r => processRate(r, 'Instant'));
      const sameDay = (result.rates.same_day || []).map(r => processRate(r, 'Sameday'));
      const regular = (result.rates.regular || []).map(r => processRate(r, 'Reguler'));

      const allRates = [...instant, ...sameDay, ...regular].map(rate => ({
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
      success_redirect_url: `https://store.deelestari.com/invoice/{invoice_merch}`,
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

                <div class="form-group" v-if="canPickup">
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

                <div v-if="canDeliver">
                  <div class="form-group address-section-custom">
                    <label class="address-header-label">ALAMAT PENGIRIMAN</label>
                    <div class="address-card-custom" v-if="formData.address">
                      <div class="address-main-layout">
                        <div class="address-icon-pin">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#27ae60" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        </div>
                        <div class="address-details-content">
                          <div class="address-title-row">
                            <span class="address-label-text">{{ addressForm.addressLabel || 'Rumah' }}</span>
                            <span class="address-dot">·</span>
                            <span class="address-recipient-name">{{ formData.fullName }}</span>
                          </div>
                          <div class="address-full-text">{{ formData.address }}</div>
                          <div class="address-contact">{{ formData.phone }}</div>
                        </div>
                        <div class="address-action-col">
                          <button type="button" class="ganti-address-btn" @click="openAddressModal">Ganti</button>
                        </div>
                      </div>
                    </div>
                    <div class="address-placeholder-custom" v-else @click="openAddressModal">
                      <div class="placeholder-content">
                        <span class="plus-icon">+</span>
                        <p>Pilih Alamat Pengiriman</p>
                      </div>
                    </div>
                    
                    <div class="map-link-wrapper" v-if="formData.latitude && formData.longitude">
                      <a :href="`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`" target="_blank" class="maps-direct-btn">
                        <span class="map-icon">📍</span> Lihat di Google Maps
                      </a>
                    </div>
                  </div>

                  <div class="form-group shipping-service-full">
                      <label>Pilih Pengiriman <span class="required">*</span></label>
                      <div class="flex-row-action">
                        <div class="custom-select-wrapper flex-grow">
                          <select v-model="selectedRate" class="custom-select" required :disabled="shippingRates.length === 0">
                            <option :value="null" disabled>{{ shippingRates.length > 0 ? 'Pilih Pengiriman' : (isCheckingOngkir ? 'Sedang mengecek ongkir...' : 'Silakan pilih alamat terlebih dahulu') }}</option>
                            <optgroup label="Instant" v-if="groupedShippingRates['Instant'].length > 0">
                              <option v-for="rate in groupedShippingRates['Instant']" :key="rate.id" :value="rate">
                                {{ rate.courier_name }} {{ rate.courier_service_name }} - {{ formatRupiah(rate.price) }}
                              </option>
                            </optgroup>
                            <optgroup label="Sameday" v-if="groupedShippingRates['Sameday'].length > 0">
                              <option v-for="rate in groupedShippingRates['Sameday']" :key="rate.id" :value="rate">
                                {{ rate.courier_name }} {{ rate.courier_service_name }} - {{ formatRupiah(rate.price) }}
                              </option>
                            </optgroup>
                            <optgroup label="Reguler" v-if="groupedShippingRates['Reguler'].length > 0">
                              <option v-for="rate in groupedShippingRates['Reguler']" :key="rate.id" :value="rate">
                                {{ rate.courier_name }} {{ rate.courier_service_name }} - {{ formatRupiah(rate.price) }}
                              </option>
                            </optgroup>
                          </select>
                          <div class="select-arrow"></div>
                        </div>
                      </div>
                      <p v-if="selectedRate" class="shipping-info-text">
                        {{ selectedRate.description }} (Estimasi: {{ selectedRate.duration }})
                      </p>
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
          <div :class="{ 'step-hidden': addressStep !== 1 }" class="step-content search-step">
            <h4 class="step-title">Di mana lokasi tujuan pengirimanmu?</h4>
            
            <div class="custom-search-container">
              <div class="search-input-wrapper">
                <span class="search-icon">🔍</span>
                <input 
                  type="text" 
                  class="address-search-input"
                  v-model="addressForm.searchQuery"
                  @input="onSearchInput"
                  placeholder="Tulis nama jalan / gedung / perumahan"
                >
                <button v-if="addressForm.searchQuery" class="clear-search" @click="addressForm.searchQuery = ''; predictions = [];">×</button>
              </div>

              <!-- Predictions List -->
              <div class="search-results-overlay" v-if="predictions.length > 0 || addressForm.searchQuery.length >= 3">
                <div class="search-option-item" @click="getCurrentLocation">
                  <span class="option-icon">⌖</span>
                  <div class="option-content">
                    <span class="option-title">Gunakan Lokasi Saat Ini</span>
                  </div>
                </div>
                
                <div class="search-option-item manual-trigger" @click="addressStep = 3">
                  <span class="option-icon">📝</span>
                  <div class="option-content">
                    <span class="option-title">Tidak ketemu? Isi alamat secara manual</span>
                  </div>
                </div>

                <div class="prediction-divider" v-if="predictions.length > 0"></div>

                <div class="prediction-item" v-for="p in predictions" :key="p.place_id" @click="selectPrediction(p)">
                  <span class="pin-icon">📍</span>
                  <div class="prediction-content">
                    <span class="place-name">{{ p.structured_formatting.main_text }}</span>
                    <span class="place-detail">{{ p.structured_formatting.secondary_text }}</span>
                  </div>
                </div>

                <div class="search-footer" @click="addressStep = 3">
                   <span>Mau cara lain? Isi alamat secara manual</span>
                </div>
              </div>
            </div>

            <div class="step-actions">
               <button class="primary-step-btn" @click="addressStep = 3">Isi Manual</button>
               <button class="primary-step-btn" v-if="addressForm.latitude" @click="nextAddressStep">Selanjutnya</button>
            </div>
          </div>

          <!-- STEP 2: Map Pinpoint -->
          <div :class="{ 'step-hidden': addressStep !== 2 }" class="step-content map-step">
             <h4 class="step-title">Tentukan pinpoint lokasi</h4>
             <div class="map-picker-section">
                <div ref="mapContainerRef" class="map-container-el"></div>
             </div>
             <p class="map-hint">Geser peta untuk memindahkan pin tepat di depan pintu masuk!</p>
             
             <div class="step-actions dual-btns">
                <button class="secondary-step-btn" @click="prevAddressStep">Kembali</button>
                <button class="primary-step-btn" @click="() => { nextAddressStep(); fetchProvinces(); }">Selanjutnya</button>
             </div>
          </div>

          <!-- STEP 3: Detail Form -->
          <div :class="{ 'step-hidden': addressStep !== 3 }" class="step-content details-step">
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
               <label>Detail Alamat</label>
               <textarea v-model="addressForm.detail" placeholder="Kecamatan, Desa, No. Rumah, Nama Jalan, dll" rows="3"></textarea>
             </div>

             <div class="step-actions dual-btns">
                <button class="secondary-step-btn" @click="prevAddressStep">Kembali</button>
                <button class="save-address-btn" @click="saveAddress">
                  <span class="check-icon">✓</span> Simpan Alamat
                </button>
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
  box-shadow: none;
}

.step-actions {
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.step-actions.dual-btns {
  flex-direction: row;
}

.primary-step-btn, .save-address-btn {
  width: 100%;
  background: var(--secondary-accent, #9e4d3d);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.secondary-step-btn {
  width: 100%;
  background: transparent;
  color: #fff;
  border: 1px solid #444;
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.secondary-step-btn:hover {
  background: #333;
}

.primary-step-btn:hover, .save-address-btn:hover {
  background: #b55846;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .step-actions.dual-btns {
    flex-direction: column-reverse;
  }
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

/* NEW Address Card Styles */
.address-section-custom {
  margin-bottom: 25px;
}

.address-header-label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #888;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
  display: block;
}

.address-card-custom {
  background: #252525; /* Dark background matching other sections */
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #333;
  color: #F4F1EC; /* Light text */
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.address-main-layout {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.address-icon-pin {
  margin-top: 2px;
  flex-shrink: 0;
}

.address-details-content {
  flex-grow: 1;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.address-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.address-label-text {
  font-weight: 700;
  font-size: 0.95rem;
  color: #fff;
}

.address-dot {
  color: #666;
  font-weight: 700;
}

.address-recipient-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: #ccc;
}

.address-full-text {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #aaa;
  margin-bottom: 4px;
}

.address-contact {
  font-size: 0.9rem;
  color: #aaa;
}

.address-action-col {
  flex-shrink: 0;
}

.ganti-address-btn {
  background: #333;
  border: 1px solid #444;
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.ganti-address-btn:hover {
  background: #444;
  border-color: #555;
  transform: translateY(-1px);
}

.address-placeholder-custom {
  background: #1a1a1a;
  border: 1px dashed #444;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.address-placeholder-custom:hover {
  border-color: var(--secondary-accent, #9e4d3d);
  background: #222;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.plus-icon {
  font-size: 1.5rem;
  color: #888;
}

.address-placeholder-custom p {
  margin: 0;
  color: #888;
  font-weight: 600;
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

  .section-body {
    padding: 0 15px 15px 15px;
  }

  /* Mobile Address Card Tweaks */
  .address-card-custom {
    padding: 15px;
  }

  .address-title-row {
    flex-wrap: wrap;
    gap: 4px;
  }

  .address-label-text, .address-recipient-name {
    font-size: 0.85rem;
  }

  .address-full-text, .address-contact {
    font-size: 0.8rem;
  }

  .ganti-address-btn {
    padding: 4px 12px;
    font-size: 0.75rem;
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
  width: 100%;
  background: #1a1a1a;
  border: 1px solid #444;
  color: #fff;
  padding-top: 12px;
  padding-bottom: 12px;
  border-radius: 8px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.search-input-wrapper input:focus {
  border-color: #9e4d3d;
  outline: none;
  background: #222;
  box-shadow: 0 0 0 3px rgba(158, 77, 61, 0.1);
}

/* Custom Search & Tokopedia-style UI */
.custom-search-container {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}

.search-results-overlay {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  z-index: 1000;
  overflow: hidden;
  max-height: 450px;
  overflow-y: auto;
}

.search-option-item, .prediction-item {
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.search-option-item:hover, .prediction-item:hover {
  background: #f8f9fa;
}

.search-option-item:last-child {
  border-bottom: none;
}

.option-icon, .pin-icon {
  font-size: 1.2rem;
  min-width: 30px;
  display: flex;
  justify-content: center;
}

.option-icon { color: #666; }
.pin-icon { color: #888; }

.option-content, .prediction-content {
  display: flex;
  flex-direction: column;
}

.option-title {
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
}

.place-name {
  color: #222;
  font-weight: 700;
  font-size: 1rem;
}

.place-detail {
  color: #777;
  font-size: 0.8rem;
  margin-top: 2px;
}

.prediction-divider {
  height: 8px;
  background: #f4f4f4;
}

.search-footer {
  padding: 15px 20px;
  background: #fff;
  color: #6c757d;
  font-size: 0.85rem;
  text-align: center;
  cursor: pointer;
}

.search-footer:hover {
  color: #9e4d3d;
  text-decoration: underline;
}

.clear-search {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: #444;
  color: #fff;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  z-index: 2;
}

.manual-trigger .option-title {
  color: #777;
  font-weight: 400;
  font-size: 0.9rem;
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
  border-radius: 8px;
  overflow: hidden;
}

.step-hidden {
  display: none !important;
}

/* For Maps, we keep them in DOM but visually hidden to maintain JS state/linker */
.map-step.step-hidden, .search-step.step-hidden, .details-step.step-hidden {
  display: block !important;
  visibility: hidden;
  height: 0;
  overflow: hidden;
  padding: 0 !important;
  margin: 0 !important;
  min-height: 0 !important;
}

.map-container-el {
  width: 100%;
  height: 350px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #333;
}

.map-container-el {
  width: 100%;
  height: 350px;
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

/* Google Maps Autocomplete suggestions fix */
.pac-container {
  z-index: 110000 !important;
  background-color: #222 !important;
  border: 1px solid #333 !important;
  border-radius: 8px !important;
  margin-top: 5px !important;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5) !important;
  font-family: 'Plus Jakarta Sans', sans-serif !important;
}

.pac-item {
  border-top: 1px solid #333 !important;
  padding: 10px 15px !important;
  cursor: pointer !important;
  color: #fff !important;
  font-size: 0.9rem !important;
  line-height: 1.5 !important;
}

.pac-item:hover {
  background-color: #333 !important;
}

.pac-item-query {
  color: #fff !important;
  font-size: 0.95rem !important;
}

.pac-matched {
  color: #9e4d3d !important;
}

.pac-icon {
  filter: invert(1);
  margin-top: 5px !important;
}

.pac-item:first-child {
  border-top: none !important;
}
</style>
