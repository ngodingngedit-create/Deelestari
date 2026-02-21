<script setup>
import { useLanguage } from '../../composables/useLanguage';
const { t } = useLanguage();
</script>

<template>
  <footer class="site-footer">
    <div class="footer-content">
      <p class="copyright">{{ t('copyright') }}</p>
    </div>
  </footer>
</template>

<style scoped>
/* Scoped styles mainly handled by global CSS */
</style>
