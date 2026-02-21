import { reactive, computed } from 'vue';
import { t } from '../composables/useLanguage';

export const store = reactive({
  cart: [],
  lastOrder: null, // Stores the details of the most recent order for the invoice page,
  notification: {
    show: false,
    message: '',
    type: 'success' // 'success' or 'info'
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

  addToCart(product, quantity = 1) {
    const existingItem = this.cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
      if (existingItem.quantity <= 0) {
        this.removeFromCart(product.id);
        this.showNotification(t('productRemoved'), 'info');
      } else {
        this.showNotification(t('productUpdated'), 'success');
      }
    } else if (quantity > 0) {
      this.cart.push({
        id: product.id,
        title: product.title,
        author: product.author,
        price: product.price,
        image: product.image,
        imageStyle: `background-image: url('${product.image}')`,
        originalPrice: product.originalPrice,
        quantity: quantity
      });
      this.showNotification(t('productAdded'), 'success');
    }
  },

  updateQuantity(productId, change) {
    const itemIndex = this.cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
      this.cart[itemIndex].quantity += change;
      if (this.cart[itemIndex].quantity <= 0) {
        this.cart.splice(itemIndex, 1);
        this.showNotification(t('productRemoved'), 'info');
      } else {
        if (change > 0) {
          this.showNotification(t('productAdded'), 'success');
        } else {
          this.showNotification(t('productDecreased'), 'info');
        }
      }
    }
  },

  removeFromCart(productId) {
    const index = this.cart.findIndex(item => item.id === productId);
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
