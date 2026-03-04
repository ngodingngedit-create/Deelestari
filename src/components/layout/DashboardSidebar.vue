<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { store } from '../../store';

const route = useRoute();

const menuItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>`
  },
  {
    name: 'Semua Blog',
    path: '/blog',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>`
  }
];

const isActive = (path) => route.path === path;
</script>

<template>
  <aside class="dashboard-sidebar">
    <div class="sidebar-header">
      <div class="user-info">
        <div class="user-avatar" :class="{ 'has-image': store.user?.has_creator?.image_url }">
          <img v-if="store.user?.has_creator?.image_url" :src="store.user.has_creator.image_url" :alt="store.user.name" class="avatar-img">
          <span v-else>{{ store.user?.name?.charAt(0) }}</span>
        </div>
        <div class="user-details">
          <p class="user-name">{{ store.user?.name }}</p>
          <p class="user-role">Administrator</p>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path" 
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
      >
        <span class="nav-icon" v-html="item.icon"></span>
        <span class="nav-label">{{ item.name }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <p class="footer-text">© 2024 Dee Lestari</p>
    </div>
  </aside>
</template>

<style scoped>
.dashboard-sidebar {
  width: 280px;
  background: #1a1a1a;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  padding: 2rem 0;
  color: #fff;
  z-index: 100;
}

.sidebar-header {
  padding: 0 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 44px;
  height: 44px;
  background: #9e4d3d;
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.2rem;
  overflow: hidden;
}

.user-avatar.has-image {
  background: transparent;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-weight: 700;
  font-size: 0.95rem;
  margin: 0;
}

.user-role {
  font-size: 0.75rem;
  color: #666;
  margin: 0;
}

.sidebar-nav {
  padding: 2rem 1rem;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 12px 1rem;
  color: #888;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s;
  margin-bottom: 0.5rem;
}

.nav-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.nav-item.active {
  color: #fff;
  background: #9e4d3d;
  box-shadow: 0 4px 15px rgba(158, 77, 61, 0.2);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-label {
  font-weight: 600;
  font-size: 0.9rem;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-text {
  font-size: 0.75rem;
  color: #444;
  margin: 0;
}

@media (max-width: 1024px) {
  .dashboard-sidebar {
    display: none;
  }
}
</style>
