import { reactive, computed } from 'vue';
import { t } from '../composables/useLanguage';

export const store = reactive({
  user: null, // Track authenticated user
  token: null, // Track access token
  cart: [],
  lastOrder: null,
  checkoutLoading: false,
  notification: {
    show: false,
    message: '',
    type: 'success' // 'success' or 'info'
  },

  get isAuthenticated() {
    return this.user !== null && this.token !== null;
  },

  login(userData, token = null) {
    this.user = userData;
    this.token = token;
    // Store in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('token', token);
    }
  },

  logout() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  initAuth() {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
        this.token = storedToken;
      } catch (e) {
        this.user = null;
        this.token = null;
      }
    }
  },

  get totalItems() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  },

  showNotification(message, type = 'success') {
    this.notification.message = message;
    this.notification.type = type;
    this.notification.show = true;
    setTimeout(() => {
      this.notification.show = false;
    }, 3000);
  },

  addToCart(product, quantity = 1, variantId = null) {
    const existingItem = this.cart.find(item => item.id === product.id && item.variant_id === variantId);
    if (existingItem) {
      existingItem.quantity += quantity;
      if (existingItem.quantity <= 0) {
        const removedTitle = existingItem.title; // Capture before removal
        this.removeFromCart(product.id, variantId);
        this.showNotification(t('productRemoved', { name: removedTitle }), 'info');
      } else {
        this.showNotification(t('productUpdated', { name: existingItem.title, qty: existingItem.quantity }), 'success');
      }
    } else if (quantity > 0) {
      this.cart.push({
        id: product.id,
        variant_id: variantId,
        variant_name: product.variant_name, // Store name here
        title: product.title,
        author: product.author,
        price: product.price,
        image: product.image,
        imageStyle: `background-image: url('${product.image}')`,
        originalPrice: product.originalPrice,
        quantity: quantity
      });
      this.showNotification(t('productAdded', { name: product.title, qty: quantity }), 'success');
    }
  },

  updateQuantity(productId, change, variantId = null) {
    const itemIndex = this.cart.findIndex(item => item.id === productId && item.variant_id === variantId);
    if (itemIndex > -1) {
      this.cart[itemIndex].quantity += change;
      if (this.cart[itemIndex].quantity <= 0) {
        const removedTitle = this.cart[itemIndex].title; // Capture before removal
        this.cart.splice(itemIndex, 1);
        this.showNotification(t('productRemoved', { name: removedTitle }), 'info');
      } else {
        if (change > 0) {
          this.showNotification(t('productAdded', { name: this.cart[itemIndex].title, qty: change }), 'success');
        } else {
          this.showNotification(t('productDecreased'), 'info');
        }
      }
    }
  },

  removeFromCart(productId, variantId = null) {
    const index = this.cart.findIndex(item => item.id === productId && item.variant_id === variantId);
    if (index > -1) {
      this.cart.splice(index, 1);
    }
  },

  clearCart() {
    this.cart.splice(0, this.cart.length);
    // Notification handled by component after success
  },

  setLastOrder(orderData) {
    this.lastOrder = orderData;
  }
});

store.initAuth(); // Initialize auth state on load
