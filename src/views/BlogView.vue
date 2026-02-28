<script setup>
const articles = [
  { 
    id: 1, 
    title: 'Menjelaskan Air Mata', 
    date: '28 Mar 2023', 
    category: 'Personal', 
    excerpt: 'Ketika sebuah lelucon perlu dijelaskan, konon itu akan mematikan kelucuannya. Barangkali begitu juga dengan air mata.',
    image: 'https://deelestari.com/wp-content/uploads/2023/03/Dee-SriMulyani-1080x675.jpg',
    url: 'https://deelestari.com/id/2023/03/28/menjelaskan-air-mata/'
  },
  { 
    id: 2, 
    title: 'Kelas Kaizen Writing x Kuncie – Batch 7', 
    date: '11 Jul 2022', 
    category: 'Events', 
    excerpt: 'Kamu suka menulis? Tertarik menekuni seni menulis dengan lebih serius?',
    image: 'https://deelestari.com/wp-content/uploads/2022/07/HomeBG_KaizenKuncie-1090x660px-1F.png',
    url: 'https://deelestari.com/id/2022/07/11/kelas-kaizen-writing-x-kuncie-batch-7/'
  },
  { 
    id: 3, 
    title: 'Kelas Kuncie: Dasar Menulis Fiksi', 
    date: '25 Jun 2022', 
    category: 'Events', 
    excerpt: 'Menulis merupakan jembatan terkaya untuk menghidupkan imajinasi. Sama halnya seperti ilmu dan seni.',
    image: 'https://deelestari.com/wp-content/uploads/2022/06/HomeBG_Kuncie-1A.png',
    url: 'https://deelestari.com/id/2022/06/25/kelas-kuncie-dasar-menulis-fiksi/'
  },
  { 
    id: 4, 
    title: 'Save the Cat! Writes a Novel – Sebuah Apresiasi', 
    date: '30 Nov 2021', 
    category: 'Book Review', 
    excerpt: 'Jika harus memilih satu buku tentang seni bercerita yang sangat berpengaruh dan berguna bagi saya hingga detik ini, tanpa ragu saya akan menyebutkan buku Save The Cat! dari Blake Snyder.',
    image: 'https://deelestari.com/wp-content/uploads/2021/11/SaveTheCat-3B.jpg',
    url: 'https://deelestari.com/id/2021/11/30/save-the-cat-writes-a-novel-sebuah-apresiasi/'
  },
  { 
    id: 5, 
    title: 'RAPIJALI: Mengapa Serial?', 
    date: '04 Mar 2021', 
    category: 'Rapijali', 
    excerpt: 'Penulisan Rapijali membawa saya ke banyak persimpangan kreatif. Antara setia pada setting tahun ’90-an atau membawanya ke masa kini, antara jadi Tim Oding atau Tim Rakai, dan masih banyak “antara” lainnya.',
    image: 'https://deelestari.com/wp-content/uploads/2021/03/RPJL-WebBann_1.5A.jpg',
    url: 'https://deelestari.com/id/2021/03/04/rapijali-mengapa-serial/'
  },
  { 
    id: 6, 
    title: 'RAPIJALI', 
    date: '08 Jan 2021', 
    category: 'Rapijali', 
    excerpt: 'Sejauh yang saya ingat, musik dan menulis merupakan bagian tak terpisahkan dari hidup saya. Bahkan, jauh sebelum saya dikenal sebagai seorang penulis, bermusik lebih dahulu menjadi karier saya sejak usia remaja.',
    image: 'https://deelestari.com/wp-content/uploads/2021/01/ManuskripPing-asli_800.jpg',
    url: 'https://deelestari.com/id/2021/01/08/rapijali/'
  },
  { 
    id: 7, 
    title: 'Di Setapak Bersama Arswendo', 
    date: '22 Jul 2019', 
    category: 'Personal', 
    excerpt: 'Beberapa minggu sebelum Supernova 1 hendak dicetak, seorang teman, Ewink, menawarkan bantuan menjadi narahubung ke Arswendo Atmowiloto. Kami bermaksud meminta kesediaan beliau untuk memberikan satu paragraf blurb di kaver Supernova.',
    image: 'https://deelestari.com/wp-content/uploads/2019/07/Setapak-thumb.jpg',
    url: 'https://deelestari.com/id/2019/07/22/di-setapak-bersama-arswendo/'
  }
];

const featuredPost = articles[0];
</script>

<template>
  <main class="blog-page">
    <section class="section">
      <div class="container">
        <header class="blog-header">
          <h1 class="page-title">Blog & Pemikiran</h1>
          <p class="page-subtitle">Berbagi wawasan seputar dunia kepenulisan, musik, dan perjalanan kreatif.</p>
        </header>

        <!-- Featured Post -->
        <div class="featured-post" :style="{ backgroundImage: `linear-gradient(to right, rgba(20,20,20,0.95) 40%, rgba(20,20,20,0) 100%), url(${featuredPost.image})` }">
          <div class="featured-content">
            <span class="category-tag">Terbaru</span>
            <h2 class="featured-title">{{ featuredPost.title }}</h2>
            <p class="featured-desc">{{ featuredPost.excerpt }}</p>
            <a :href="featuredPost.url" target="_blank" class="btn-primary">Baca Selengkapnya</a>
          </div>
        </div>

        <div class="article-grid">
          <div v-for="post in articles.slice(1)" :key="post.id" class="article-card">
            <div class="card-image" :style="{ backgroundImage: `url(${post.image})` }">
               <span class="category-overlay">{{ post.category }}</span>
            </div>
            <div class="card-body">
              <div class="card-meta">
                <div class="author-info">
                   <div class="author-avatar"></div>
                   <span class="author-name">Dee Lestari</span>
                </div>
                <span class="card-date">{{ post.date }}</span>
              </div>
              <h3 class="card-title">{{ post.title }}</h3>
              <p class="card-excerpt">{{ post.excerpt }}</p>
              <a :href="post.url" target="_blank" class="read-more">Baca Selengkapnya →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

.blog-page { 
  background: #141414; 
  color: #e6e6e6; 
  min-height: 100vh;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
.section { padding: 6rem 0 5rem; }

.blog-header {
  text-align: center;
  margin-bottom: 4rem;
}

.page-title { 
  font-family: 'Playfair Display', serif; 
  font-size: 3.5rem; 
  color: #fff; 
  margin-bottom: 1rem; 
}

.page-subtitle { 
  color: #888; 
  font-size: 1.1rem; 
  max-width: 600px;
  margin: 0 auto;
}

/* Featured Post */
.featured-post {
  position: relative;
  background-size: cover;
  background-position: center;
  border-radius: 24px;
  padding: 5rem 4rem;
  margin-bottom: 5rem;
  min-height: 450px;
  display: flex;
  align-items: center;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

.featured-content { 
  max-width: 550px; 
  position: relative;
  z-index: 2;
}

.category-tag { 
  color: #9e4d3d; 
  font-weight: 800; 
  text-transform: uppercase; 
  font-size: 0.75rem; 
  letter-spacing: 0.2em; 
  display: block; 
  margin-bottom: 1.5rem; 
}

.featured-title { 
  font-family: 'Playfair Display', serif; 
  font-size: 3rem; 
  color: #fff; 
  margin-bottom: 1.5rem; 
  line-height: 1.1; 
}

.featured-desc { 
  color: #bbb; 
  margin-bottom: 2.5rem; 
  line-height: 1.7;
  font-size: 1.1rem;
}

/* Article Grid */
.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 3rem;
}

.article-card {
  background: #1e1e1e;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.article-card:hover { 
  transform: translateY(-10px); 
  border-color: rgba(158,77,61,0.3);
  box-shadow: 0 15px 30px rgba(0,0,0,0.3);
}

.card-image { 
  height: 240px; 
  width: 100%; 
  background-size: cover;
  background-position: center;
  position: relative;
}

.category-overlay {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  background: rgba(158, 77, 61, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.card-body { padding: 2rem; flex: 1; display: flex; flex-direction: column; }

.card-meta { 
  display: flex; 
  justify-content: space-between; 
  margin-bottom: 1.5rem; 
  align-items: center; 
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #9e4d3d;
}

.author-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #9e4d3d;
}

.card-date { font-size: 0.8rem; color: #666; }

.card-title { 
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem; 
  color: #fff; 
  margin-bottom: 1.25rem; 
  line-height: 1.3; 
}

.card-excerpt { 
  font-size: 0.95rem; 
  color: #999; 
  margin-bottom: 2rem; 
  line-height: 1.6; 
  flex: 1; 
}

.read-more { 
  font-size: 0.9rem; 
  color: #9e4d3d; 
  text-decoration: none; 
  font-weight: 700; 
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
}

.read-more:hover { color: #fff; }

.btn-primary {
  display: inline-block;
  background: #9e4d3d;
  color: #fff;
  text-decoration: none;
  padding: 14px 35px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.btn-primary:hover { 
  background: #b85a47; 
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(158,77,61,0.3);
}

@media (max-width: 1024px) {
  .featured-title { font-size: 2.5rem; }
}

@media (max-width: 768px) {
  .page-title { font-size: 2.5rem; }
  .featured-post { padding: 3rem 2rem; min-height: auto; }
  .featured-title { font-size: 2rem; }
  .article-grid { grid-template-columns: 1fr; }
}
</style>
