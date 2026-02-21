<script setup>
import { computed } from 'vue';
import { useLanguage } from '../../composables/useLanguage';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);
const { t, setLang, currentLang } = useLanguage();

const closeSidebar = () => {
  emit('close');
};
</script>

<template>
  <div>
    <div class="sidebar-overlay" :class="{ active: isOpen }" @click="closeSidebar"></div>
    <aside class="sidebar" :class="{ active: isOpen }">
      <div class="sidebar-header">
        <h3>Dee Lestari</h3>
        <button class="sidebar-close" aria-label="Close Sidebar" @click="closeSidebar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="sidebar-content">
        <nav class="sidebar-nav">
          <router-link to="/" class="nav-link" @click="closeSidebar">{{ t('beranda') || 'Beranda' }}</router-link>
          <router-link to="/buku" class="nav-link" @click="closeSidebar">{{ t('buku') || 'Buku' }}</router-link>
          <router-link to="/kaizen-writing" class="nav-link" @click="closeSidebar">Kaizen Writing</router-link>
          <router-link to="/musik" class="nav-link" @click="closeSidebar">{{ t('musik') || 'Musik' }}</router-link>
          <router-link to="/blog" class="nav-link" @click="closeSidebar">Blog</router-link>
          <router-link to="/bio" class="nav-link" @click="closeSidebar">{{ t('bio') || 'Bio' }}</router-link>
        </nav>

      </div>
    </aside>
  </div>
</template>

<style scoped>
.sidebar-content-override {
  display: flex;
  flex-direction: column;
}

.sidebar-lang {
  margin-top: auto;
  padding: 20px 0 10px;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.sidebar-lang-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255,255,255,0.4);
  margin-bottom: 10px;
}

.sidebar-lang-btns {
  display: flex;
  gap: 8px;
}

.sidebar-lang-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.18s;
}

.sidebar-lang-btn:hover {
  background: rgba(255,255,255,0.13);
}

.sidebar-lang-btn.active {
  background: rgba(158, 77, 61, 0.35);
  border-color: rgba(158, 77, 61, 0.6);
}

.s-flag-img {
  width: 28px;
  height: 20px;
  object-fit: cover;
  border-radius: 3px;
  display: block;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
</style>
