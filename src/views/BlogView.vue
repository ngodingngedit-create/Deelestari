<script setup>
import { articles } from '../data/articles.js';

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
            <router-link :to="`/blog/${featuredPost.id}`" class="btn-primary">Baca Selengkapnya</router-link>
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
              <router-link :to="`/blog/${post.id}`" class="read-more">Baca Selengkapnya →</router-link>
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
