<template>
  <div class="live-report-page">
    <main class="report-container">
      <div class="page-title-section">
        <div class="mcl-logo-wrapper" v-if="false">
            <div class="mcl-logo">
                <div class="logo-circle">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mcl-icon">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <span class="logo-text">MCL</span>
            </div>
        </div>
        <h1>STATISTIK MERCHANDISE</h1>
        <p class="subtitle">Overview of sales and performances</p>
        <div class="header-actions" v-if="false">
          <button class="check-stock-btn" @click="showStockModal = true">
            <span class="btn-icon-bg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path><path d="M12 3v6"></path></svg>
            </span>
            <span>CEK STOCK</span>
          </button>
          <button class="export-btn" @click="exportToExcel">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
            <span>EXPORT EXCEL</span>
          </button>
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
            <span class="stat-value">{{ summary.cancelled_count }}</span>
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

      <!-- Transactions Table Section -->
      <div class="transactions-section">
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

      <!-- Loading State -->
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>
    </main>

    <!-- Stock Modal -->
    <div v-if="showStockModal" class="modal-overlay" @click.self="showStockModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>CEK STOCK</h3>
          <button class="close-btn" @click="showStockModal = false">×</button>
        </div>
        <div class="modal-body">
            <div class="scanner-input-wrapper">
              <input 
                type="text" 
                v-model="scannedCode" 
                @keyup.enter="handleScan"
                placeholder="Scan barcode atau ketik manual..."
                class="scanner-input"
                autofocus
              >
            </div>
            <div v-if="stockResult" class="stock-result">
                <div v-if="stockResult.found" class="result-success">
                    <p><strong>Produk:</strong> {{ stockResult.productName }}</p>
                    <p><strong>Varian:</strong> {{ stockResult.variantName }}</p>
                    <p><strong>Stock:</strong> <span class="stock-badge">{{ stockResult.stock }} pcs</span></p>
                </div>
                <div v-else class="result-error">
                    <p>{{ stockResult.message }}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
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
  cancelled_count: 0
});
const pagination = ref({
    current_page: 1,
    per_page: 100,
    last_page: 1
});

const searchQuery = ref('');
const statusFilter = ref('');
let searchTimeout = null;

const showStockModal = ref(false);
const scannedCode = ref('');
const stockResult = ref(null);

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
const SLUG = store.baseUrl.includes('api.kolektix.com') ? 'quo8xyabgs' : '8mzptkrp1u'; 
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
        // Summary
        const sumResp = await fetch(`${API_BASE_URL}/api/order-product/creator/${SLUG}/transactions-summary`);
        const sumData = await sumResp.json();
        if (sumData.status) summary.value = sumData.data.summary;

        // Transactions
        let url = `${API_BASE_URL}/api/order-product/creator/${SLUG}/transactions?page=${page}&per_page=100`;
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
            // as requested: "berdasarkan tabel aja, yang ada di tabel yang dihitung"
            const paidOnPage = transactions.value.filter(t => 
                t.transaction_status_id === 2 || t.transaction_status?.name?.toLowerCase() === 'paid'
            );
            
            summary.value.paid_count = paidOnPage.reduce((sum, t) => sum + (parseInt(t.total_qty) || 0), 0);
            summary.value.total_revenue = paidOnPage.reduce((sum, t) => sum + parseInt(t.total_price || 0), 0);
            
            summary.value.pending_count = transactions.value.filter(t => 
                t.transaction_status_id === 1 || 
                t.transaction_status?.name?.toLowerCase() === 'unpaid' || 
                t.transaction_status?.name?.toLowerCase() === 'pending'
            ).length;
            
            summary.value.cancelled_count = transactions.value.filter(t => 
                t.transaction_status_id === 4 || 
                t.transaction_status?.name?.toLowerCase() === 'expired' || 
                t.transaction_status?.name?.toLowerCase() === 'cancelled' ||
                t.transaction_status?.name?.toLowerCase() === 'canceled' ||
                t.transaction_status?.name?.toLowerCase() === 'failed'
            ).length;

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

const handleScan = async () => {
    if (!scannedCode.value) return;
    
    // Search in local database
    if (products.value.length === 0) {
        await fetchProducts(1, false);
    }

    let found = null;
    for (const p of products.value) {
        if (p.sku === scannedCode.value) {
            found = { productName: p.title, variantName: 'Main', stock: p.stock };
            break;
        }
        const v = p.variants?.find(v => v.sku === scannedCode.value);
        if (v) {
            found = { productName: p.title, variantName: v.varian_name || v.name, stock: v.stock_qty || v.stock };
            break;
        }
    }

    if (found) {
        stockResult.value = { found: true, ...found };
    } else {
        stockResult.value = { found: false, message: 'SKU tidak ditemukan' };
    }
    scannedCode.value = '';
};

const exportToExcel = () => {
    let csv = 'Invoice,Customer,Products,Total Qty,Grand Total,Status,Pengiriman\n';
    transactions.value.forEach(t => {
        const prods = t.items.map(i => {
            let name = i.product_name;
            if (i.variant_name) name += ` [${i.variant_name}]`;
            return `${name} (${i.qty})`;
        }).join(' | ');
        const deliveryStatus = getDeliveryStatusText(t);
        const calculatedGrandTotal = parseInt(t.total_price || 0);
        csv += `${t.invoice_no},${t.customer?.name || 'Guest'},"${prods}",${t.total_qty},${calculatedGrandTotal},${t.transaction_status?.name},"${deliveryStatus}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `report-${SLUG}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

onMounted(() => {
    fetchData();
    fetchCreatorInfo();
});
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

.mcl-logo-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.mcl-logo {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 8px 18px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 10px;
    backdrop-filter: blur(10px);
}

.logo-circle {
    width: 32px;
    height: 32px;
    background: #1DA1F2;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 15px rgba(29, 161, 242, 0.5);
}

.mcl-icon {
    width: 18px;
    height: 18px;
}

.logo-text {
    font-weight: 800;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
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

.check-stock-btn {
  background: #1DA1F2;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s;
  box-shadow: 0 10px 20px rgba(29, 161, 242, 0.3);
}

.check-stock-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(29, 161, 242, 0.4);
}

.btn-icon-bg {
    background: rgba(255, 255, 255, 0.2);
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
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

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-card {
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 90%;
  max-width: 500px;
  border-radius: 24px;
  overflow: hidden;
}

.modal-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-body { padding: 30px; }
.scanner-input {
  width: 100%;
  background: #000;
  border: 1px solid #333;
  padding: 15px;
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
}

.stock-result { margin-top: 20px; padding: 20px; background: rgba(255, 255, 255, 0.05); border-radius: 15px; }
.stock-badge { background: #1DA1F2; padding: 4px 10px; border-radius: 6px; font-weight: 800; }

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
</style>
