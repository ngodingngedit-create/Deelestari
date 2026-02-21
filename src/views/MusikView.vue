<script setup>
import { ref } from 'vue';
import { useLanguage } from '../composables/useLanguage';

const { t } = useLanguage();

const selectedImage = ref(null);

const openLightbox = (url) => {
  selectedImage.value = url;
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  selectedImage.value = null;
  document.body.style.overflow = 'auto';
};

const musicPhilosophy = [
  {
    title: 'KEKUATAN LIRIK, NARASI, DAN PENCIPTAAN',
    text: 'Dee menulis lirik lagu dengan tema yang beragam mulai dari kehidupan sehari-hari, kisah cinta, penemuan jati diri, hingga spiritualitas. Sama seperti karya fiksinya, bagi Dee, setiap lagu adalah wahana storytelling. Liriknya kaya bagai sebuah cerita mini yang memiliki setting, konflik, dan resolusi.'
  },
  {
    title: 'VOKAL DAN MUSIKALITAS',
    text: 'Karakter vokal mezzo-sopran yang liris dan syahdu seakan melengkapi narasi lirik dan lagu yang diciptakannya hingga menghadirkan pesona musik yang khas: menghibur sekaligus menggugah, ringan sekaligus mendalam, memasyarakat sekaligus berkelas.'
  }
];
</script>

<template>
  <main class="musik-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <span class="badge">Singer-Songwriter</span>
        <h1 class="title">Bercerita Melalui Nada</h1>
        <p class="subtitle">
          Dee Lestari merupakan personifikasi musik yang liris dan kaya. Perpaduan unik antara keahlian dalam berkisah, vokal yang terasah, dan musikalitas lintas genre.
        </p>
      </div>
    </section>

    <!-- Spotify Section -->
    <section class="section spotify-section">
      <div class="container">
        <div class="spotify-wrapper">
          <iframe 
            style="border-radius:12px" 
            src="https://open.spotify.com/embed/artist/1mCcTwpEABnSVB4D8rXfRN?utm_source=generator&theme=0" 
            width="100%" 
            height="450" 
            frameBorder="0" 
            allowfullscreen="" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>

    <!-- Content / Philosophy Section -->
    <section class="section philosophy-section">
      <div class="container">
        <div class="philosophy-grid">
          <div v-for="item in musicPhilosophy" :key="item.title" class="phi-card">
            <h3 class="phi-title">{{ item.title }}</h3>
            <p class="phi-text">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Photo Marquee Section -->
    <section class="section marquee-section">
      <div class="container-full">
        <h2 class="section-title text-center">PERJALANAN MUSIK</h2>
        <div class="marquee-container">
          <div class="marquee-content">
            <!-- Duplicate for seamless loop -->
            <img v-for="i in [1,2,3,4,5,1,2,3,4,5]" :key="i + '-' + Math.random()" :src="`/images/potoo${i}.jpeg`" alt="Dee Lestari Music" @click="openLightbox(`/images/potoo${i}.jpeg`)" />
          </div>
        </div>
      </div>
    </section>

    <!-- Lightbox -->
    <transition name="fade">
      <div v-if="selectedImage" class="lightbox-overlay" @click="closeLightbox">
        <button class="lightbox-close">&times;</button>
        <img :src="selectedImage" class="lightbox-img" @click.stop />
      </div>
    </transition>
  </main>
</template>

<style scoped>
.musik-page {
  background: #0a0a0a;
  color: #e6e6e6;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero {
  padding: 10rem 0 6rem;
  background: linear-gradient(to bottom, #1a1a1a 0%, #0a0a0a 100%);
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

.title {
  font-family: var(--font-heading, serif);
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  margin-bottom: 1.5rem;
  color: #fff;
}

.subtitle {
  max-width: 800px;
  margin: 0 auto;
  font-size: 1.2rem;
  line-height: 1.6;
  color: #aaa;
}

.section {
  padding: 6rem 0;
}

.spotify-section {
  background: #0f0f0f;
}

.spotify-wrapper {
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  border-radius: 12px;
  overflow: hidden;
}

.philosophy-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}

.phi-title {
  font-family: var(--font-heading, serif);
  font-size: 1.4rem;
  color: #9e4d3d;
  margin-bottom: 1.5rem;
  letter-spacing: 0.05em;
}

.phi-text {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #888;
}

/* Marquee */
.container-full { width: 100%; }
.section-title { font-family: var(--font-heading, serif); font-size: 2.22rem; margin-bottom: 3rem; color: #fff; }
.text-center { text-align: center; }

.marquee-container {
  width: 100%;
  overflow: hidden;
  background: #000;
  padding: 3rem 0;
  position: relative;
}

.marquee-content {
  display: flex;
  width: max-content;
  animation: scroll 45s linear infinite;
  gap: 1.5rem;
}

.marquee-container:hover .marquee-content {
  animation-play-state: paused;
}

.marquee-content img {
  height: 300px;
  width: auto;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.marquee-content img:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 40px rgba(0,0,0,0.6);
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Lightbox */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(15px);
}

.lightbox-img {
  max-width: 90%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 4px;
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
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .philosophy-grid { grid-template-columns: 1fr; gap: 3rem; }
  .title { font-size: 2.5rem; }
}
</style>
