<template>
  <div class="tracking-page">
    <main class="tracking-container">
      <!-- Header -->
      <div class="page-title-section">
        <div class="title-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
        </div>
        <div class="title-text">
          <h1>LACAK PESANAN</h1>
          <p class="subtitle">Enter your invoice or scan the QR code to track your order</p>
        </div>
      </div>

      <div class="tracking-content">
        <!-- Left Column: Input Selection -->
        <div class="input-section glass-card">
          <div class="tab-header">
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'scan' }"
              @click="setTab('scan')"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><rect x="7" y="7" width="10" height="10"></rect></svg>
              <span>Scan QR</span>
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'manual' }"
              @click="setTab('manual')"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M7 8h10"></path><path d="M7 12h10"></path><path d="M7 16h10"></path></svg>
              <span>Input Manual</span>
            </button>
          </div>

          <div class="tab-content">
            <!-- QR Scanner View -->
            <div v-show="activeTab === 'scan'" class="scanner-wrapper">
              <div id="qr-reader" class="qr-reader"></div>
              <div v-if="!isScannerStarted" class="scanner-init" @click="startScanner">
                <div class="pulse-icon">
                   <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                </div>
                <h3>Luncurkan Kamera</h3>
                <p>Klik di sini untuk mulai scan QR code</p>
              </div>
              <div v-show="isScannerStarted" class="scanner-hud">
                  <div class="hud-box">
                      <div class="hud-corner top-l"></div>
                      <div class="hud-corner top-r"></div>
                      <div class="hud-corner bottom-l"></div>
                      <div class="hud-corner bottom-r"></div>
                      <div class="scan-beam"></div>
                  </div>
                  <button @click="stopScanner" class="stop-scan-btn">BERHENTI SCAN</button>
              </div>
            </div>

            <!-- Manual Input View -->
            <div v-show="activeTab === 'manual'" class="manual-wrapper">
              <div class="input-field">
                <label>NOMOR INVOICE</label>
                <div class="premium-search">
                   <input 
                    type="text" 
                    v-model="manualId" 
                    placeholder="Contoh: MERCH-1773424955UBASJ1"
                    @keyup.enter="trackManual"
                  >
                  <button class="action-btn" @click="trackManual" :disabled="loading || !manualId">
                    <span v-if="!loading">TRACK</span>
                    <div v-else class="tiny-spinner"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Status View -->
        <div class="status-section glass-card">
          <div class="status-indicator-header">
             <div class="header-main">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <h2>HASIL PELACAKAN</h2>
             </div>
             <div v-if="trackingData" class="invoice-badge">{{ trackingData.invoice_no }}</div>
          </div>

          <div class="status-scrollable-container">
            <!-- Placeholder -->
            <div v-if="!trackingData && !loading && !error" class="empty-placeholder">
              <div class="placeholder-art">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
              <h3>Belum Ada Data</h3>
              <p>Masukkan nomor invoice di panel kiri untuk mulai melacak pesanan Anda</p>
            </div>

            <!-- Loading UI -->
            <div v-if="loading" class="track-loader">
                <div class="loader-circle"></div>
                <span>Menghubungkan ke server...</span>
            </div>

            <!-- Error UI -->
            <div v-if="error" class="error-box">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <h3>Oops! Gagal Melacak</h3>
                <p>{{ error }}</p>
                <button class="reset-btn" @click="resetState">Coba Lagi</button>
            </div>

            <!-- Tracking Result UI -->
            <div v-if="trackingData && !loading" class="tracking-result-ui">
              <!-- Summary Grid -->
              <div class="summary-grid">
                <div class="summary-item">
                    <span class="s-label">Penerima</span>
                    <span class="s-value">{{ trackingData.address?.nama_penerima || 'Guest' }}</span>
                </div>
                <div class="summary-item">
                    <span class="s-label">Metode Pembayaran</span>
                    <span class="s-value">{{ trackingData.payment_method_custom || trackingData.payment_method }}</span>
                </div>
                <div class="summary-item">
                    <span class="s-label">Kurir</span>
                    <span class="s-value">{{ trackingData.courier?.courier_company || 'Standard' }} ({{ trackingData.courier?.courier_type || 'REG' }})</span>
                </div>
                <div class="summary-item">
                    <span class="s-label">Total Pesanan</span>
                    <span class="s-value">Rp {{ formatCurrency(trackingData.grandtotal) }}</span>
                </div>
              </div>

              <!-- Item List -->
              <div class="order-items-minimal">
                <h3>Produk yang Dipesan</h3>
                <div v-for="item in trackingData.detail" :key="item.id" class="minimal-item">
                    <img :src="item.product_images?.[0]?.image_url" :alt="item.product?.product_name" class="m-thumb">
                    <div class="m-info">
                        <span class="m-name">{{ item.product?.product_name }}</span>
                        <span class="m-variant">Varian: {{ item.variant?.varian_name || '-' }}</span>
                        <span class="m-qty">x{{ item.qty }}</span>
                    </div>
                </div>
              </div>

              <!-- Final Timeline -->
              <div class="shipment-timeline">
                <h3>Update Pengiriman</h3>
                <div v-if="!trackingData.manifest || trackingData.manifest.length === 0" class="no-updates">
                    <p>Pesanan sedang diproses dan segera diserahkan ke kurir.</p>
                </div>
                <div v-else class="t-list">
                    <div v-for="(log, idx) in trackingData.manifest" :key="idx" class="t-node" :class="{ current: idx === 0 }">
                        <div class="t-line">
                            <div class="t-dot"></div>
                            <div v-if="idx !== trackingData.manifest.length - 1" class="v-line"></div>
                        </div>
                        <div class="t-content">
                            <span class="t-date">{{ formatDate(log.created_at || log.courier_time) }}</span>
                            <p class="t-status">{{ log.status_name || log.tracking_status?.status_delivery }}</p>
                            <p class="t-descr">{{ log.description || log.tracking_status?.description }}</p>
                            <span v-if="log.location" class="t-loc">{{ log.location }}</span>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Global Processing Pulse -->
    <transition name="fade">
      <div v-if="isProcessingScan" class="full-overlay">
         <div class="pulse-loader">
             <div class="pulse-ring"></div>
             <span>MEMBACA DATA SCAN...</span>
         </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Html5Qrcode } from 'html5-qrcode';
import { store } from '../store';

const API_BASE_URL = store.baseUrl;
const activeTab = ref('manual'); 
const manualId = ref('');
const trackingData = ref(null);
const loading = ref(false);
const error = ref(null);
const isProcessingScan = ref(false);
const isScannerStarted = ref(false);

let html5QrCode = null;

const setTab = (tab) => {
    activeTab.value = tab;
    if (tab === 'manual' && isScannerStarted.value) {
        stopScanner();
    }
};

const startScanner = async () => {
    try {
        isScannerStarted.value = true;
        html5QrCode = new Html5Qrcode("qr-reader");
        const config = { fps: 10 };
        
        await html5QrCode.start(
            { facingMode: "environment" },
            config,
            onScanSuccess,
            onScanFailure
        );
    } catch (err) {
        console.error("Scanner start error:", err);
        isScannerStarted.value = false;
        error.value = "Gagal mengakses kamera. Silakan pastikan izin kamera aktif.";
    }
};

const stopScanner = async () => {
    if (html5QrCode && isScannerStarted.value) {
        try {
            await html5QrCode.stop();
            isScannerStarted.value = false;
        } catch (err) {
            console.error("Scanner stop error:", err);
        }
    }
};

const onScanSuccess = (decodedText) => {
    handleTracking(decodedText, decodedText);
    stopScanner();
};

const onScanFailure = () => {
    // Silent fail for scanning frames
};

const trackManual = () => {
    if (manualId.value) {
        handleTracking(manualId.value, manualId.value);
    }
};

const handleTracking = async (invoice, qrCode) => {
    loading.value = true;
    error.value = null;
    trackingData.value = null;
    if (activeTab.value === 'scan') isProcessingScan.value = true;

    try {
        const payload = {
            invoice_no: invoice,
            qr_code: qrCode
        };

        const response = await fetch(`${API_BASE_URL}/api/tracking/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        // Handle different response formats
        if (result.data) {
            trackingData.value = result.data;
        } else if (result.invoice_no) {
            // Probably returned the object directly
            trackingData.value = result;
        } else if (result.status === false) {
             error.value = result.message || "Invoice tidak ditemukan.";
        } else {
            error.value = "Format data tidak dikenali atau data kosong.";
        }
    } catch (err) {
        error.value = "Koneksi ke server terputus. Silakan coba lagi.";
    } finally {
        loading.value = false;
        isProcessingScan.value = false;
    }
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatCurrency = (val) => {
    if (!val) return '0';
    return parseInt(val).toLocaleString('id-ID');
};

const resetState = () => {
    error.value = null;
    trackingData.value = null;
    manualId.value = '';
};

onUnmounted(() => {
    stopScanner();
});
</script>

<style scoped>
.tracking-page {
  min-height: 100vh;
  background-color: #000;
  color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 60px 40px;
}

.tracking-container {
  max-width: 1400px;
  margin: 0 auto;
}

.page-title-section {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 60px;
}

.title-icon {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1DA1F2;
}

.title-text h1 {
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  margin: 0;
  background: linear-gradient(135deg, #fff 0%, #888 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #666;
  font-size: 1rem;
  margin: 5px 0 0 0;
}

.tracking-content {
  display: grid;
  grid-template-columns: 450px 1fr;
  gap: 40px;
  align-items: start;
}

.glass-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 32px;
  overflow: hidden;
  backdrop-filter: blur(20px);
}

/* Input Section */
.tab-header {
  display: flex;
  padding: 10px;
  gap: 10px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 15px;
  border: none;
  border-radius: 20px;
  background: transparent;
  color: #555;
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tab-btn.active {
  background: #fff;
  color: #000;
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
}

.tab-content {
  padding: 30px;
}

/* Scanner Styles */
.scanner-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  background: #0a0a0a;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.qr-reader {
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.qr-reader :deep(video) {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
}

.scanner-init {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  background: radial-gradient(circle at center, #111 0%, #000 100%);
}

.scanner-init:hover {
  background: radial-gradient(circle at center, #161616 0%, #000 100%);
}

.pulse-icon {
  margin-bottom: 20px;
  color: #1DA1F2;
  animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
    0% { transform: scale(0.95); opacity: 0.5; }
    50% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(0.95); opacity: 0.5; }
}

.scanner-init h3 {
    margin: 0 0 5px 0;
    font-size: 1.2rem;
    font-weight: 800;
}

.scanner-init p {
    color: #444;
    font-size: 0.85rem;
}

.scanner-hud {
    position: absolute;
    inset: 0;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.hud-box {
    width: 260px;
    height: 260px;
    position: relative;
    z-index: 10;
}

.hud-corner {
    position: absolute;
    width: 30px;
    height: 30px;
    border: 3px solid rgba(255, 255, 255, 0.6);
}

.top-l { top: -2px; left: -2px; border-right: none; border-bottom: none; border-radius: 8px 0 0 0; }
.top-r { top: -2px; right: -2px; border-left: none; border-bottom: none; border-radius: 0 8px 0 0; }
.bottom-l { bottom: -2px; left: -2px; border-right: none; border-top: none; border-radius: 0 0 0 8px; }
.bottom-r { bottom: -2px; right: -2px; border-left: none; border-top: none; border-radius: 0 0 8px 0; }

.scan-beam {
    position: absolute;
    top: 5%;
    left: 2px;
    right: 2px;
    height: 2px;
    background: #1DA1F2;
    box-shadow: 0 0 15px #1DA1F2, 0 0 30px #1DA1F2;
    animation: beam-move 2.5s infinite ease-in-out;
    z-index: 12;
}

@keyframes beam-move {
    0%, 100% { top: 5%; opacity: 0.3; }
    50% { top: 95%; opacity: 1; }
}

.stop-scan-btn {
    pointer-events: auto;
    margin-top: 50px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.3s;
    z-index: 100;
}

.stop-scan-btn:hover {
    background: #e74c3c;
    border-color: #e74c3c;
}

/* Manual Wrapper */
.input-field label {
    display: block;
    font-size: 0.75rem;
    font-weight: 900;
    color: #444;
    margin-bottom: 12px;
    letter-spacing: 1.5px;
}

.premium-search {
    display: flex;
    gap: 12px;
}

.premium-search input {
    flex: 1;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 18px 25px;
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    transition: all 0.3s;
}

.premium-search input:focus {
    outline: none;
    border-color: #1DA1F2;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 30px rgba(29, 161, 242, 0.1);
}

.action-btn {
    background: #fff;
    color: #000;
    border: none;
    padding: 0 35px;
    border-radius: 16px;
    font-weight: 900;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.action-btn:hover:not(:disabled) {
    transform: scale(1.05) translateY(-2px);
    box-shadow: 0 10px 25px rgba(255,255,255,0.15);
}

.action-btn:disabled { opacity: 0.3; cursor: not-allowed; }

/* Status Section */
.status-section {
    display: flex;
    flex-direction: column;
    min-height: 600px;
}

.status-indicator-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 40px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.header-main {
    display: flex;
    align-items: center;
    gap: 15px;
}

.header-main h2 {
    font-size: 1.1rem;
    font-weight: 900;
    margin: 0;
    letter-spacing: 0.5px;
}

.invoice-badge {
    background: rgba(46, 204, 113, 0.1);
    color: #2ecc71;
    padding: 6px 14px;
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: 800;
}

.status-scrollable-container {
    padding: 40px;
    flex: 1;
}

.empty-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 80px 0;
    color: #333;
}

.placeholder-art { margin-bottom: 30px; opacity: 0.2; }

.empty-placeholder h3 { color: #555; font-weight: 900; margin-bottom: 10px; }
.empty-placeholder p { color: #333; max-width: 300px; font-size: 0.9rem; line-height: 1.5; }

/* Loader */
.track-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100px 0;
}

.loader-circle {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255,255,255,0.05);
    border-top-color: #1DA1F2;
    border-radius: 50%;
    animation: spin 1s infinite linear;
    margin-bottom: 25px;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Tracking Result UI */
.summary-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 40px;
}

.summary-item {
    background: rgba(255, 255, 255, 0.02);
    padding: 20px;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.s-label { font-size: 0.7rem; color: #555; font-weight: 800; text-transform: uppercase; margin-bottom: 5px; display: block; }
.s-value { font-size: 1.1rem; font-weight: 900; color: #fff; }

.order-items-minimal {
    margin-bottom: 50px;
}

.order-items-minimal h3, .shipment-timeline h3 {
    font-size: 0.8rem;
    font-weight: 900;
    color: #444;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 25px;
}

.minimal-item {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 15px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.m-thumb {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    object-fit: cover;
    background: #111;
}

.m-info { display: flex; flex-direction: column; gap: 4px; }
.m-name { font-weight: 800; color: #fff; font-size: 1rem; }
.m-variant { font-size: 0.75rem; color: #555; }
.m-qty { font-size: 0.85rem; color: #1DA1F2; font-weight: 800; }

.t-list {
    position: relative;
    padding-left: 15px;
}

.t-node {
    display: flex;
    gap: 25px;
    padding-bottom: 40px;
    position: relative;
}

.t-line {
    width: 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.v-line {
    width: 2px;
    flex: 1;
    background: rgba(255, 255, 255, 0.08);
    margin-top: 5px;
}

.t-dot {
    width: 10px;
    height: 10px;
    background: #222;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.1);
    z-index: 5;
}

.t-node.current .t-dot {
    background: #2ecc71;
    box-shadow: 0 0 15px rgba(46, 204, 113, 0.5);
    border-color: #2ecc71;
    width: 14px; height: 14px; margin-left: -0px;
}

.t-content { flex: 1; padding-bottom: 30px; }
.t-date { font-size: 0.75rem; color: #555; font-weight: 800; display: block; margin-bottom: 5px; }
.t-status { font-weight: 900; font-size: 1.05rem; margin: 0; color: #fff; }
.t-descr { color: #888; font-size: 0.85rem; line-height: 1.5; margin: 4px 0 8px 0; }
.t-loc { display: inline-block; padding: 4px 12px; background: rgba(255, 255, 255, 0.05); color: #fff; border-radius: 6px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }

/* Full Overlay */
.full-overlay {
    position: fixed;
    inset: 0;
    background: #000;
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pulse-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
}

.pulse-ring {
    width: 80px;
    height: 80px;
    background: #1DA1F2;
    border-radius: 50%;
    animation: scanner-pulse 1.5s infinite;
}

@keyframes scanner-pulse {
    0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(29, 161, 242, 0.4); }
    70% { transform: scale(1.1); box-shadow: 0 0 0 40px rgba(29, 161, 242, 0); }
    100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(29, 161, 242, 0); }
}

/* Error UI */
.error-box {
    background: rgba(231, 76, 60, 0.05);
    border: 1px solid rgba(231, 76, 60, 0.1);
    padding: 40px;
    border-radius: 24px;
    text-align: center;
}

.reset-btn {
    margin-top: 25px;
    background: #e74c3c;
    color: #fff;
    border: none;
    padding: 12px 30px;
    border-radius: 12px;
    font-weight: 900;
    cursor: pointer;
}

@media (max-width: 1000px) {
    .tracking-content { grid-template-columns: 1fr; }
    .tracking-page { padding: 40px 20px; }
}
</style>
