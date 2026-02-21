<script setup>
import { useLanguage } from '../composables/useLanguage';

const { t } = useLanguage();

// Placeholder logic for carousels if needed later
const handlePrev = (section) => {
  console.log(`Prev clicked for ${section}`);
};

const handleNext = (section) => {
  console.log(`Next clicked for ${section}`);
};
</script>

<template>
  <div class="bio-page">
    <!-- Bio Hero Section -->
    <section class="bio-hero">
      <!-- Background Image -->
      <div class="bio-hero-bg" style="background-image:url('/images/Biografi-Dee-Lestari.jpeg');"></div>
      <div class="bio-hero-overlay">
        <div class="bio-hero-content">
          <h1 class="bio-title">{{ t('bioHeroTitle') }}</h1>
          <p class="bio-desc">{{ t('bioHeroDesc') }}</p>
        </div>
      </div>
    </section>

    <!-- History Musik -->
    <section class="history-section music-history">
      <div class="history-container">
        <div class="history-content">
          <span class="history-label">{{ t('musicLabel') }}</span>
          <h2 class="history-title">{{ t('musicTitle') }}</h2>
          <p class="history-text">
            {{ t('musicText') }}
          </p>
        </div>
        <div class="history-image placeholder-image" style="background-color: #2a2a2a;">
          <button class="nav-btn prev-btn" aria-label="Previous" @click="handlePrev('music')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button class="nav-btn next-btn" aria-label="Next" @click="handleNext('music')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Karir Menulis -->
    <section class="history-section writing-history reverse">
      <div class="history-container">
        <div class="history-content">
          <span class="history-label">{{ t('writingLabel') }}</span>
          <h2 class="history-title">{{ t('writingTitle') }}</h2>
          <p class="history-text">
            {{ t('writingText') }}
          </p>
        </div>
        <div class="history-image placeholder-image" style="background-color: #333;">
          <button class="nav-btn prev-btn" aria-label="Previous" @click="handlePrev('writing')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button class="nav-btn next-btn" aria-label="Next" @click="handleNext('writing')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Perfileman -->
    <section class="history-section film-history">
      <div class="history-container">
        <div class="history-content">
          <span class="history-label">{{ t('filmLabel') }}</span>
          <h2 class="history-title">{{ t('filmTitle') }}</h2>
          <p class="history-text">
            {{ t('filmText') }}
          </p>
        </div>
        <div class="history-image placeholder-image" style="background-color: #252525;">
          <button class="nav-btn prev-btn" aria-label="Previous" @click="handlePrev('film')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button class="nav-btn next-btn" aria-label="Next" @click="handleNext('film')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Awards Section -->
    <section class="awards-section">
      <div class="awards-container">
        <h2 class="awards-title">{{ t('awardsTitle') }}</h2>
        <div class="awards-grid">
          <div class="award-item">
            <div class="award-year">2022</div>
            <div class="award-detail">
              <h3>IKAPI Awards</h3>
              <p>Book of The Year - "Aroma Karsa"</p>
            </div>
          </div>
          <div class="award-item">
            <div class="award-year">2018</div>
            <div class="award-detail">
              <h3>Anugerah Pembaca Indonesia</h3>
              <p>{{ t('favoriteAuthor') }}</p>
            </div>
          </div>
          <div class="award-item">
            <div class="award-year">2016</div>
            <div class="award-detail">
              <h3>Indonesia Box Office Movie Awards</h3>
              <p>{{ t('bestScriptwriter') }} - "Filosofi Kopi"</p>
            </div>
          </div>
          <div class="award-item">
            <div class="award-year">2001</div>
            <div class="award-detail">
              <h3>Khatulistiwa Literary Award</h3>
              <p>{{ t('bestFiction') }} - "Supernova"</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Scoped styles mainly handled by global CSS */
</style>
