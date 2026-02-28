<script setup>
import { ref } from 'vue';

// Sample blog data (ideally this would come from a store or API)
const articles = [
  { 
    id: 1, 
    title: 'Dasar Penulisan Fiksi: Membangun Dunia', 
    date: '12 Feb 2024', 
    category: 'Dasar Penulisan', 
    excerpt: 'Bagaimana menciptakan latar belakang yang terasa nyata dan mendalam bagi pembaca...', 
    color: '#2a1a1a',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1000'
  },
  { 
    id: 2, 
    title: 'Seni Swasunting bagi Penulis Pemula', 
    date: '05 Jan 2024', 
    category: 'Teknik', 
    excerpt: 'Menulis adalah menggali, menyunting adalah memahat. Pelajari cara mengasah naskah Anda...', 
    color: '#1a1d2a',
    image: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=80&w=1000'
  },
  { 
    id: 3, 
    title: 'Menemukan Suara Unik dalam Tulisan', 
    date: '20 Des 2023', 
    category: 'Refleksi', 
    excerpt: 'Bukan tentang meniru, tapi tentang menggali kejujuran dalam setiap kata yang Anda pilih...', 
    color: '#1a2a1a',
    image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=1000'
  },
  { 
    id: 4, 
    title: 'Riset: Pondasi Tersembunyi Sebuah Karya', 
    date: '10 Nov 2023', 
    category: 'Dasar Penulisan', 
    excerpt: 'Dibalik Aroma Karsa ada riset panjang. Simak pentingnya data dalam fiksi...', 
    color: '#2a2a1a',
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1000'
  },
];
</script>

<template>
  <main class="dashboard-page">
    <section class="section">
      <div class="container">
        <div class="dashboard-header">
          <h1 class="page-title">Blog Dashboard</h1>
          <p class="page-subtitle">Kelola dan lihat semua artikel blog Anda di sini.</p>
        </div>

        <div class="article-grid">
          <div v-for="post in articles" :key="post.id" class="article-card">
            <div class="card-image" :style="{ backgroundImage: `url(${post.image})` }">
              <div class="card-category-tag">{{ post.category }}</div>
            </div>
            <div class="card-body">
              <div class="card-meta">
                <span class="card-date">{{ post.date }}</span>
              </div>
              <h3 class="card-title">{{ post.title }}</h3>
              <p class="card-excerpt">{{ post.excerpt }}</p>
              <div class="card-actions">
                <a href="#" class="btn-text">Edit Artikel</a>
                <a href="#" class="read-more">Lihat →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.dashboard-page {
  background: var(--bg-dark);
  color: var(--text-light);
  min-height: 100vh;
  padding-top: 4rem;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

.section {
  padding: 4rem 0;
}

.dashboard-header {
  margin-bottom: 4rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 2rem;
}

.page-title {
  font-family: var(--font-heading);
  font-size: 3.5rem;
  color: #fff;
  margin-bottom: 1rem;
}

.page-subtitle {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
}

.article-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.article-card:hover {
  transform: translateY(-10px);
  border-color: var(--primary-accent);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.card-image {
  height: 200px;
  width: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.card-category-tag {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--primary-accent);
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-body {
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-meta {
  margin-bottom: 1rem;
}

.card-date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.card-title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.card-excerpt {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
  line-height: 1.6;
  flex: 1;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.btn-text {
  color: var(--text-light);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.btn-text:hover {
  opacity: 1;
}

.read-more {
  color: var(--primary-accent);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 700;
  transition: transform 0.3s;
}

.read-more:hover {
  transform: translateX(5px);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }
}
</style>
