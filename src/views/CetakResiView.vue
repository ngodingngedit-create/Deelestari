<template>
  <div class="live-report-page">
    <main class="report-container">
      <div class="page-title-section">
        <h1>CETAK RESI PENGIRIMAN</h1>
        <p class="subtitle">Daftar transaksi untuk pencetakan resi</p>
        <div class="header-actions">
          
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon sales-icon">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">TOTAL SALES</span>
            <span class="stat-value">Rp {{ formatCurrency(summary.total_revenue) }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon success-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">BERHASIL</span>
            <span class="stat-value">{{ summary.paid_count }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon pending-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">PENDING</span>
            <span class="stat-value">{{ summary.pending_count }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon failed-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">GAGAL (EXPIRED)</span>
            <span class="stat-value">{{ summary.expired_count }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon transactions-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">TOTAL TRANSAKSI</span>
            <span class="stat-value">{{ summary.total_transactions }}</span>
          </div>
        </div>
      </div>

      <!-- Content Tabs -->
      <div class="report-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'transactions' }"
          @click="activeTab = 'transactions'"
        >
          Daftar Transaksi
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'variants' }"
          @click="activeTab = 'variants'"
        >
          Report Stock
        </button>
      </div>

      <!-- Transactions Table Section -->
      <div v-if="activeTab === 'transactions'" class="transactions-section">
        <div class="section-header">
          <div class="header-main">
            <h2>Daftar Transaksi</h2>
            <div class="total-info">
              <div class="badge-count">{{ summary.total_transactions }} Transaksi</div>
            </div>
          </div>
          
          <div class="header-filters">
            <div class="search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Cari Invoice atau Nama..." 
                @input="handleSearch"
                class="search-input"
              >
            </div>
            
            <div class="custom-dropdown-container" v-click-outside="closeDropdown">
              <div class="custom-dropdown-header" @click="toggleDropdown" :class="{ 'is-active': isDropdownOpen }">
                <span class="selected-label">{{ getStatusLabel(statusFilter) }}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="dropdown-arrow"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              <transition name="fade">
                <div v-if="isDropdownOpen" class="custom-dropdown-options">
                  <div 
                    class="dropdown-option" 
                    :class="{ 'is-selected': statusFilter === '' }"
                    @click="selectStatus('')"
                  >Semua Status</div>
                  <div 
                    class="dropdown-option" 
                    :class="{ 'is-selected': statusFilter === 'paid' }"
                    @click="selectStatus('paid')"
                  >Paid</div>
                  <div 
                    class="dropdown-option" 
                    :class="{ 'is-selected': statusFilter === 'pending' }"
                    @click="selectStatus('pending')"
                  >Pending</div>
                  <div 
                    class="dropdown-option" 
                    :class="{ 'is-selected': statusFilter === 'expired' }"
                    @click="selectStatus('expired')"
                  >Expired</div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="premium-table">
            <thead>
              <tr>
                <th>#</th>
                <th>INVOICE</th>
                <th>CUSTOMER</th>
                <th>PRODUCT</th>
                <th>STATUS</th>
                <th>QTY</th>
                <th>GRAND TOTAL</th>
                <th>STATUS PENGIRIMAN</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in transactions" :key="item.id">
                <td>{{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}</td>
                <td>
                  <a :href="getInvoiceLink(item.invoice_no, 'delivery')" target="_blank" class="invoice-no-link">
                    <span class="invoice-no">{{ item.invoice_no }}</span>
                  </a>
                </td>
                <td>
                  <div class="customer-info">
                    <span class="customer-name">{{ item.shipping_address?.nama_penerima || item.customer?.name || 'Guest' }}</span>
                    <small class="customer-email">{{ item.customer?.email }}</small>
                    <small class="customer-phone">{{ item.shipping_address?.phone || item.customer?.phone || '-' }}</small>
                  </div>
                </td>
                <td>
                  <div class="product-info-list">
                    <div v-for="(p, pi) in item.items" :key="pi" class="product-item-row">
                      <div class="product-creator">{{ findCreatorForProduct(p.product_id) }}</div>
                      <div class="product-detail">
                        <div class="product-name-text">{{ p.product_name }}</div>
                        <div v-if="p.variant_name" class="product-variant-info">
                          Varian: <span>{{ p.variant_name }}</span>
                        </div>
                        <span class="product-meta">({{ p.qty }} x Rp {{ formatCurrency(p.price) }})</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span 
                    class="status-badge" 
                    :style="{ 
                      backgroundColor: (item.transaction_status?.bgcolor || '#444') + '20', 
                      color: item.transaction_status?.bgcolor || '#888',
                      border: `1px solid ${item.transaction_status?.bgcolor || '#444'}40`
                    }"
                  >
                    {{ item.transaction_status?.name }}
                  </span>
                </td>
                <td>{{ item.total_qty }}</td>
                <td>
                  <span class="price-val">Rp {{ formatCurrency(item.total_price || 0) }}</span>
                </td>
                <td>
                  <span 
                    class="pickup-badge" 
                    :class="getDeliveryStatusClass(item)"
                  >
                    {{ getDeliveryStatusText(item) }}
                  </span>
                </td>
                <td>
                  <button class="print-btn" @click="printResi(item)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="mr-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                    Cetak Resi
                  </button>
                </td>
              </tr>
              <tr v-if="transactions.length === 0 && !loading">
                <td colspan="8" class="no-data-cell">No transactions found</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.last_page > 1" class="pagination-wrapper">
          <div class="pagination-info">
             Halaman <strong>{{ pagination.current_page }}</strong> dari <strong>{{ pagination.last_page }}</strong>
          </div>
          <div class="pagination-controls">
            <button 
              class="pag-btn" 
              :disabled="pagination.current_page === 1 || loading"
              @click="fetchData(pagination.current_page - 1)"
            >Prev</button>
            <button 
              class="pag-btn" 
              :disabled="pagination.current_page === pagination.last_page || loading"
              @click="fetchData(pagination.current_page + 1)"
            >Next</button>
          </div>
        </div>
      </div>

      <!-- Variant Report Section -->
      <div v-if="activeTab === 'variants'" class="transactions-section variants-report-section">
        <div class="section-header">
          <div class="header-main">
            <h2>Report Stock</h2>
            <div class="total-info">
              <div class="badge-count">{{ variantsReport.length }} Varian</div>
            </div>
          </div>
          <div class="header-filters">
             <!-- Optional: Add variant-specific filters here -->
          </div>
        </div>

        <div class="table-responsive">
          <table class="premium-table">
            <thead>
              <tr>
                <th>VARIAN</th>
                <th>SKU</th>
                <th>HARGA</th>
                <th>STOCK AWAL</th>
                <th>TERJUAL</th>
                <th>PAID</th>
                <th>PENDING</th>
                <th>EXPIRED</th>
                <th>SISA STOCK</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="v in variantsReport" 
                :key="v.varian_id"
                :class="{ 'sold-out-row': parseInt(v.sisa_stock) <= 0 }"
              >
                <td>
                  <div class="variant-name-cell">
                    <span class="v-name" :class="{ 'v-strikethrough': parseInt(v.sisa_stock) <= 0 }">
                      {{ v.varian_name }}
                    </span>
                    <small class="v-product">{{ v.product_name }}</small>
                    <span v-if="parseInt(v.sisa_stock) <= 0" class="sold-out-text">SOLD OUT</span>
                  </div>
                </td>
                <td><code class="sku-code">{{ v.sku }}</code></td>
                <td><span class="price-val">Rp {{ formatCurrency(v.price) }}</span></td>
                <td>{{ v.stock_awal }}</td>
                <td>{{ v.total_terjual }}</td>
                <td><span class="paid-val">{{ v.total_paid }}</span></td>
                <td><span class="pending-val">{{ v.total_pending }}</span></td>
                <td><span class="expired-val">{{ v.total_expired }}</span></td>
                <td>
                  <span 
                    class="stock-status" 
                    :class="parseInt(v.sisa_stock) <= 0 ? 'out-of-stock' : 'in-stock'"
                  >
                    {{ v.sisa_stock }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Legend Section -->
        <div class="report-legend">
          <div class="legend-item">
            <span class="dot paid"></span>
            <span class="label">Paid = Sudah Terbayar</span>
          </div>
          <div class="legend-item">
            <span class="dot pending"></span>
            <span class="label">Pending = Menunggu Pembayaran</span>
          </div>
          <div class="legend-item">
            <span class="dot expired"></span>
            <span class="label">Expired = Gagal Melakukan Pembayaran</span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>
    </main>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProducts } from '../composables/useProducts';
import { store } from '../store';

const loading = ref(true);
const transactions = ref([]);
const summary = ref({
  total_transactions: 0,
  total_revenue: 0,
  pending_count: 0,
  paid_count: 0,
  cancelled_count: 0,
  expired_count: 0,
  stock_awal: 0,
  sisa_stock: 0
});
const activeTab = ref('transactions'); // 'transactions' or 'variants'
const variantsReport = ref([]);
const pagination = ref({
    current_page: 1,
    per_page: 200,
    last_page: 1
});

const searchQuery = ref('');
const statusFilter = ref('');
let searchTimeout = null;

const isDropdownOpen = ref(false);

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = () => {
    isDropdownOpen.value = false;
};

const selectStatus = (status) => {
    statusFilter.value = status;
    isDropdownOpen.value = false;
    handleFilter();
};

const getStatusLabel = (status) => {
    const labels = {
        '': 'Semua Status',
        'paid': 'Paid',
        'pending': 'Pending',
        'expired': 'Expired'
    };
    return labels[status] || 'Semua Status';
};

// Custom directive for clicking outside
const vClickOutside = {
    mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value();
            }
        };
        document.addEventListener('click', el.clickOutsideEvent);
    },
    unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent);
    },
};

const { products, fetchProducts } = useProducts();

const API_BASE_URL = store.baseUrl;
const SLUG = store.slug; 
const creatorInfo = ref(null);

const findCreatorForProduct = (productId) => {
    if (!products.value) return 'Dee Lestari';
    const p = products.value.find(prod => prod.id === productId);
    return p ? p.author : 'Dee Lestari';
};

const fetchCreatorInfo = async () => {
    try {
        const resp = await fetch(`${API_BASE_URL}/api/creator`);
        const result = await resp.json();
        if (result.data) {
            creatorInfo.value = result.data.find(c => c.slug_url === SLUG);
        }
    } catch (e) {
        console.error('Error fetching creator info:', e);
    }
};

const formatCurrency = (val) => {
    if (!val) return '0';
    return parseInt(val).toLocaleString('id-ID');
};

const getInvoiceLink = (invoiceNo, tab = '') => {
    const domain = API_BASE_URL.includes('api.kolektix.com') ? 'kolektix.com' : 'kolektix.cloud';
    let url = `https://${domain}/merch-invoice/${invoiceNo}`;
    if (tab) url += `?tab=${tab}`;
    return url;
};

const getDeliveryStatusText = (item) => {
    if (item.transaction_status?.name?.toLowerCase() === 'expired') {
        return 'Tidak Terkirim';
    }
    if (item.latest_manifest) {
        return item.latest_manifest.delivery_status;
    }
    return 'Sedang Diproses';
};

const getDeliveryStatusClass = (item) => {
    if (item.transaction_status?.name?.toLowerCase() === 'expired') {
        return 'not-taken';
    }
    if (item.latest_manifest) {
        return 'is-taken';
    }
    return 'not-taken';
};

const fetchData = async (page = 1) => {
    loading.value = true;
    try {
        // Summary from new API
        const reportId = store.reportId;
        const sumResp = await fetch(`${API_BASE_URL}/api/product-bymerchant/report/${reportId}`);
        const sumResult = await sumResp.json();
        
        if (sumResult.status && sumResult.data) {
            const reportData = sumResult.data.summary || {};
            summary.value.paid_count = reportData.total_paid || 0;
            summary.value.pending_count = reportData.total_pending || 0;
            summary.value.cancelled_count = reportData.total_canceled || 0;
            summary.value.expired_count = reportData.total_expired || 0;
            summary.value.stock_awal = reportData.total_stock_awal || 0;
            summary.value.sisa_stock = reportData.total_sisa_stock || 0;
            
            // Store detailed variant report with environment filtering
            let reports = sumResult.data.variants_report || [];
            if (store.allowedVariantIds) {
                reports = reports.filter(r => store.allowedVariantIds.includes(r.varian_id));
            }
            variantsReport.value = reports;
        }

        // Transactions
        let url = `${API_BASE_URL}/api/order-product/creator/${SLUG}/transactions?page=${page}&per_page=200`;
        if (searchQuery.value) url += `&search=${encodeURIComponent(searchQuery.value)}`;
        
        // Try mapping status names to IDs for API if possible
        if (statusFilter.value) {
            const statusMap = { 'pending': 1, 'paid': 2, 'expired': 4 };
            const statusId = statusMap[statusFilter.value];
            if (statusId) url += `&transaction_status_id=${statusId}`;
            // Keep status string too just in case
            url += `&status=${statusFilter.value}`;
        }
        
        const transResp = await fetch(url);
        const transData = await transResp.json();
        if (transData.status) {
            let fetchedTransactions = transData.data.transactions;
            const paginationData = transData.data.pagination;
            
            // Local fallback filtering to ensure UI consistency if API ignores filter
            if (statusFilter.value) {
                fetchedTransactions = fetchedTransactions.filter(t => {
                    const statusName = t.transaction_status?.name?.toLowerCase() || '';
                    if (statusFilter.value === 'paid') return t.transaction_status_id === 2 || statusName === 'paid';
                    if (statusFilter.value === 'pending') return t.transaction_status_id === 1 || statusName === 'pending' || statusName === 'unpaid';
                    if (statusFilter.value === 'expired') {
                        return t.transaction_status_id === 4 || 
                               statusName === 'expired' || 
                               statusName === 'cancelled' || 
                               statusName === 'canceled' || 
                               statusName === 'failed' || 
                               statusName.includes('gagal');
                    }
                    return true;
                });
            }

            transactions.value = fetchedTransactions;
            pagination.value = paginationData;
            
            // Calculate summary stats BASED ON THE CURRENT TABLE DATA (Current Page)
            const paidOnPage = transactions.value.filter(t => 
                t.transaction_status_id === 2 || t.transaction_status?.name?.toLowerCase() === 'paid'
            );
            
            summary.value.total_revenue = paidOnPage.reduce((sum, t) => sum + parseInt(t.total_price || 0), 0);
            summary.value.total_transactions = transactions.value.length;
        }
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
};

const handleSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        fetchData(1);
    }, 500);
};

const handleFilter = () => {
    fetchData(1);
};



onMounted(() => {
    fetchData();
    fetchCreatorInfo();
    fetchProducts();
});

// Cetak Resi Action
const printResi = async (t) => {
  // Try to fetch full invoice details first to get accurate courier info
  let courierName = t.shipping_method?.toUpperCase() || (t.latest_manifest?.courier_name ? t.latest_manifest.courier_name.toUpperCase() : 'JNE');
  let courierService = t.shipping_service || 'reg';
  let trackingNumber = t.latest_manifest?.waybill || 'KLTRX-' + (t.invoice_no || '').replace(/[^A-Z0-9]/ig, '').substring(0, 10).toUpperCase();
  let deliveryPrice = parseInt(t.shipping_cost || t.shipping_price || 9000); 

  try {
      const response = await fetch(`${API_BASE_URL}/api/order-product-invoice/${t.invoice_no}`);
      const result = await response.json();
      if (result.status && result.data) {
          const detailData = result.data.order || result.data;
          
          if(detailData.shipping_method) courierName = detailData.shipping_method.toUpperCase();
          if(detailData.shipping_service) courierService = detailData.shipping_service;
          
          if(detailData.latest_manifest && detailData.latest_manifest.waybill) {
              trackingNumber = detailData.latest_manifest.waybill;
          }
          if(detailData.tracking_number) {
              trackingNumber = detailData.tracking_number;
          } else if(detailData.awb) {
              trackingNumber = detailData.awb;
          }
          
          // Also check explicit courier info from API
          if (result.data.courier) {
              if (result.data.courier.main) courierName = result.data.courier.main.toUpperCase();
              if (result.data.courier.courier_company) courierName = result.data.courier.courier_company.toUpperCase();
              if (result.data.courier.courier_type) courierService = result.data.courier.courier_type;
              
              const cTracking = result.data.courier.tracking_number;
              if (cTracking && cTracking !== null) trackingNumber = cTracking;
          }
          
          // Check manifest array for tracking number
          if (result.data.manifest && Array.isArray(result.data.manifest) && result.data.manifest.length > 0) {
              const mTrack = result.data.manifest[0].tracking_number;
              if (mTrack && mTrack !== null) trackingNumber = mTrack;
          }
          
          if(detailData.delivery_price) deliveryPrice = parseInt(detailData.delivery_price);
      }
  } catch (err) {
      console.error('Failed to fetch detailed invoice for resi print', err);
      // Fallback to table data if fetch fails
  }

  const referenceNumber = t.invoice_no || '-';
  
  const receiverName = t.shipping_address?.nama_penerima || t.customer?.name || 'Guest';
  const receiverPhone = t.shipping_address?.phone || t.customer?.phone || '-';
  
  // Use user context or defaults for sender
  const senderName = 'deelestari';
  const senderPhone = '0811182844'; 
  
  // Full address combining details
  let receiverFullAddress = '';
  if (t.shipping_address) {
    const parts = [
      t.shipping_address.address_detail,
      t.shipping_address.city_name || t.shipping_address.city,
      t.shipping_address.province_name || t.shipping_address.province,
      t.shipping_address.zipcode || t.shipping_address.zip_code
    ];
    // Filter out undefined, null, or "-""
    receiverFullAddress = parts.filter(Boolean).filter(p => p !== '-').join(', ');
  } else {
    receiverFullAddress = '-';
  }

  const senderAddress = 'Perumahan Diamond Valley blok A2 no 1, bedahan Sawangan, Jl. H. Sulaiman, Kec. Sawangan, Kota Depok, Jawa Barat (rumah paling pinggir A2/1 sebelum belokan), Sawangan, Depok, Jawa Barat';
  
  const productItems = t.items.map(i => {
      let name = i.product_name;
      if (i.variant_name) name += ` [${i.variant_name}]`;
      return `${i.qty}x ${name}`;
  }).join(' | ');
  
  const orderNotes = t.order_notes || 'mechanise deelestari';

  const generateBarcodeBars = () => {
    let bars = '';
    for(let i=0; i<30; i++) {
        bars += `<div style="width: ${Math.floor(Math.random() * 4 + 1)}px;"></div>`;
    }
    return bars;
  };

  const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Resi Pengiriman - ${trackingNumber}</title>
        \x3Cstyle>
          /* Reset CSS untuk print */
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
          }
          
          @media print {
            @page {
              size: A4 portrait;
              margin: 0.5cm;
            }
            body {
              background: white;
              padding: 0;
              margin: 0;
            }
            .resi-container {
              box-shadow: none;
              border: 2px solid #000 !important;
              max-height: 98vh;
              page-break-inside: avoid;
              transform-origin: top left;
            }
            .barcode-bars div {
              background-color: #000 !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
          
          .resi-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border: 2px solid #000;
            padding: 15px; /* Reduced from 20px */
            font-size: 13px; /* Slightly reduced base font */
            line-height: 1.3;
          }
          
          .header {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }
          
          .header h1 {
            font-size: 32px;
            font-weight: bold;
            margin: 0;
            color: #000;
            letter-spacing: 2px;
          }
          
          .header .subtitle {
            font-size: 14px;
            color: #000;
            margin-top: 5px;
            font-weight: normal;
          }
          
          .biteship {
            text-align: center;
            margin: 10px 0;
            font-size: 14px;
            color: #000;
            border-bottom: 1px dashed #000;
            padding-bottom: 10px;
          }
          
          .tracking-number {
            text-align: center;
            font-size: 16px; /* Reduced from 18px */
            font-weight: bold;
            margin: 10px 0; /* Reduced from 15px */
            padding: 8px; /* Reduced from 10px */
            border: 2px solid #000;
            background-color: #f9f9f9;
            color: #000;
          }
          
          .barcode-container {
            text-align: center;
            margin: 15px 0; /* Reduced from 20px */
            padding: 10px; /* Reduced from 15px */
            border: 2px solid #000;
            background-color: #fff;
          }
          
          .barcode-bars {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            margin-bottom: 10px;
            background-color: #fff;
          }
          
          .barcode-bars div {
            display: inline-block;
            background-color: #000;
            height: 60px;
            margin-right: 2px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            forced-color-adjust: none;
          }
          
          .barcode-number {
            font-family: monospace;
            font-size: 14px;
            letter-spacing: 2px;
            margin-top: 10px;
            color: #000;
          }
          
          .info-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #000;
            font-size: 14px;
            color: #000;
          }
          
          .reference {
            margin: 15px 0;
            padding: 10px;
            border: 2px solid #000;
            background-color: #f9f9f9;
            color: #000;
          }
          
          .reference-label {
            font-weight: bold;
            margin-right: 10px;
            display: block;
            margin-bottom: 5px;
          }
          
          .reference-value {
            font-family: monospace;
            font-size: 14px;
            word-break: break-all;
          }
          
          .address-section {
            margin: 10px 0; /* Reduced from 15px */
            border: 2px solid #000;
            color: #000;
          }
          
          .address-box {
            padding: 8px; /* Reduced */
          }
          
          .address-box:first-child {
            border-bottom: 2px solid #000;
          }
          
          .address-label {
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 14px;
            text-decoration: underline;
          }
          
          .address-name {
            font-weight: bold;
            margin: 5px 0;
            font-size: 14px;
          }
          
          .address-phone {
            color: #000;
            margin: 5px 0;
            font-size: 14px;
          }
          
          .address-detail {
            line-height: 1.4;
            margin-top: 8px;
            font-size: 13px;
            color: #000;
            white-space: pre-wrap;
          }
          
          .product-info {
            margin: 15px 0;
            padding: 12px;
            border: 2px solid #000;
            background-color: #f9f9f9;
            color: #000;
          }
          
          .product-label {
            font-weight: bold;
            margin-bottom: 8px;
            display: block;
            text-decoration: underline;
          }
          
          .product-detail {
            font-size: 13px;
            line-height: 1.4;
          }
          
          .notes {
            margin: 10px 0;
            padding: 8px;
            border: 2px solid #000;
            background-color: #f9f9f9;
            font-style: italic;
            font-size: 13px;
            color: #000;
          }
          
          .footer {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 2px solid #000;
            text-align: center;
            font-size: 11px;
            color: #000;
          }
          
          .dashed-line {
            border-bottom: 1px dashed #000;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="resi-container">
          <div class="header">
            <h1>${courierName}</h1>
            <div class="subtitle">EXPRESS ACROSS NATIONS</div>
          </div>
          
          <div class="biteship">kolektix.com</div>
          
          <div class="tracking-number">
            Nomor Resi - ${trackingNumber}
          </div>
          
          <div class="barcode-container">
            <div class="barcode-bars">
              ${generateBarcodeBars()}
            </div>
            <div class="barcode-number">${trackingNumber}</div>
          </div>
          
          <div class="info-row">
            <span><strong>Ongkos Kirim:</strong> Rp. ${deliveryPrice.toLocaleString('id-ID')}</span>
            <span><strong>Jenis Layanan</strong> - ${courierService}</span>
          </div>
          
          <div class="reference">
            <span class="reference-label">Reference Number</span>
            <div class="reference-value">${referenceNumber}</div>
          </div>
          
          <div class="address-section">
            <div class="address-box">
              <div class="address-label">Alamat Penerima:</div>
              <div class="address-name">${receiverName}</div>
              <div class="address-phone">${receiverPhone}</div>
              <div class="address-detail">${receiverFullAddress}</div>
            </div>
            
            <div class="address-box">
              <div class="address-label">Alamat Pengirim:</div>
              <div class="address-name">${senderName}</div>
              <div class="address-phone">${senderPhone}</div>
              <div class="address-detail">${senderAddress}</div>
            </div>
          </div>
          
          <div class="product-info">
            <span class="product-label">Jenis Barang:</span>
            <div class="product-detail">${productItems}</div>
          </div>
          
          <div class="notes">
            <em>Catatan: ${orderNotes}</em>
          </div>
          
          <div class="footer">
            Pengiriman dari Warehouse<br>
            kolektix.com
          </div>
        </div>
        \x3Cscript>
            window.onload = function() {
                window.print();
            };
        \x3C/script>
      </body>
      </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
};
</script>

<style scoped>
.live-report-page {
  min-height: 100vh;
  background-color: #000;
  color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.report-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px var(--container-padding);
}

.page-title-section {
  text-align: center;
  margin-bottom: 50px;
}

h1 {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 5px;
}

.subtitle {
  color: #888;
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.header-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.export-btn {
  background: transparent;
  color: #2ecc71;
  border: 2px solid rgba(46, 204, 113, 0.3);
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
}

.export-btn:hover {
  background: rgba(46, 204, 113, 0.1);
  border-color: #2ecc71;
}

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 50px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(29, 161, 242, 0.4);
  transform: translateY(-5px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sales-icon { background: rgba(29, 161, 242, 0.1); color: #1DA1F2; }
.transactions-icon { background: rgba(255, 255, 255, 0.1); color: #fff; }
.pending-icon { background: rgba(255, 167, 38, 0.1); color: #ffa726; }
.success-icon { background: rgba(46, 204, 113, 0.1); color: #2ecc71; }
.failed-icon { background: rgba(231, 76, 60, 0.1); color: #e74c3c; }
.expired-icon { background: rgba(158, 158, 158, 0.1); color: #9e9e9e; }
.stock-icon { background: rgba(155, 89, 182, 0.1); color: #9b59b6; }

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.7rem;
  font-weight: 800;
  color: #888;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 900;
}

/* Tabs */
.report-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  background: rgba(255, 255, 255, 0.03);
  padding: 6px;
  border-radius: 16px;
  width: fit-content;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.tab-btn {
  padding: 10px 25px;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: #888;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.tab-btn.active {
  background: #1DA1F2;
  color: #fff;
  box-shadow: 0 4px 15px rgba(29, 161, 242, 0.3);
}

/* Variant Report Table Specifics */
.variant-name-cell {
  display: flex;
  flex-direction: column;
}

.v-name {
  font-weight: 800;
  color: #fff;
  font-size: 1rem;
}

.v-product {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sku-code {
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  color: #aaa;
}

.paid-val { color: #2ecc71; font-weight: 800; }
.pending-val { color: #ffa726; font-weight: 800; }
.expired-val { color: #e74c3c; font-weight: 800; }

.stock-status {
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 800;
}

.stock-status.in-stock {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.stock-status.out-of-stock {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.sold-out-row {
  background: rgba(231, 76, 60, 0.05) !important;
}

.v-strikethrough {
  text-decoration: line-through;
  opacity: 0.6;
}

.sold-out-text {
  font-size: 0.65rem;
  font-weight: 900;
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  width: fit-content;
  margin-top: 4px;
}

/* Legend */
.report-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-item .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-item .dot.paid { background: #2ecc71; }
.legend-item .dot.pending { background: #ffa726; }
.legend-item .dot.expired { background: #e74c3c; }

.legend-item .label {
  font-size: 0.8rem;
  color: #888;
  font-weight: 500;
}

/* Transactions Table */
.transactions-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 30px;
  padding: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
  flex-wrap: wrap;
}

.header-main {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-filters {
  display: flex;
  gap: 15px;
  flex-grow: 1;
  justify-content: flex-end;
}

.search-box {
  position: relative;
  flex-grow: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #555;
}

.search-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 15px 12px 45px;
  border-radius: 12px;
  color: #fff;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: #1DA1F2;
  box-shadow: 0 0 15px rgba(29, 161, 242, 0.2);
}

.custom-dropdown-container {
  position: relative;
  min-width: 180px;
  z-index: 100;
}

.custom-dropdown-header {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 20px;
  border-radius: 12px;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
  user-select: none;
}

.custom-dropdown-header:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(29, 161, 242, 0.5);
}

.custom-dropdown-header.is-active {
  border-color: #1DA1F2;
  box-shadow: 0 0 15px rgba(29, 161, 242, 0.2);
}

.dropdown-arrow {
  transition: transform 0.3s;
  color: #888;
}

.custom-dropdown-header.is-active .dropdown-arrow {
  transform: rotate(180deg);
  color: #1DA1F2;
}

.custom-dropdown-options {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.dropdown-option {
  padding: 12px 20px;
  font-size: 0.9rem;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-option:hover {
  background: rgba(29, 161, 242, 0.1);
  color: #fff;
}

.dropdown-option.is-selected {
  background: rgba(29, 161, 242, 0.2);
  color: #1DA1F2;
  font-weight: 700;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 800;
  white-space: nowrap;
}

.badge-count {
  background: rgba(29, 161, 242, 0.1);
  color: #1DA1F2;
  padding: 6px 16px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
}

.table-responsive {
  overflow-x: auto;
}

.premium-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 12px;
}

.premium-table th {
  text-align: left;
  padding: 10px 20px;
  color: #555;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 1px;
}

.premium-table td {
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  vertical-align: middle;
}

.premium-table tr td:first-child { border-radius: 15px 0 0 15px; }
.premium-table tr td:last-child { border-radius: 0 15px 15px 0; }

.invoice-no-link {
  text-decoration: none;
}

.invoice-no {
  color: #1DA1F2;
  font-weight: 800;
  font-family: inherit;
  transition: all 0.3s ease;
}

.invoice-no-link:hover .invoice-no {
  color: #fff;
  text-decoration: underline;
}

.customer-info {
  display: flex;
  flex-direction: column;
}

.customer-name { font-weight: 800; font-size: 1rem; }
.customer-email, .customer-phone { font-size: 0.8rem; color: #666; }

.product-item-row {
  margin-bottom: 10px;
}

.product-creator {
  color: #1DA1F2;
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
}

.product-detail {
  font-size: 0.9rem;
  color: #ccc;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.product-name-text {
  color: #fff;
}

.product-variant-info {
  font-size: 0.75rem;
  color: #888;
  font-weight: 500;
}

.product-variant-info span {
  color: #3498db;
  font-weight: 700;
}

.product-meta {
  color: #555;
  font-weight: 400;
  margin-top: 2px;
}

.status-badge {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
}

.pickup-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  line-height: 1.4;
  text-align: center;
}

.pickup-badge.is-taken { background: rgba(46, 204, 113, 0.1); color: #2ecc71; }
.pickup-badge.not-taken { background: rgba(255, 255, 255, 0.05); color: #666; }

.price-val {
  font-weight: 800;
  font-size: 1.1rem;
}

/* Pagination */
.pagination-wrapper {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-info { font-size: 0.9rem; color: #888; }
.pag-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 8px 20px;
  border-radius: 10px;
  cursor: pointer;
  margin-left: 10px;
  font-weight: 700;
  transition: all 0.2s;
}

.pag-btn:hover:not(:disabled) {
  background: rgba(29, 161, 242, 0.2);
  border-color: #1DA1F2;
}

.pag-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.loading-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(29, 161, 242, 0.1);
  border-top-color: #1DA1F2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1200px) {
  .stats-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .header-main {
    justify-content: space-between;
  }

  .header-filters {
    flex-direction: column;
    gap: 10px;
  }

  .search-box, .custom-dropdown-container {
    max-width: none;
    width: 100%;
    min-width: 0;
  }

  .table-responsive {
    margin: 0 -20px;
    padding: 0 20px;
    border-radius: 0;
    -webkit-overflow-scrolling: touch;
  }

  .premium-table {
    min-width: 800px; /* Force scroll but keep it readable */
  }

  .premium-table td {
    padding: 15px 12px;
  }
}

@media (max-width: 480px) {
  .stats-grid { 
    grid-template-columns: 1fr; 
    gap: 10px;
  }
  .stat-card { 
    padding: 12px 15px; 
    gap: 12px;
  }
  .stat-icon { 
    width: 36px; 
    height: 36px; 
  }
  .stat-label {
    font-size: 0.65rem;
  }
  .stat-value { 
    font-size: 1.1rem; 
  }
  .badge-count { 
    font-size: 0.75rem; 
    padding: 4px 10px; 
  }
  
  .transactions-section {
    padding: 20px 15px;
    border-radius: 20px;
  }

  .section-header h2 {
    font-size: 1.2rem;
  }
}

.print-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  white-space: nowrap;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.print-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: 0.5s;
}

.print-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
  background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%);
  border-color: rgba(255, 255, 255, 0.2);
}

.print-btn:hover::before {
  left: 100%;
}

.print-btn:active {
  transform: translateY(0) scale(0.98);
}

.print-btn svg {
  width: 18px;
  height: 18px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.mr-2 { margin-right: 2px; }

</style>