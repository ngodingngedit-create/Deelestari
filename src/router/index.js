import { createRouter, createWebHistory } from 'vue-router';
import BerandaView from '../views/BerandaView.vue';
import BukuView from '../views/BukuView.vue';
import BioView from '../views/BioView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'beranda',
            component: BerandaView
        },
        {
            path: '/buku',
            name: 'buku',
            component: BukuView
        },
        {
            path: '/checkout',
            name: 'checkout',
            component: () => import('../views/CheckoutView.vue')
        },
        {
            path: '/invoice',
            name: 'invoice',
            component: () => import('../views/InvoiceView.vue')
        },
        {
            path: '/merch-invoice/:invoiceId',
            name: 'merch-invoice',
            component: () => import('../views/InvoiceView.vue')
        },
        {
            path: '/kaizen-writing',
            name: 'kaizen',
            component: () => import('../views/KaizenView.vue')
        },
        {
            path: '/musik',
            name: 'musik',
            component: () => import('../views/MusikView.vue')
        },
        {
            path: '/blog',
            name: 'blog',
            component: () => import('../views/BlogView.vue')
        },
        {
            path: '/bio',
            name: 'bio',
            component: BioView
        },
        {
            path: '/index.html',
            redirect: '/'
        },
        {
            path: '/bio.html',
            redirect: '/bio'
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    }
});

export default router;
