<script setup>
const articles = [
  { id: 1, title: 'Dasar Penulisan Fiksi: Membangun Dunia', date: '12 Feb 2024', category: 'Dasar Penulisan', excerpt: 'Bagaimana menciptakan latar belakang yang terasa nyata dan mendalam bagi pembaca...', color: '#2a1a1a' },
  { id: 2, title: 'Seni Swasunting bagi Penulis Pemula', date: '05 Jan 2024', category: 'Teknik', excerpt: 'Menulis adalah menggali, menyunting adalah memahat. Pelajari cara mengasah naskah Anda...', color: '#1a1d2a' },
  { id: 3, title: 'Menemukan Suara Unik dalam Tulisan', date: '20 Des 2023', category: 'Refleksi', excerpt: 'Bukan tentang meniru, tapi tentang menggali kejujuran dalam setiap kata yang Anda pilih...', color: '#1a2a1a' },
  { id: 4, title: 'Riset: Pondasi Tersembunyi Sebuah Karya', date: '10 Nov 2023', category: 'Dasar Penulisan', excerpt: 'Dibalik Aroma Karsa ada riset panjang. Simak pentingnya data dalam fiksi...', color: '#2a2a1a' },
];
</script>

<template>
  <main class="blog-page">
    <section class="section">
      <div class="container">
        <h1 class="page-title">Blog & Pemikiran</h1>
        <p class="page-subtitle">Berbagi wawasan seputar dunia kepenulisan, musik, dan perjalanan kreatif.</p>

        <div class="featured-post">
          <div class="featured-content">
            <span class="category">Sorotan</span>
            <h2 class="featured-title">10 Artikel Dasar Penulisan Fiksi yang Wajib Anda Baca</h2>
            <p class="featured-desc">Kumpulan panduan komprehensif untuk memulai perjalanan Anda di dunia literasi, dari ide hingga publikasi.</p>
            <button class="btn-primary">Mulai Baca</button>
          </div>
        </div>

        <div class="article-grid">
          <div v-for="post in articles" :key="post.id" class="article-card">
            <div class="card-bg" :style="{ background: post.color }"></div>
            <div class="card-body">
              <div class="card-meta">
                <span class="card-category">{{ post.category }}</span>
                <span class="card-date">{{ post.date }}</span>
              </div>
              <h3 class="card-title">{{ post.title }}</h3>
              <p class="card-excerpt">{{ post.excerpt }}</p>
              <a href="#" class="read-more">Baca Selengkapnya →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.blog-page { background: #111; color: #e6e6e6; min-height: 100vh; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
.section { padding: 8rem 0 5rem; }

.page-title { font-family: var(--font-heading, serif); font-size: 3.5rem; color: #fff; margin-bottom: 1rem; }
.page-subtitle { color: #888; font-size: 1.1rem; margin-bottom: 4rem; }

.featured-post {
  background: linear-gradient(135deg, #2d1e1e 0%, #1a1a1a 100%);
  border: 1px solid rgba(158, 77, 61, 0.2);
  border-radius: 20px;
  padding: 4rem;
  margin-bottom: 4rem;
  display: flex;
  align-items: center;
}

.featured-content { max-width: 600px; }
.category { color: #9e4d3d; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.15em; display: block; margin-bottom: 1rem; }
.featured-title { font-family: var(--font-heading, serif); font-size: 2.5rem; color: #fff; margin-bottom: 1.5rem; line-height: 1.2; }
.featured-desc { color: #aaa; margin-bottom: 2rem; line-height: 1.6; }

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.article-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
}

.article-card:hover { transform: translateY(-5px); border-color: rgba(158,77,61,0.4); }

.card-bg { height: 8px; width: 100%; }
.card-body { padding: 2rem; flex: 1; display: flex; flex-direction: column; }
.card-meta { display: flex; justify-content: space-between; margin-bottom: 1rem; align-items: center; }
.card-category { font-size: 0.7rem; font-weight: 700; color: #9e4d3d; text-transform: uppercase; }
.card-date { font-size: 0.75rem; color: #666; }
.card-title { font-size: 1.25rem; color: #fff; margin-bottom: 1rem; line-height: 1.4; }
.card-excerpt { font-size: 0.9rem; color: #888; margin-bottom: 1.5rem; line-height: 1.6; flex: 1; }
.read-more { font-size: 0.85rem; color: #9e4d3d; text-decoration: none; font-weight: 600; transition: letter-spacing 0.2s; }
.article-card:hover .read-more { letter-spacing: 0.5px; }

.btn-primary {
  background: #9e4d3d;
  color: #fff;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover { background: #b85a47; transform: scale(1.05); }

@media (max-width: 768px) {
  .featured-post { padding: 2rem; }
  .featured-title { font-size: 1.8rem; }
}
</style>
