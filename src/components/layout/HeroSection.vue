<script setup>
import { ref } from 'vue';
import { useLanguage } from '../../composables/useLanguage';

const { t } = useLanguage();
const emit = defineEmits(['search', 'filter-legacy']); // 'filter-legacy' for mega menu clicks if they just filter

const searchQuery = ref('');
const isMegaMenuOpen = ref(false);
const activeTab = ref('tab-koleksi');

const toggleMegaMenu = () => {
  isMegaMenuOpen.value = !isMegaMenuOpen.value;
};

const closeMegaMenu = () => {
  isMegaMenuOpen.value = false;
};

const setActiveTab = (tabId) => {
  activeTab.value = tabId;
};

const handleSearch = () => {
  emit('search', searchQuery.value);
};

// Mock data for mega menu just to keep it clean or we can keep static HTML
</script>

<template>
  <section class="search-section">
    <div class="search-wrapper">
      <!-- Category Button (Trigger) -->
      <button class="category-toggle-btn" @click.stop="toggleMegaMenu" :class="{ active: isMegaMenuOpen }">
        {{ t('kategori') }}
        <svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" :style="{ transform: isMegaMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      <!-- Category Dropdown (Mega Menu Style) -->
      <div class="category-dropdown-menu mega-menu" :class="{ active: isMegaMenuOpen }" @click.stop>
        <div class="mega-sidebar">
          <button class="mega-tab" :class="{ active: activeTab === 'tab-koleksi' }"
            @click="setActiveTab('tab-koleksi')">{{ t('koleksi') }}</button>
          <button class="mega-tab" :class="{ active: activeTab === 'tab-tahun' }"
            @click="setActiveTab('tab-tahun')">{{ t('tahun') }}</button>
          <button class="mega-tab" :class="{ active: activeTab === 'tab-format' }"
            @click="setActiveTab('tab-format')">{{ t('format') }}</button>
        </div>
        <div class="mega-content">
          <!-- Tab: Koleksi -->
          <div class="mega-grid" :class="{ active: activeTab === 'tab-koleksi' }" id="tab-koleksi">
            <a href="#" class="mega-item"><span class="mega-cat-title">{{ t('fiksi') }}</span></a>
            <a href="#" class="mega-item"><span class="mega-cat-title">{{ t('nonFiksi') }}</span></a>
            <a href="#" class="mega-item"><span class="mega-cat-title">{{ t('puisi') }}</span></a>
            <a href="#" class="mega-item"><span class="mega-cat-title">{{ t('musik') }}</span></a>
            <a href="#" class="mega-item"><span class="mega-cat-title">{{ t('esaiJurnal') }}</span></a>
            <a href="#" class="mega-item"><span class="mega-cat-title">{{ t('rekomendasi') }}</span></a>
            <a href="#" class="mega-item"><span class="mega-cat-title">{{ t('supernova') }}</span></a>
            <a href="#" class="mega-item"><span class="mega-cat-title">{{ t('rapijali') }}</span></a>
          </div>

          <!-- Tab: Tahun -->
          <div class="mega-grid" :class="{ active: activeTab === 'tab-tahun' }" id="tab-tahun">
            <a href="#" class="mega-item"><span class="mega-cat-title">2024</span></a>
            <a href="#" class="mega-item"><span class="mega-cat-title">2023</span></a>
            <a href="#" class="mega-item"><span class="mega-cat-title">2022</span></a>
            <a href="#" class="mega-item"><span class="mega-cat-title">2021</span></a>
            <a href="#" class="mega-item"><span class="mega-cat-title">2010 - 2020</span></a>
            <a href="#" class="mega-item"><span class="mega-cat-title">Pre-2010</span></a>
          </div>

          <!-- Tab: Format -->
          <div class="mega-grid" :class="{ active: activeTab === 'tab-format' }" id="tab-format">
            <a href="#" class="mega-item"><span class="mega-cat-title">{{ t('hardCover') }}</span></a>
            <a href="#" class="mega-item"><span class="mega-cat-title">{{ t('softCover') }}</span></a>
            <a href="#" class="mega-item"><span class="mega-cat-title">{{ t('eBook') }}</span></a>
            <a href="#" class="mega-item"><span class="mega-cat-title">{{ t('audioBook') }}</span></a>
            <a href="#" class="mega-item"><span class="mega-cat-title">{{ t('bundle') }}</span></a>
          </div>
        </div>
      </div>

      <div class="search-container">
        <input type="text" :placeholder="t('searchPlaceholder')" class="search-input" v-model="searchQuery"
          @input="handleSearch">
        <div class="search-icon-overlay">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Overlay to close menu when clicking outside -->
  <div v-if="isMegaMenuOpen" class="sidebar-overlay active" style="z-index: 1000; background: transparent;" @click="closeMegaMenu"></div>
</template>

<style scoped>
/* Scoped styles mainly handled by global CSS */
.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 800px;
}

.category-dropdown-menu.mega-menu {
  position: absolute;
  top: calc(100% + 15px);
  left: 0;
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  z-index: 1010;
  display: flex;
  width: 600px; /* Adjust width as needed */
  max-width: 90vw;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
}

.category-dropdown-menu.mega-menu.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* Mega Menu Sidebar */
.mega-sidebar {
  width: 180px;
  background-color: #252525;
  border-right: 1px solid #333;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
}

.mega-tab {
  text-align: left;
  background: transparent;
  border: none;
  color: #aaa;
  padding: 10px 20px;
  cursor: pointer;
  font-family: var(--font-body, sans-serif);
  font-weight: 500;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.mega-tab:hover {
  color: #fff;
  background-color: rgba(255,255,255,0.05);
}

.mega-tab.active {
  color: #fff;
  background-color: #2a2a2a;
  border-left-color: #9e4d3d; /* Primary accent */
}

/* Mega Menu Content */
.mega-content {
  flex: 1;
  padding: 1.5rem;
  min-height: 250px;
}

.mega-grid {
  display: none;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.mega-grid.active {
  display: grid;
}

.mega-item {
  display: block;
  color: #ddd;
  text-decoration: none;
  padding: 6px 0;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.mega-item:hover {
  color: #9e4d3d; /* Accent color */
}

.mega-cat-title {
  display: block;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .category-dropdown-menu.mega-menu {
    flex-direction: column;
    width: 100%;
    left: 0;
    right: 0;
  }
  
  .mega-sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid #333;
    padding: 0;
  }
  
  .mega-tab {
    border-left: none;
    border-bottom: 3px solid transparent;
    padding: 10px 15px;
    white-space: nowrap;
  }
  
  .mega-tab.active {
    border-left: none;
    border-bottom-color: #9e4d3d;
  }
}
</style>
