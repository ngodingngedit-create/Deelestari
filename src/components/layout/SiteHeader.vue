<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../../store';
import { useLanguage } from '../../composables/useLanguage';

const emit = defineEmits(['toggle-menu', 'toggle-cart']);
const router = useRouter();
const headerRef = ref(null);
const langWrapperRef = ref(null);
const userWrapperRef = ref(null);
const { currentLang, setLang, t } = useLanguage();

const isLangOpen = ref(false);
const isUserOpen = ref(false);

const toggleUserDropdown = () => {
  if (!store.isAuthenticated) {
    router.push('/login');
  } else {
    isUserOpen.value = !isUserOpen.value;
  }
};

const handleLogout = () => {
  store.logout();
  isUserOpen.value = false;
  router.push('/');
};

const toggleLangDropdown = () => {
  isLangOpen.value = !isLangOpen.value;
};

const selectLang = (lang) => {
  setLang(lang);
  isLangOpen.value = false;
};

const handleScroll = () => {
  if (headerRef.value) {
    if (window.scrollY > 50) {
      headerRef.value.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
    } else {
      headerRef.value.style.boxShadow = 'none';
    }
  }
};

const handleOutsideClick = (e) => {
  if (langWrapperRef.value && !langWrapperRef.value.contains(e.target)) {
    isLangOpen.value = false;
  }
  if (userWrapperRef.value && !userWrapperRef.value.contains(e.target)) {
    isUserOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', handleOutsideClick);
});
</script>

<template>
  <header class="site-header" ref="headerRef">
    <div class="header-inner">
      <div class="header-left">
        <button class="menu-toggle" aria-label="Menu" @click="$emit('toggle-menu')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Logo Centered -->
      <router-link to="/" class="logo">Dee Lestari</router-link>

      <div class="header-actions">
        <!-- Language Switcher Dropdown -->
        <div class="lang-switcher-wrapper" ref="langWrapperRef">
          <button class="action-btn lang-trigger" @click.stop="toggleLangDropdown" aria-label="Language">
            <img
              class="flag-img"
              :src="currentLang === 'id' ? 'https://flagcdn.com/id.svg' : 'https://flagcdn.com/us.svg'"
              :alt="currentLang === 'id' ? 'Indonesia' : 'English'"
            />
          </button>

          <transition name="lang-pop">
            <div v-if="isLangOpen" class="lang-dropdown-card">
              <p class="lang-dropdown-label">Bahasa</p>
              <button
                class="lang-option-btn"
                :class="{ active: currentLang === 'id' }"
                @click="selectLang('id')"
              >
                <img class="option-flag-img" src="https://flagcdn.com/id.svg" alt="Indonesia" />
                <span class="option-name">Indonesia</span>
                <span v-if="currentLang === 'id'" class="option-check">✓</span>
              </button>
              <button
                class="lang-option-btn"
                :class="{ active: currentLang === 'en' }"
                @click="selectLang('en')"
              >
                <img class="option-flag-img" src="https://flagcdn.com/us.svg" alt="English" />
                <span class="option-name">English</span>
                <span v-if="currentLang === 'en'" class="option-check">✓</span>
              </button>
            </div>
          </transition>
        </div>

        <!-- Shop Button -->
        <router-link to="/produk" class="action-btn shop-btn" aria-label="Shop">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <path d="M3 6h18"></path>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
          </svg>
        </router-link>

        <!-- Cart Toggle -->
        <button class="action-btn cart-toggle" aria-label="Cart" @click="$emit('toggle-cart')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span class="cart-badge" v-if="store.totalItems > 0">{{ store.totalItems }}</span>
        </button>

        <!-- Profile Icon / User Menu -->
        <div class="user-menu-wrapper" ref="userWrapperRef">
          <button class="action-btn profile-btn" :class="{ 'is-auth': store.isAuthenticated }" aria-label="Profile" @click="toggleUserDropdown">
            <template v-if="store.isAuthenticated">
              <span class="user-name-label">{{ store.user.name }}</span>
            </template>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>

          <transition name="lang-pop">
            <div v-if="isUserOpen" class="user-dropdown-card">
              <div class="user-dropdown-header">
                <p class="user-email">{{ store.user.email }}</p>
              </div>
              <router-link to="/dashboard" class="user-option-btn" @click="isUserOpen = false">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>Dashboard</span>
              </router-link>
              <button class="user-option-btn logout-btn" @click="handleLogout">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Keluar</span>
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div class="header-divider"></div>
  </header>
</template>

<style scoped>
/* Language Switcher Wrapper */
.lang-switcher-wrapper {
  position: relative;
}

.lang-trigger {
  display: flex;
  align-items: center;
  gap: 5px;
  line-height: 1;
  padding: 6px 10px;
  border-radius: 8px;
  transition: background 0.15s;
}

.lang-trigger:hover {
  background: rgba(0, 0, 0, 0.06);
}

.lang-code {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: currentColor;
  line-height: 1;
}

.flag-img {
  width: 24px;
  height: 18px;
  object-fit: cover;
  border-radius: 3px;
  display: block;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

/* Dropdown Card */
.lang-dropdown-card {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: #ffffff;
  border-radius: 14px;
  padding: 8px 6px;
  min-width: 168px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.22), 0 2px 8px rgba(0,0,0,0.08);
  z-index: 2500;
  border: 1px solid rgba(0,0,0,0.06);
}

.lang-dropdown-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #b0b0b0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 4px 12px 8px;
  margin: 0;
}

.lang-option-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  background: transparent;
  border: none;
  border-radius: 9px;
  padding: 9px 12px;
  cursor: pointer;
  transition: background 0.15s;
  font-family: var(--font-body, sans-serif);
}

.lang-option-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.lang-option-btn.active {
  background: rgba(158, 77, 61, 0.07);
}

.option-flag-img {
  width: 28px;
  height: 20px;
  object-fit: cover;
  border-radius: 3px;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}

.option-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: #1a1a1a;
  flex: 1;
  text-align: left;
}

.option-check {
  font-size: 0.9rem;
  color: #9e4d3d;
  font-weight: 800;
}

/* User Menu Styles */
.user-menu-wrapper {
  position: relative;
}

.profile-btn.is-auth {
  background: rgba(158, 77, 61, 0.1);
  color: #9e4d3d;
  padding: 6px 16px;
  border-radius: 100px;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name-label {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-dropdown-card {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: #ffffff;
  border-radius: 14px;
  padding: 8px;
  min-width: 200px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.22);
  z-index: 2500;
  border: 1px solid rgba(0,0,0,0.06);
}

.user-dropdown-header {
  padding: 12px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  margin-bottom: 8px;
}

.user-email {
  font-size: 0.75rem;
  color: #888;
  margin: 0;
}

.user-option-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  background: transparent;
  border: none;
  border-radius: 9px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  font-size: 0.9rem;
  color: #1a1a1a;
  text-decoration: none;
}

.user-option-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.logout-btn {
  color: #d32f2f;
}

.logout-btn:hover {
  background: #fdeaea;
}

/* Transition */
.lang-pop-enter-active,
.lang-pop-leave-active {
  transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.lang-pop-enter-from,
.lang-pop-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
.shop-btn {
  margin-right: 5px;
  color: var(--text-light, #1a1a1a); /* Adjust to match theme */
}

.action-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.site-header {
  /* ... existing ... */
}
.shop-btn {
  margin-right: 8px;
  color: var(--text-light, #F4F1EC);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.2s;
}

.shop-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--secondary-accent, #9e4d3d);
}

@media (max-width: 768px) {
  .shop-btn {
    display: none; /* Hide in mobile header if it's already in sidebar */
  }
}
</style>
