<script setup>
import { ref, onMounted } from 'vue';
import { articles as initialArticles } from '../data/articles.js';

const articles = ref([...initialArticles]);
const isModalOpen = ref(false);
const isEditing = ref(false);
const currentPost = ref({
  id: null,
  title: '',
  date: '',
  category: '',
  excerpt: '',
  image: '',
  content: ''
});

const openCreateModal = () => {
  isEditing.value = false;
  currentPost.value = {
    id: Date.now(),
    title: '',
    date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    category: 'Blog',
    excerpt: '',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1000',
    content: ''
  };
  isModalOpen.value = true;
};

const openEditModal = (post) => {
  isEditing.value = true;
  currentPost.value = { ...post };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const savePost = () => {
  if (isEditing.value) {
    const index = articles.value.findIndex(p => p.id === currentPost.value.id);
    if (index !== -1) {
      articles.value[index] = { ...currentPost.value };
    }
  } else {
    articles.value.unshift({ ...currentPost.value });
  }
  closeModal();
};

const deletePost = (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
    articles.value = articles.value.filter(p => p.id !== id);
  }
};
</script>

<template>
  <main class="dashboard-content">
    <div class="container">
      <header class="dashboard-header">
        <div class="header-titles">
          <h1 class="page-title">Blog Dashboard</h1>
          <p class="page-subtitle">Kelola semua artikel dan publikasi Anda di sini.</p>
        </div>
        <button class="btn-create" @click="openCreateModal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Tambah Blog Baru
        </button>
      </header>

      <div class="article-grid">
        <div v-for="post in articles" :key="post.id" class="article-card">
          <div class="card-image" :style="{ backgroundImage: `url(${post.image})` }">
             <span class="category-overlay">{{ post.category }}</span>
          </div>
          <div class="card-body">
            <div class="card-meta">
              <span class="card-date">{{ post.date }}</span>
            </div>
            <h3 class="card-title">{{ post.title }}</h3>
            <p class="card-excerpt">{{ post.excerpt }}</p>
            
            <div class="card-footer">
              <div class="admin-actions">
                <button class="btn-icon edit" @click="openEditModal(post)" title="Edit">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button class="btn-icon delete" @click="deletePost(post.id)" title="Hapus">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
              <router-link :to="`/blog/${post.id}`" class="read-more">Lihat →</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <transition name="fade">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card">
          <div class="modal-header">
            <h3>{{ isEditing ? 'Edit Artikel' : 'Tambah Artikel Baru' }}</h3>
            <button class="close-btn" @click="closeModal">×</button>
          </div>
          <form @submit.prevent="savePost" class="modal-form">
            <div class="form-row">
              <div class="form-group">
                <label>Judul Artikel</label>
                <input v-model="currentPost.title" type="text" required placeholder="Masukkan judul...">
              </div>
              <div class="form-group">
                <label>Kategori</label>
                <select v-model="currentPost.category">
                  <option>Blog</option>
                  <option>Personal</option>
                  <option>Events</option>
                  <option>Book Review</option>
                  <option>Rapijali</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label>Link Gambar Cover</label>
              <input v-model="currentPost.image" type="text" required placeholder="https://...">
            </div>

            <div class="form-group">
              <label>Ringkasan (Excerpt)</label>
              <textarea v-model="currentPost.excerpt" rows="2" placeholder="Tulis ringkasan singkat..."></textarea>
            </div>

            <div class="form-group">
              <label>Konten Lengkap (HTML)</label>
              <textarea v-model="currentPost.content" rows="6" placeholder="Tulis konten artikel di sini..."></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-secondary" @click="closeModal">Batal</button>
              <button type="submit" class="btn-primary">{{ isEditing ? 'Simpan Perubahan' : 'Publikasikan' }}</button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </main>
</template>

<style scoped>
.dashboard-content {
  padding: 4rem 2rem;
  background: #141414;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 4rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  color: #fff;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #888;
  font-size: 1.1rem;
}

.btn-create {
  background: #9e4d3d;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-create:hover {
  background: #b85a47;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(158, 77, 61, 0.2);
}

/* Article Grid (Same as Blog) */
.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2.5rem;
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
  transform: translateY(-8px);
  border-color: rgba(158,77,61,0.3);
}

.card-image {
  height: 220px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.category-overlay {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(158, 77, 61, 0.9);
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.card-body {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-date {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 1rem;
  display: block;
}

.card-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  color: #fff;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.card-excerpt {
  font-size: 0.9rem;
  color: #999;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.admin-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,255,255,0.1);
  background: transparent;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon.edit:hover {
  background: rgba(158, 77, 61, 0.1);
  color: #9e4d3d;
  border-color: #9e4d3d;
}

.btn-icon.delete:hover {
  background: rgba(211, 47, 47, 0.1);
  color: #d32f2f;
  border-color: #d32f2f;
}

.read-more {
  font-size: 0.85rem;
  color: #9e4d3d;
  text-decoration: none;
  font-weight: 700;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 2rem;
}

.modal-card {
  background: #1e1e1e;
  width: 100%;
  max-width: 800px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.1);
}

.modal-header {
  padding: 1.5rem 2rem;
  background: rgba(255,255,255,0.02);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.modal-header h3 {
  margin: 0;
  color: #fff;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 2rem;
  cursor: pointer;
}

.modal-form {
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group input, 
.form-group select, 
.form-group textarea {
  background: #0f0f0f;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 12px;
  color: #fff;
  font-family: inherit;
}

.form-group input:focus, 
.form-group select:focus, 
.form-group textarea:focus {
  outline: none;
  border-color: #9e4d3d;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-secondary {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
}

.btn-primary {
  background: #9e4d3d;
  border: none;
  color: #fff;
  padding: 12px 32px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
