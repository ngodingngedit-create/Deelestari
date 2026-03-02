<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../store';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
    loading.value = true;
    error.value = '';
    
    // Simulate API call to /api/login-auth
    // In a real app, you'd use fetch or axios:
    // const response = await fetch('/api/login-auth', { 
    //   method: 'POST', 
    //   body: JSON.stringify({ email: email.value, password: password.value }) 
    // });
    
    setTimeout(() => {
        if (email.value === 'deelest@gmail.com' && password.value === '12345678') {
            store.login({
                name: 'Dee Lestari',
                email: email.value,
                avatar: 'https://deelestari.com/wp-content/uploads/2021/01/ManuskripPing-asli_800.jpg'
            });
            router.push('/dashboard');
        } else {
            error.value = 'Email atau password salah. Silakan coba lagi.';
        }
        loading.value = false;
    }, 1000);
};
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left side: Identity -->
      <div class="login-brand">
        <div class="brand-content">
          <div class="logo-circle">DL</div>
          <h1 class="brand-name">Dee Lestari</h1>
          <p class="brand-tagline">Portal Manajemen Konten & Kreativitas</p>
        </div>
      </div>

      <!-- Right side: Login Form -->
      <div class="login-form-side">
        <div class="form-wrapper">
          <h2 class="form-title">Selamat Datang</h2>
          <p class="form-subtitle">Silakan masuk ke akun Anda untuk melanjutkan.</p>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="email">Username / Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="email" 
                placeholder="deelest@gmail.com" 
                required
              />
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                v-model="password" 
                placeholder="••••••••" 
                required
              />
            </div>

            <div v-if="error" class="error-message">
              {{ error }}
            </div>

            <button type="submit" class="btn-login" :disabled="loading">
              {{ loading ? 'Memproses...' : 'Masuk' }}
            </button>
          </form>

          <div class="form-footer">
            <router-link to="/" class="back-link">← Kembali ke Beranda</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  background: #111;
  color: #fff;
  font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
}

.login-container {
  display: flex;
  width: 100%;
}

/* Brand Side */
.login-brand {
  flex: 1;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.login-brand::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 30%, rgba(158, 77, 61, 0.08) 0%, transparent 60%);
  pointer-events: none;
}

.brand-content {
  text-align: center;
  z-index: 2;
  padding: 2rem;
}

.logo-circle {
  width: 70px;
  height: 70px;
  background: #1a1a1a;
  border: 1px solid var(--primary-accent, #9e4d3d);
  color: var(--primary-accent, #9e4d3d);
  font-family: var(--font-heading, 'Cormorant Garamond', serif);
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.brand-name {
  font-family: var(--font-heading, 'Cormorant Garamond', serif);
  font-size: 2.8rem;
  margin-bottom: 0.25rem;
  color: #fff;
  letter-spacing: -0.01em;
}

.brand-tagline {
  color: #666;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
}

/* Form Side */
.login-form-side {
  flex: 1;
  background: #161616;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.form-wrapper {
  width: 100%;
  max-width: 360px;
}

.form-title {
  font-family: var(--font-heading, 'Cormorant Garamond', serif);
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #fff;
  font-weight: 600;
}

.form-subtitle {
  color: #888;
  margin-bottom: 2.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.form-group label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.form-group input {
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  color: #fff;
  font-family: inherit;
}

.form-group input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--primary-accent, #9e4d3d);
  box-shadow: 0 4px 20px rgba(158, 77, 61, 0.1);
}

.error-message {
  color: #ff5252;
  font-size: 0.85rem;
  background: rgba(255, 82, 82, 0.1);
  padding: 10px 14px;
  border-radius: 8px;
  border-left: 3px solid #ff5252;
}

.btn-login {
  background: var(--primary-accent, #9e4d3d);
  color: #fff;
  border: none;
  padding: 16px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.btn-login:hover:not(:disabled) {
  background: #b85a47;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(158, 77, 61, 0.3);
}

.btn-login:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-footer {
  margin-top: 2.5rem;
  text-align: center;
}

.back-link {
  color: #555;
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.3s;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.back-link:hover {
  color: var(--primary-accent, #9e4d3d);
}

@media (max-width: 900px) {
  .login-container {
    flex-direction: column;
  }
  
  .login-brand {
    padding: 4rem 2rem;
    flex: none;
    border-right: none;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  
  .login-form-side {
    padding: 4rem 2rem;
    flex: none;
  }
}
</style>
