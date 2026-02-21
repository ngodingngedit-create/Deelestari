<script setup>
import { store } from '../../store';
</script>

<template>
  <transition name="toast">
    <div v-if="store.notification.show" class="toast-notification" :class="store.notification.type">
      <div class="toast-icon">
        <svg v-if="store.notification.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </div>
      <span class="toast-message">{{ store.notification.message }}</span>
    </div>
  </transition>
</template>

<style scoped>
.toast-notification {
  position: fixed;
  top: 90px;
  right: 20px;
  background-color: #2a2a2a;
  color: #fff;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  z-index: 3000;
  border: 1px solid #333;
  min-width: 250px;
}

.toast-notification.success {
  border-left: 4px solid #9e4d3d;
}

.toast-icon {
  color: #9e4d3d;
  display: flex;
  align-items: center;
}

.toast-notification.info {
  border-left: 4px solid #9e4d3d; /* Using same brand color as requested */
}

.toast-notification.info .toast-icon {
  color: #9e4d3d;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
