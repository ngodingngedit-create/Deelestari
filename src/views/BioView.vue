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
        <div class="history-image" style="background-image: url('https://deelestari.com/wp-content/uploads/2024/06/RSD-lawas.jpeg'); background-size: cover; background-position: center;">
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
        <div class="history-image" style="background-image: url('https://deelestari.com/wp-content/uploads/2016/02/IEP-KalenderKerja-500x332.jpg'); background-size: cover; background-position: center;">
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
        <div class="history-image" style="background-image: url('https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800'); background-size: cover; background-position: center;">
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
.bio-page {
  background-color: #111;
  color: #fff;
}

.bio-hero {
  position: relative;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.bio-hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: brightness(0.6);
}

.bio-hero-overlay {
  position: relative;
  z-index: 2;
  text-align: center;
}

.bio-title {
  font-family: 'Playfair Display', serif;
  font-size: 4rem;
  margin-bottom: 1rem;
}

.bio-desc {
  font-size: 1.25rem;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
  color: #ccc;
}

.history-section {
  padding: 100px 0;
}

.history-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 60px;
  padding: 0 20px;
}

.history-section.reverse .history-container {
  flex-direction: row-reverse;
}

.history-content {
  flex: 1;
}

.history-label {
  color: #9e4d3d;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.9rem;
  margin-bottom: 10px;
  display: block;
}

.history-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.history-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #aaa;
}

.history-image {
  flex: 1;
  height: 400px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

.awards-section {
  padding: 100px 0;
  background-color: #1a1a1a;
}

.awards-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.awards-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  margin-bottom: 50px;
  text-align: center;
}

.awards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.award-item {
  background: rgba(255,255,255,0.03);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.05);
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.award-item:hover {
  transform: translateY(-5px);
  border-color: rgba(158, 77, 61, 0.4);
  background: rgba(255,255,255,0.05);
}

.award-year {
  color: #9e4d3d;
  font-weight: 800;
  font-size: 1.1rem;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.award-detail h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 6px;
  color: #fff;
  line-height: 1.4;
}

.award-detail p {
  font-size: 0.85rem;
  color: #888;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .history-container, .history-section.reverse .history-container {
    flex-direction: column;
    text-align: center;
    gap: 30px;
  }
  .bio-title { font-size: 2.8rem; }
  .bio-desc { font-size: 1.1rem; padding: 0 20px; }
  .history-image { width: 100%; height: 280px; }
  .awards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
