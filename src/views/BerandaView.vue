<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useLanguage } from '../composables/useLanguage';

const router = useRouter();
const { t } = useLanguage();

// Hero slider
const featuredBooks = [
  {
    id: 1,
    title: 'Supernova',
    subtitle: 'Ksatria, Puteri, dan Bintang Jatuh',
    category: 'Fiksi',
    year: '2001',
    desc: 'Awal mula perjalanan 20 tahun Supernova. Eksplorasi sains, spiritualitas, dan cinta yang tak biasa.',
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    accent: '#4a90d9',
  },
  {
    id: 2,
    title: 'Perahu Kertas',
    subtitle: '',
    category: 'Fiksi',
    year: '2009',
    desc: 'Kisah Kugy dan Keenan. Tentang mimpi, persahabatan, dan cinta yang melaju seperti perahu kertas di lautan harapan.',
    bg: 'linear-gradient(135deg, #2c2c2c 0%, #3d3d3d 100%)',
    accent: '#e8c97a',
  },
  {
    id: 3,
    title: 'Aroma Karsa',
    subtitle: '',
    category: 'Fiksi',
    year: '2018',
    desc: 'Obsesi akan aroma mematikan. Petualangan Raras dan Jati Wesi menelusuri puspa karsa yang legendaris.',
    bg: 'linear-gradient(135deg, #0d1f0d 0%, #1a2f1a 50%, #2d4a2d 100%)',
    accent: '#7ec87e',
  },
  {
    id: 4,
    title: 'Rapijali',
    subtitle: 'Mencari · Menjadi · Kembali',
    category: 'Fiksi',
    year: '2021',
    desc: 'Ping, remaja Cijulang dengan bakat musik absolut, harus pindah ke Jakarta dan menemukan irama hidup barunya.',
    bg: 'linear-gradient(135deg, #1c2333 0%, #2c3e50 100%)',
    accent: '#a78bfa',
  },
  {
    id: 5,
    title: 'Filosofi Kopi',
    subtitle: 'Kumpulan Cerita dan Prosa',
    category: 'Fiksi',
    year: '2006',
    desc: 'Delapan belas karya terbaik Dee selama satu dekade. Cerita-cerita yang hangat seperti secangkir kopi di pagi hari.',
    bg: 'linear-gradient(135deg, #2d1b0e 0%, #4a2f1a 50%, #6b4226 100%)',
    accent: '#d4956c',
  },
];

const activeSlide = ref(0);
let autoplayTimer = null;

const goToSlide = (index) => {
  activeSlide.value = index;
  resetAutoplay();
};

const nextSlide = () => {
  activeSlide.value = (activeSlide.value + 1) % featuredBooks.length;
  resetAutoplay();
};

const prevSlide = () => {
  activeSlide.value = (activeSlide.value - 1 + featuredBooks.length) % featuredBooks.length;
  resetAutoplay();
};

const startAutoplay = () => {
  autoplayTimer = setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % featuredBooks.length;
  }, 5000);
};

const resetAutoplay = () => {
  clearInterval(autoplayTimer);
  startAutoplay();
};

const goToBuku = () => {
  router.push('/buku');
};

// Press quotes
const quotes = [
  { text: 'Sederhana, tapi dengan pilihan kata-kata luar biasa.', source: 'Harian Kompas', about: 'tentang Madre' },
  { text: 'Adiktif, belia, terobosan baru untuk berbagi kisah inspiratif yang sarat renungan mendalam.', source: 'Harian Jawa Pos', about: 'tentang Perahu Kertas' },
  { text: 'Dee has inspired women of all generations with her creativity, talent, philosophy, and entrepreneurship.', source: 'Global Asia', about: 'tentang Rectoverso' },
];

const activeQuote = ref(0);
let quoteTimer = null;

const startQuoteRotation = () => {
  quoteTimer = setInterval(() => {
    activeQuote.value = (activeQuote.value + 1) % quotes.length;
  }, 4000);
};

onMounted(() => {
  startAutoplay();
  startQuoteRotation();
});

onUnmounted(() => {
  clearInterval(autoplayTimer);
  clearInterval(quoteTimer);
});
</script>

<template>
  <main class="beranda">

    <!-- ═══ HERO SLIDER ═══ -->
    <section class="hero-slider">
      <div class="slider-track">
        <transition-group name="slide-fade" tag="div" class="slides-container">
          <div
            v-for="(book, index) in featuredBooks"
            :key="book.id"
            v-show="activeSlide === index"
            class="slide"
            :style="{ background: book.bg }"
          >
            <div class="slide-inner">
              <div class="slide-content">
                <span class="slide-badge" :style="{ color: book.accent, borderColor: book.accent }">
                  {{ book.category }} · {{ book.year }}
                </span>
                <h1 class="slide-title">{{ book.title }}</h1>
                <p v-if="book.subtitle" class="slide-subtitle">{{ book.subtitle }}</p>
                <p class="slide-desc">{{ book.desc }}</p>
                <div class="slide-actions">
                  <button class="btn-primary" @click="goToBuku">Lihat Koleksi Buku</button>
                  <button class="btn-ghost" @click="goToBuku">Beli Sekarang</button>
                </div>
              </div>
              <div class="slide-visual">
                <div class="book-card-mock" :style="{ '--accent': book.accent }">
                  <span class="book-title-mock">{{ book.title }}</span>
                  <span class="book-author-mock">Dee Lestari</span>
                </div>
              </div>
            </div>

            <!-- Gradient overlay bottom -->
            <div class="slide-overlay-bottom"></div>
          </div>
        </transition-group>
      </div>

      <!-- Navigation arrows -->
      <button class="slider-arrow left" @click="prevSlide" aria-label="Previous">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button class="slider-arrow right" @click="nextSlide" aria-label="Next">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      <!-- Dots -->
      <div class="slider-dots">
        <button
          v-for="(book, index) in featuredBooks"
          :key="index"
          class="dot"
          :class="{ active: activeSlide === index }"
          @click="goToSlide(index)"
          :aria-label="`Slide ${index + 1}`"
        ></button>
      </div>
    </section>

    <!-- ═══ KAIZEN WRITING ═══ -->
    <section class="section-kaizen">
      <div class="section-inner">
        <div class="kaizen-label">Kaizen Writing</div>
        <h2 class="kaizen-title">Find The Writer Within</h2>
        <p class="kaizen-desc">
          Melalui pengalaman inspiratif dan metode yang sistematis, Dee Lestari akan secara langsung 
          menunjukkan bagaimana menulis adalah seni yang bisa terus berkembang dan diasah.
          Bersiaplah mengeksplorasi potensi kreatif Anda.
        </p>
        <div class="kaizen-modules">
          <div class="kaizen-module" v-for="mod in [
            { num: '01', title: 'Ide Menjadi Karya', desc: 'Memahami Ide, Peta Cerita & Sistem Kerja' },
            { num: '02', title: 'Seni Bercerita', desc: 'Menghidupkan Cerita & Karakter' },
            { num: '03', title: 'Sentuhan Profesional', desc: 'Riset, Swasunting & Disiplin Kaizen' },
          ]" :key="mod.num">
            <span class="module-num">{{ mod.num }}</span>
            <div>
              <strong class="module-title">{{ mod.title }}</strong>
              <p class="module-desc">{{ mod.desc }}</p>
            </div>
          </div>
        </div>
        <a href="https://www.kuncie.com/products/kaizen-structure-ai/" target="_blank" rel="noopener" class="btn-primary">
          Daftar Kelas Sekarang
        </a>
      </div>
    </section>

    <!-- ═══ BLOG TEASER ═══ -->
    <section class="section-blog">
      <div class="section-inner blog-inner">
        <div class="blog-text">
          <span class="section-tag">Blog</span>
          <h2 class="blog-title">Untuk Para Pembelajar Menulis</h2>
          <p class="blog-desc">
            10 artikel seputar dasar-dasar penulisan fiksi. Ditulis langsung oleh Dee Lestari, hanya untukmu.
          </p>
          <a href="https://deelestari.com/id/blog/" target="_blank" rel="noopener" class="btn-outline">
            Baca Artikel
          </a>
        </div>
        <div class="blog-stats">
          <div class="stat-item">
            <span class="stat-num">18</span>
            <span class="stat-label">Buku Diterbitkan</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">2000+</span>
            <span class="stat-label">Alumni Kaizen</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">7</span>
            <span class="stat-label">Adaptasi Film</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ BIO / QUOTE SECTION ═══ -->
    <section class="section-bio">
      <div class="section-inner bio-inner">
        <div class="bio-left">
          <span class="section-tag">Bio</span>
          <h2 class="bio-name">Dee Lestari</h2>
          <p class="bio-tagline">Writer · Singer · Song Writer</p>
          <p class="bio-text">
            Penulis garis depan di dunia perbukuan Indonesia, khususnya fiksi. Dee mengawali karier di industri 
            musik sebagai penyanyi dan pencipta lagu, sebelum merilis 18 buku yang semuanya menjadi <em>national bestseller</em>.
          </p>
          <router-link to="/bio" class="btn-outline">Lebih Lanjut</router-link>
        </div>

        <div class="bio-right">
          <div class="quote-carousel">
            <transition name="quote-fade" mode="out-in">
              <div class="quote-card" :key="activeQuote">
                <span class="quote-mark">"</span>
                <p class="quote-text">{{ quotes[activeQuote].text }}</p>
                <div class="quote-source">
                  <strong>{{ quotes[activeQuote].source }}</strong>
                  <span>{{ quotes[activeQuote].about }}</span>
                </div>
              </div>
            </transition>
            <div class="quote-dots">
              <button
                v-for="(q, i) in quotes"
                :key="i"
                class="dot"
                :class="{ active: activeQuote === i }"
                @click="activeQuote = i"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ CTA BUKU ═══ -->
    <section class="section-cta">
      <div class="section-inner cta-inner">
        <h2 class="cta-title">Temukan Karya Dee Lestari</h2>
        <p class="cta-desc">18 judul buku tersedia. Dari Supernova hingga Tanpa Rencana.</p>
        <button class="btn-primary btn-large" @click="goToBuku">Lihat Semua Buku</button>
      </div>
    </section>

  </main>
</template>

<style scoped>
.beranda {
  background: #111;
  color: #e6e6e6;
  min-height: 100vh;
}

/* ═══ HERO SLIDER ═══ */
.hero-slider {
  position: relative;
  height: 100vh;
  min-height: 560px;
  overflow: hidden;
}

.slider-track,
.slides-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
}

.slide-inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.slide-overlay-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(to bottom, transparent, #111);
  pointer-events: none;
}

.slide-badge {
  display: inline-block;
  border: 1px solid;
  border-radius: 100px;
  padding: 4px 14px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 1.2rem;
}

.slide-title {
  font-family: var(--font-heading, 'Playfair Display', serif);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
  margin: 0 0 0.5rem;
}

.slide-subtitle {
  font-size: 1rem;
  color: rgba(255,255,255,0.55);
  margin: 0 0 1.2rem;
  font-style: italic;
  letter-spacing: 0.03em;
}

.slide-desc {
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(255,255,255,0.7);
  max-width: 480px;
  margin: 0 0 2rem;
}

.slide-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Book visual mock */
.slide-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.book-card-mock {
  width: 220px;
  height: 320px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  box-shadow: 0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
  position: relative;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.book-card-mock::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent, #9e4d3d) 0%, transparent 60%);
  opacity: 0.15;
}

.book-card-mock:hover {
  transform: translateY(-8px) rotate(2deg);
}

.book-title-mock {
  font-family: var(--font-heading, 'Playfair Display', serif);
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.4rem;
  line-height: 1.3;
}

.book-author-mock {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.55);
  letter-spacing: 0.05em;
}

/* Slider arrows */
.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  z-index: 10;
  transition: all 0.2s;
  backdrop-filter: blur(6px);
}

.slider-arrow:hover {
  background: rgba(158, 77, 61, 0.4);
  border-color: #9e4d3d;
}

.slider-arrow.left { left: 2rem; }
.slider-arrow.right { right: 2rem; }

/* Dots */
.slider-dots {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.3);
  border: none;
  cursor: pointer;
  transition: all 0.25s;
  padding: 0;
}

.dot.active {
  background: #9e4d3d;
  width: 24px;
  border-radius: 4px;
}

/* Slide transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.6s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}

/* ═══ SHARED SECTION STYLES ═══ */
.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-tag {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #9e4d3d;
  margin-bottom: 1rem;
}

/* ═══ KAIZEN WRITING ═══ */
.section-kaizen {
  padding: 6rem 0;
  background: #161616;
  border-top: 1px solid rgba(255,255,255,0.06);
  text-align: center;
}

.kaizen-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #9e4d3d;
  margin-bottom: 1rem;
}

.kaizen-title {
  font-family: var(--font-heading, 'Playfair Display', serif);
  font-size: clamp(2rem, 4vw, 3rem);
  color: #fff;
  margin: 0 0 1.2rem;
}

.kaizen-desc {
  max-width: 600px;
  margin: 0 auto 3rem;
  font-size: 1rem;
  line-height: 1.75;
  color: rgba(255,255,255,0.6);
}

.kaizen-modules {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
  text-align: left;
}

.kaizen-module {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: border-color 0.2s;
}

.kaizen-module:hover {
  border-color: rgba(158,77,61,0.4);
}

.module-num {
  font-size: 1.5rem;
  font-weight: 800;
  color: #9e4d3d;
  opacity: 0.6;
  font-family: var(--font-heading, serif);
  line-height: 1;
  flex-shrink: 0;
}

.module-title {
  display: block;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.module-desc {
  font-size: 0.82rem;
  color: rgba(255,255,255,0.5);
  margin: 0;
  line-height: 1.5;
}

/* ═══ BLOG TEASER ═══ */
.section-blog {
  padding: 5rem 0;
  background: #111;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.blog-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

.blog-title {
  font-family: var(--font-heading, 'Playfair Display', serif);
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  color: #fff;
  margin: 0 0 1rem;
}

.blog-desc {
  color: rgba(255,255,255,0.6);
  line-height: 1.7;
  margin: 0 0 2rem;
}

.blog-stats {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.stat-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.stat-num {
  font-family: var(--font-heading, 'Playfair Display', serif);
  font-size: 2.5rem;
  font-weight: 700;
  color: #9e4d3d;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.5);
  letter-spacing: 0.03em;
}

/* ═══ BIO / QUOTES ═══ */
.section-bio {
  padding: 6rem 0;
  background: #161616;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.bio-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

.bio-name {
  font-family: var(--font-heading, 'Playfair Display', serif);
  font-size: clamp(2rem, 4vw, 3rem);
  color: #fff;
  margin: 0 0 0.4rem;
}

.bio-tagline {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(255,255,255,0.4);
  margin: 0 0 1.5rem;
}

.bio-text {
  color: rgba(255,255,255,0.65);
  line-height: 1.75;
  margin: 0 0 2rem;
}

/* Quote carousel */
.quote-carousel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.quote-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-left: 3px solid #9e4d3d;
  border-radius: 14px;
  padding: 2rem;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.quote-mark {
  font-family: var(--font-heading, serif);
  font-size: 4rem;
  color: #9e4d3d;
  opacity: 0.3;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.quote-text {
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(255,255,255,0.75);
  font-style: italic;
  margin: 0 0 1rem;
  flex: 1;
}

.quote-source {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.quote-source strong {
  color: #9e4d3d;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.quote-source span {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.35);
}

.quote-dots {
  display: flex;
  gap: 8px;
}

.quote-fade-enter-active,
.quote-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.quote-fade-enter-from { opacity: 0; transform: translateY(12px); }
.quote-fade-leave-to { opacity: 0; transform: translateY(-12px); }

/* ═══ CTA SECTION ═══ */
.section-cta {
  padding: 5rem 0;
  background: linear-gradient(135deg, #1a0e0a 0%, #2d1b14 100%);
  border-top: 1px solid rgba(158,77,61,0.2);
  text-align: center;
}

.cta-title {
  font-family: var(--font-heading, 'Playfair Display', serif);
  font-size: clamp(1.8rem, 3.5vw, 2.5rem);
  color: #fff;
  margin: 0 0 0.8rem;
}

.cta-desc {
  color: rgba(255,255,255,0.55);
  margin: 0 0 2.5rem;
  font-size: 1rem;
}

/* ═══ BUTTONS ═══ */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #9e4d3d;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
  letter-spacing: 0.02em;
  font-family: var(--font-body, sans-serif);
}

.btn-primary:hover {
  background: #b85a47;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(158,77,61,0.35);
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  background: rgba(255,255,255,0.08);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  padding: 12px 28px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
  font-family: var(--font-body, sans-serif);
}

.btn-ghost:hover {
  background: rgba(255,255,255,0.14);
  border-color: rgba(255,255,255,0.3);
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  background: transparent;
  color: #9e4d3d;
  border: 1px solid #9e4d3d;
  border-radius: 8px;
  padding: 11px 24px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
  font-family: var(--font-body, sans-serif);
}

.btn-outline:hover {
  background: #9e4d3d;
  color: #fff;
}

.btn-large {
  padding: 16px 40px;
  font-size: 1rem;
}

/* ═══ RESPONSIVE ═══ */
@media (max-width: 900px) {
  .slide-inner {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 0 1.5rem;
  }

  .slide-visual { display: none; }

  .slide-desc { max-width: 100%; }

  .slide-actions { justify-content: center; }

  .kaizen-modules {
    grid-template-columns: 1fr;
  }

  .blog-inner,
  .bio-inner {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

@media (max-width: 640px) {
  .slider-arrow { display: none; }
  .section-kaizen,
  .section-blog,
  .section-bio,
  .section-cta { padding: 4rem 0; }
}
</style>
