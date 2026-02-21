<script setup>
import { ref } from 'vue';
import { useLanguage } from '../composables/useLanguage';

const { t } = useLanguage();

const modules = [
  {
    num: '01',
    title: 'Ide Menjadi Karya',
    desc: 'Memahami bagaimana sebuah percikan ide bisa dikelola secara sistematis menjadi embrio cerita yang kuat.',
    bullets: ['Teknik Curah Ide', 'Validasi Premis', 'Membangun Peta Cerita']
  },
  {
    num: '02',
    title: 'Seni Bercerita',
    desc: 'Menghidupkan karakter yang berjiwa dan membangun plot yang mampu mengikat pembaca hingga halaman terakhir.',
    bullets: ['Karakterisasi Mendalam', 'Struktur Plot 3 Babak', 'Dinamika Dialog']
  },
  {
    num: '03',
    title: 'Sentuhan Profesional',
    desc: 'Proses krusial setelah draf selesai: riset, swasunting, hingga disiplin Kaizen dalam kepenulisan.',
    bullets: ['Metodologi Riset', 'Teknik Swasunting', 'Manajemen Waktu Penulis']
  }
];

const testimonials = [
  {
    name: 'Alumni Batch 5',
    text: 'Satu-satunya kelas yang mengubah cara pandang saya tentang menulis fiksi. Dari hobi jadi disiplin yang terukur.'
  },
  {
    name: 'Alumni Batch 10',
    text: 'Sangat praktis. Bukan cuma teori, tapi langsung bisa diterapkan ke naskah yang sedang saya kerjakan.'
  }
];

const selectedImage = ref(null);

const openLightbox = (url) => {
  selectedImage.value = url;
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  selectedImage.value = null;
  document.body.style.overflow = 'auto';
};
</script>

<template>
  <main class="kaizen-page">
    <!-- Hero Section -->
    <section class="kaizen-hero">
      <div class="container">
        <span class="badge">Masterclass</span>
        <h1 class="hero-title">Find The Writer Within</h1>
        <p class="hero-subtitle">
          Temukan potensi kreatif Anda melalui metode yang telah teruji selama lebih dari dua dekade.
          Sistematis, inspiratif, dan transformatif.
        </p>
        <a href="https://www.kuncie.com/products/kaizen-structure-ai/" target="_blank" class="btn-primary">Daftar Sekarang</a>
      </div>
    </section>

    <!-- Graduates & Works Section -->
    <section class="section graduates-section">
      <div class="container-full">
        <h2 class="section-title text-center">LULUSAN DAN HASIL KARYA</h2>
        <p class="section-desc text-center" style="margin: 0 auto 3rem;">
          Kaizen Writing telah mencetak ribuan alumnus dari berbagai latar belakang, melahirkan karya-karya baru yang memperkaya dunia literasi Indonesia.
        </p>
        
        <div class="marquee-container">
          <div class="marquee-content">
            <!-- Duplicate images for seamless loop -->
            <img v-for="i in [1,2,3,4,1,2,3,4]" :key="i + Math.random()" :src="`/images/poto${i}.jpeg`" alt="Kaizen Graduate" @click="openLightbox(`/images/poto${i}.jpeg`)" />
          </div>
        </div>
      </div>
    </section>

    <!-- Lightbox Modal -->
    <transition name="fade">
      <div v-if="selectedImage" class="lightbox-overlay" @click="closeLightbox">
        <button class="lightbox-close">&times;</button>
        <img :src="selectedImage" class="lightbox-img" @click.stop />
      </div>
    </transition>

    <!-- Curriculum Section -->
    <section class="section curriculum-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Kurikulum Berkelanjutan</h2>
          <p class="section-desc">Tiga pilar utama yang dirancang untuk menjawab tantangan nyata penulis di setiap tahap kreatif.</p>
        </div>

        <div class="module-grid">
          <div v-for="mod in modules" :key="mod.num" class="module-card">
            <div class="module-header">
              <span class="module-num">{{ mod.num }}</span>
              <h3 class="module-title">{{ mod.title }}</h3>
            </div>
            <p class="module-desc">{{ mod.desc }}</p>
            <ul class="module-list">
              <li v-for="item in mod.bullets" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="section testimonials-section">
      <div class="container">
        <h2 class="section-title text-center">Apa Kata Mereka?</h2>
        <div class="testimonial-grid">
          <div v-for="(testi, i) in testimonials" :key="i" class="testimonial-card">
            <p class="testimonial-text">"{{ testi.text }}"</p>
            <span class="testimonial-name">— {{ testi.name }}</span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.kaizen-page {
  background: #111;
  color: #e6e6e6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.kaizen-hero {
  padding: 8rem 0 6rem;
  background: linear-gradient(to bottom, #1a1512 0%, #111 100%);
  text-align: center;
}

.badge {
  display: inline-block;
  color: #9e4d3d;
  border: 1px solid #9e4d3d;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
}

.hero-title {
  font-family: var(--font-heading, serif);
  font-size: clamp(2.5rem, 6vw, 4rem);
  margin-bottom: 1.5rem;
  color: #fff;
}

.hero-subtitle {
  max-width: 700px;
  margin: 0 auto 2.5rem;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #aaa;
}

.section {
  padding: 6rem 0;
}

.section-header {
  margin-bottom: 4rem;
}

.section-title {
  font-family: var(--font-heading, serif);
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #fff;
}

.section-desc {
  color: #888;
  max-width: 600px;
}

.text-center { text-align: center; }

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.module-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 2.5rem;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.module-card:hover {
  border-color: #9e4d3d;
  transform: translateY(-5px);
  background: rgba(158, 77, 61, 0.05);
}

.module-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.module-num {
  font-family: var(--font-heading, serif);
  font-size: 2rem;
  font-weight: 700;
  color: #9e4d3d;
  opacity: 0.5;
}

.module-title {
  font-size: 1.25rem;
  color: #fff;
}

.module-desc {
  color: #aaa;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.module-list {
  padding-left: 1.2rem;
  color: #888;
  font-size: 0.9rem;
}

.module-list li {
  margin-bottom: 0.5rem;
}

.graduates-section {
  padding-bottom: 4rem;
  background: #0d0d0d;
}

.container-full {
  width: 100%;
}

.marquee-container {
  width: 100%;
  overflow: hidden;
  background: #000;
  padding: 2rem 0;
  position: relative;
}

.marquee-content {
  display: flex;
  width: max-content;
  animation: scroll 40s linear infinite;
  gap: 1rem;
}

.marquee-container:hover .marquee-content {
  animation-play-state: paused;
}

.marquee-content img {
  height: 250px;
  width: auto;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.marquee-content img:hover {
  transform: scale(1.08);
  z-index: 2;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Lightbox Styles */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.lightbox-img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 0 50px rgba(0,0,0,0.8);
}

.lightbox-close {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 3rem;
  cursor: pointer;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.lightbox-close:hover {
  opacity: 1;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.curriculum-section {
  background: #111;
}

.testimonial-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 3rem;
}

.testimonial-card {
  padding: 2rem;
  background: rgba(255,255,255,0.02);
  border-radius: 12px;
  font-style: italic;
  color: #aaa;
}

.testimonial-name {
  display: block;
  margin-top: 1rem;
  font-weight: 600;
  color: #9e4d3d;
  font-style: normal;
}

.btn-primary {
  display: inline-block;
  background: #9e4d3d;
  color: #fff;
  padding: 12px 32px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #b85a47;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(158, 77, 61, 0.4);
}

@media (max-width: 768px) {
  .testimonial-grid { grid-template-columns: 1fr; }
}
</style>
