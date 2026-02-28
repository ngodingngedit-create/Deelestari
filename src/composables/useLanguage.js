import { reactive, computed } from 'vue';

// --- Global reactive state ---
const state = reactive({
    lang: 'id', // 'id' | 'en'
});

// --- Translation dictionary ---
const translations = {
    id: {
        // Header
        cartTitle: 'Keranjang',
        cart: 'Keranjang',
        profile: 'Profil',
        menu: 'Menu',
        items: 'item',
        total: 'Total',
        checkout: 'Checkout',
        beranda: 'Beranda',
        buku: 'Buku',
        bio: 'Bio',


        // Bio Page
        bioHeroTitle: 'Tentang Dee Lestari',
        bioHeroDesc: 'Dewi Lestari, dikenal dengan nama pena Dee Lestari, adalah penulis, penyanyi, dan pencipta lagu terkemuka asal Indonesia. Sejak debut fenomenalnya melalui Supernova pada tahun 2001, ia telah menjadi salah satu tokoh kreatif paling berpengaruh di Indonesia.',
        musicLabel: 'Harmoni & Nada',
        musicTitle: 'Perjalanan Musik',
        musicText: 'Mengawali karier sebagai penyanyi latar Iwa K, Dee kemudian membentuk trio vokal legendaris Rida Sita Dewi (RSD) pada tahun 1995. Bersama RSD, ia merilis album hits seperti "Antara Kita" dan "Bertiga". Sebagai solois, ia merilis "Out of Shell" dan proyek hibrida "Rectoverso". Ia juga pencipta lagu di balik hits besar seperti "Firasat" dan "Kali Kedua".',
        writingLabel: 'Kata & Cerita',
        writingTitle: 'Karir Menulis',
        writingText: 'Debut literasi Dee dimulai dengan fenomena "Supernova: Ksatria, Puteri, dan Bintang Jatuh" pada tahun 2001. Serial Supernova yang diselesaikan dalam 15 tahun menjadi magnum opus-nya. Karya bestseller lainnya seperti "Perahu Kertas", "Filosofi Kopi", "Aroma Karsa", dan seri "Rapijali" terus memikat pembaca dengan riset mendalam dan narasi filosofis.',
        filmLabel: 'Layar Lebar',
        filmTitle: 'Dunia Perfilman',
        filmText: 'Banyak karya Dee yang telah bertransformasi menjadi film sukses, termasuk "Perahu Kertas", "Filosofi Kopi", "Madre", dan "Rectoverso". Dee sering terlibat langsung dalam penulisan skenario, memastikan nyawa dari cerita aslinya tetap terjaga dalam adaptasi visualnya.',
        awardsTitle: 'Penghargaan & Pencapaian',
        favoriteAuthor: 'Penulis Fiksi Terfavorit',
        bestScriptwriter: 'Penulis Skenario Terbaik',
        bestFiction: 'Karya Fiksi Terbaik',

        // HeroSection
        searchPlaceholder: 'Cari tulisan, buku, atau pemikiran…',
        kategori: 'Kategori',
        koleksi: 'Koleksi',
        tahun: 'Tahun',
        format: 'Format',
        fiksi: 'Fiksi',
        nonFiksi: 'Non-Fiksi',
        puisi: 'Puisi',
        musik: 'Musik',
        esaiJurnal: 'Esai & Jurnal',
        rekomendasi: 'Rekomendasi',
        supernova: 'Supernova Series',
        rapijali: 'Rapijali Series',
        hardCover: 'Hard Cover',
        softCover: 'Soft Cover',
        eBook: 'E-Book',
        audioBook: 'Audio Book',
        bundle: 'Bundle',

        // CategoryFilter chips
        categoryAll: 'Semua',
        noResults: 'Tidak ada produk yang ditemukan.',

        addToCart: 'Tambah',
        btnAddToCart: 'Tambah ke Keranjang',
        buyNow: 'Beli Sekarang',
        close: 'Tutup',
        quantity: 'Jumlah',
        stock: 'Stok',
        description: 'Deskripsi',
        save: 'Hemat',
        addToFavorite: 'Tambah ke Favorit',
        share: 'Bagikan',
        outOfStock: 'Habis',

        // Checkout
        checkoutTitle: 'Checkout',
        dataPemesan: 'Data Pemesan',
        orderDetails: 'Order Details',
        namaLengkap: 'Nama Lengkap',
        namaPlaceholder: 'Masukkan nama lengkap',
        email: 'Email',
        emailPlaceholder: 'contoh@email.com',
        phone: 'Nomor Telepon',
        phonePlaceholder: '08123456789',
        storePengambilan: 'Store Pengambilan',
        storePlaceholder: 'Pilih lokasi pengambilan',
        alamat: 'Alamat Pengiriman',
        alamatPlaceholder: 'Alamat lengkap, patokan, dll',
        pilihKurir: 'Pilih Kurir',
        tipeKurir: 'Tipe Kurir',
        kurirPlaceholder: 'Pilih kurir...',
        tipePlaceholder: 'Pilih tipe...',
        emptyCart: 'Keranjang kosong.',
        itemVariant: 'Variant: Standard',
        itemNotePlaceholder: 'Tulis catatan untuk barang ini...',
        voucher: 'Punya Voucher?',
        voucherPlaceholder: 'Masukkan kode voucher',
        gunakan: 'Gunakan',
        metodePembayaran: 'Metode Pembayaran',
        ringkasan: 'Ringkasan Belanja',
        totalHarga: 'Total Harga',
        totalOngkir: 'Total Ongkos Kirim',
        totalDiskon: 'Total Diskon',
        totalBelanja: 'Total Belanja',
        barang: 'Barang',

        // Invoice
        invoiceSuccess: 'Pembayaran Berhasil!',
        invoiceSubtitle: 'Terima kasih atas pesanan Anda.',
        noPesanan: 'No. Pesanan',
        waktuPesan: 'Waktu Pemesanan',
        metodeBayar: 'Metode Pembayaran',
        rincianBarang: 'Rincian Barang',
        infoKirim: 'Informasi Pengiriman',
        ambilToko: 'Ambil di Toko:',
        qty: 'Qty',
        catatan: 'Catatan',
        totalBayar: 'Total Bayar',
        kembali: 'Kembali ke Beranda',

        // Footer
        copyright: '© 2024 Dee Lestari. Hak cipta dilindungi.',

        // Floating Cart Bar
        productDetails: 'DETAIL PRODUK',
        buyNow: 'Beli Sekarang',
        payNow: 'Bayar Sekarang',
        itemsCount: 'Barang',
        detail: 'Detail',

        // Notifications (new or updated)
        productAdded: '{name} ({qty} item) ditambahkan ke keranjang',
        productUpdated: 'Jumlah {name} diperbarui menjadi {qty}',
        productRemoved: '{name} dihapus dari keranjang',
    },

    en: {
        // Header
        cartTitle: 'Cart',
        cart: 'Cart',
        profile: 'Profile',
        menu: 'Menu',
        items: 'items',
        total: 'Total',
        checkout: 'Checkout',
        beranda: 'Home',
        buku: 'Books',
        bio: 'Bio',


        // Bio Page
        bioHeroTitle: 'About Dee Lestari',
        bioHeroDesc: 'Dewi Lestari, known by her pen name Dee Lestari, is a prominent Indonesian author, singer, and songwriter. Since her phenomenal debut with Supernova in 2001, she has become one of Indonesia\'s most influential creative figures.',
        musicLabel: 'Harmony & Notes',
        musicTitle: 'Music Journey',
        musicText: 'Starting as a backing singer for Iwa K, Dee formed the legendary vocal trio Rida Sita Dewi (RSD) in 1995. With RSD, she released hit albums like "Antara Kita" and "Bertiga". As a soloist, she released "Out of Shell" and the hybrid project "Rectoverso". She is also the songwriter behind major hits like "Firasat" and "Kali Kedua".',
        writingLabel: 'Words & Stories',
        writingTitle: 'Writing Career',
        writingText: 'Dee\'s literary debut began with the phenomenon "Supernova: Ksatria, Puteri, dan Bintang Jatuh" in 2001. The Supernova series, completed over 15 years, became her magnum opus. Other bestsellers like "Perahu Kertas", "Filosofi Kopi", "Aroma Karsa", and the "Rapijali" series continue to captivate readers with deep research and philosophical narratives.',
        filmLabel: 'The Big Screen',
        filmTitle: 'Movie World',
        filmText: 'Many of Dee\'s works have been transformed into successful films, including "Perahu Kertas", "Filosofi Kopi", "Madre", and "Rectoverso". Dee is often directly involved in scriptwriting, ensuring the soul of the original story remains intact in its visual adaptation.',
        awardsTitle: 'Awards & Achievements',
        favoriteAuthor: 'Most Favorite Fiction Writer',
        bestScriptwriter: 'Best Scriptwriter',
        bestFiction: 'Best Fiction Work',

        // HeroSection
        searchPlaceholder: 'Search writings, books, or ideas…',
        kategori: 'Category',
        koleksi: 'Collection',
        tahun: 'Year',
        format: 'Format',
        fiksi: 'Fiction',
        nonFiksi: 'Non-Fiction',
        puisi: 'Poetry',
        musik: 'Music',
        esaiJurnal: 'Essays & Journals',
        rekomendasi: 'Recommendations',
        supernova: 'Supernova Series',
        rapijali: 'Rapijali Series',
        hardCover: 'Hard Cover',
        softCover: 'Soft Cover',
        eBook: 'E-Book',
        audioBook: 'Audio Book',
        bundle: 'Bundle',

        // CategoryFilter chips
        categoryAll: 'All',
        noResults: 'No products found.',

        addToCart: 'Add',
        btnAddToCart: 'Add to Cart',
        buyNow: 'Buy Now',
        close: 'Close',
        quantity: 'Quantity',
        stock: 'Stock',
        description: 'Description',
        save: 'Save',
        addToFavorite: 'Add to Favorite',
        share: 'Share',
        outOfStock: 'Out of Stock',

        // Checkout
        checkoutTitle: 'Checkout',
        dataPemesan: 'Customer Details',
        orderDetails: 'Order Details',
        namaLengkap: 'Full Name',
        namaPlaceholder: 'Enter your full name',
        email: 'Email',
        emailPlaceholder: 'example@email.com',
        phone: 'Phone Number',
        phonePlaceholder: '08123456789',
        storePengambilan: 'Pickup Store',
        storePlaceholder: 'Select pickup location',
        alamat: 'Shipping Address',
        alamatPlaceholder: 'Full address, landmarks, etc.',
        pilihKurir: 'Select Courier',
        tipeKurir: 'Courier Type',
        kurirPlaceholder: 'Select courier...',
        tipePlaceholder: 'Select type...',
        emptyCart: 'Your cart is empty.',
        itemVariant: 'Variant: Standard',
        itemNotePlaceholder: 'Write a note for this item...',
        voucher: 'Have a Voucher?',
        voucherPlaceholder: 'Enter voucher code',
        gunakan: 'Apply',
        metodePembayaran: 'Payment Method',
        ringkasan: 'Order Summary',
        totalHarga: 'Total Price',
        totalOngkir: 'Shipping Cost',
        totalDiskon: 'Total Discount',
        totalBelanja: 'Grand Total',
        barang: 'Item(s)',

        // Invoice
        invoiceSuccess: 'Payment Successful!',
        invoiceSubtitle: 'Thank you for your order.',
        noPesanan: 'Order No.',
        waktuPesan: 'Order Time',
        metodeBayar: 'Payment Method',
        rincianBarang: 'Order Items',
        infoKirim: 'Shipping Information',
        ambilToko: 'Pickup at Store:',
        qty: 'Qty',
        catatan: 'Note',
        totalBayar: 'Total Payment',
        kembali: 'Back to Home',

        // Footer
        copyright: '© 2024 Dee Lestari. All rights reserved.',

        // Notification
        productAdded: '{name} ({qty} item) added to cart',
        productUpdated: '{name} quantity updated to {qty}',
        productRemoved: '{name} removed from cart',
        productDecreased: 'Product quantity decreased',
        cartEmpty: 'Your cart is empty',

        // Floating Cart Bar
        productDetails: 'PRODUCT DETAILS',
        buyNow: 'Buy Now',
        payNow: 'Pay Now',
        itemsCount: 'Items',
        detail: 'Detail',
    },
};

// --- Standalone helpers for non-component files ---
export const i18nState = state;
export const t = (key, params = {}) => {
    let translation = translations[state.lang]?.[key] ?? translations['id'][key] ?? key;

    // Replace parameters if any
    Object.keys(params).forEach(paramKey => {
        translation = translation.replace(`{${paramKey}}`, params[paramKey]);
    });

    return translation;
};

// --- Composable ---
export function useLanguage() {
    const currentLang = computed(() => state.lang);

    const setLang = (lang) => {
        if (lang === 'id' || lang === 'en') {
            state.lang = lang;
        }
    };

    const toggleLang = () => {
        state.lang = state.lang === 'id' ? 'en' : 'id';
    };

    return { currentLang, t, setLang, toggleLang };
}
