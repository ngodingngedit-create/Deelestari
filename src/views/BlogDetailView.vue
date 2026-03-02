<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { articles } from '../data/articles.js';

const route = useRoute();
const article = computed(() => {
  return articles.find(a => a.id === parseInt(route.params.id)) || null;
});
</script>

<template>
  <main class="blog-detail-page">
    <section class="section" v-if="article">
      <div class="container">
        <!-- Back Button -->
        <router-link to="/blog" class="back-link">
          &larr; Kembali ke Blog
        </router-link>

        <!-- Header Article -->
        <header class="article-header">
          <span class="category-tag">{{ article.category }}</span>
          <h1 class="article-title">{{ article.title }}</h1>
          
          <div class="article-meta">
            <div class="author-info">
              <div class="author-avatar"></div>
              <span class="author-name">Dee Lestari</span>
            </div>
            <span class="article-date">{{ article.date }}</span>
          </div>
        </header>

        <!-- Featured Image -->
        <div class="article-hero-image" :style="{ backgroundImage: `url(${article.image})` }">
        </div>

        <!-- Article Content -->
        <div class="article-content" v-html="article.content"></div>
      </div>
    </section>
    
    <section class="section" v-else>
      <div class="container">
        <h1 class="page-title text-center">Article Not Found</h1>
        <div class="text-center mt-4">
          <router-link to="/blog" class="btn-primary">Kembali ke Blog</router-link>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

.blog-detail-page { 
  background: #141414; 
  color: #e6e6e6; 
  min-height: 100vh;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.container { max-width: 800px; margin: 0 auto; padding: 0 2rem; }
.section { padding: 6rem 0 5rem; }

.text-center { text-align: center; }
.mt-4 { margin-top: 2rem; }

.back-link {
  display: inline-block;
  color: #9e4d3d;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 3rem;
  transition: all 0.2s;
}

.back-link:hover {
  color: #fff;
}

.article-header {
  margin-bottom: 3rem;
}

.category-tag { 
  color: #9e4d3d; 
  font-weight: 800; 
  text-transform: uppercase; 
  font-size: 0.85rem; 
  letter-spacing: 0.2em; 
  display: block; 
  margin-bottom: 1.5rem; 
}

.article-title { 
  font-family: 'Playfair Display', serif; 
  font-size: 3.5rem; 
  color: #fff; 
  margin-bottom: 2rem; 
  line-height: 1.2; 
}

.article-meta { 
  display: flex; 
  margin-bottom: 1.5rem; 
  align-items: center; 
  gap: 1.5rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #9e4d3d;
}

.author-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
}

.article-date { font-size: 0.95rem; color: #888; }

.article-hero-image {
  width: 100%;
  height: 450px;
  background-size: cover;
  background-position: center;
  border-radius: 24px;
  margin-bottom: 4rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

.article-content {
  font-size: 1.15rem;
  line-height: 1.8;
  color: #ccc;
}

/* We style v-html content safely */
:deep(.article-content p) {
  margin-bottom: 1.5rem;
}

:deep(.article-content a) {
  color: #9e4d3d;
  text-decoration: none;
}

:deep(.article-content a:hover) {
  text-decoration: underline;
}

:deep(.article-content h2), :deep(.article-content h3) {
  font-family: 'Playfair Display', serif;
  color: #fff;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
}

:deep(.article-content ol), :deep(.article-content ul) {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

:deep(.article-content li) {
  margin-bottom: 0.5rem;
}

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

@media (max-width: 768px) {
  .article-title { font-size: 2.5rem; }
  .article-hero-image { height: 300px; margin-bottom: 3rem; }
  .article-content { font-size: 1.05rem; }
  .section { padding: 4rem 0 3rem; }
}
</style>
