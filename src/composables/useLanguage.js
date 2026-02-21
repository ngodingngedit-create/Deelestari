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

        // Bio Page
        bioHeroTitle: 'Tentang Dee Lestari',
        bioHeroDesc: 'Penulis, Pemusik, dan Pencipta Lagu yang telah berkarya lebih dari dua dekade, menyentuh hati jutaan pembaca dan pendengar melalui kata dan nada.',
        musicLabel: 'Harmoni & Nada',
        musicTitle: 'Perjalanan Musik',
        musicText: 'Mengawali karier di dunia hiburan sebagai anggota trio vokal Rida Sita Dewi (RSD) pada tahun 1990-an, Dee Lestari menorehkan jejak emas dalam industri musik Indonesia. Bersama RSD, ia merilis album-album hits seperti "Antara Kita" (1995) dan "Bertiga" (1997). Tidak hanya bernyanyi, Dee juga dikenal sebagai pencipta lagu yang handal. Lagu-lagu ciptaannya, seperti "Firasat" dan "Malaikat Juga Tahu", menjadi anthem abadi yang terus dinyanyikan lintas generasi.',
        writingLabel: 'Kata & Cerita',
        writingTitle: 'Karir Menulis',
        writingText: 'Debut literasi Dee dimulai dengan ledakan fenomenal "Supernova: Ksatria, Puteri, dan Bintang Jatuh" pada tahun 2001, yang mengubah lanskap sastra populer Indonesia. Serial Supernova menjadi magnum opus yang diselesaikan dalam kurun waktu 15 tahun. Karya-karyanya yang lain, seperti "Perahu Kertas", "Filosofi Kopi", "Madre", hingga "Aroma Karsa" and "Rapijali", selalu berhasil memikat pembaca dengan riset mendalam, karakter kuat, dan narasi yang filosofis namun tetap renyah dinikmati.',
        filmLabel: 'Layar Lebar',
        filmTitle: 'Dunia Perfileman',
        filmText: 'Kekuatan cerita Dee Lestari kerap kali melampaui halaman buku. Banyak karyanya yang telah diadaptasi ke layar lebar dan meraih kesuksesan komersial maupun kritik. "Perahu Kertas", "Filosofi Kopi", "Rectoverso", and "Supernova" adalah beberapa judul yang sukses dialihwahanakan. Dee juga terlibat aktif dalam penulisan skenario dan adaptasi, memastikan nyawa dari cerita aslinya tetap terjaga saat bertransformasi menjadi gambar bergerak.',
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

        // Bio Page
        bioHeroTitle: 'About Dee Lestari',
        bioHeroDesc: 'Author, Musician, and Songwriter whose work spans over two decades, touching the hearts of millions of readers and listeners through words and melodies.',
        musicLabel: 'Harmony & Notes',
        musicTitle: 'Music Journey',
        musicText: 'Starting her career in the entertainment world as a member of the vocal trio Rida Sita Dewi (RSD) in the 1990s, Dee Lestari made a gold mark in the Indonesian music industry. Together with RSD, she released hit albums like "Antara Kita" (1995) and "Bertiga" (1997). Not just a singer, Dee is also known as a talented songwriter. Her songs, such as "Firasat" and "Malaikat Juga Tahu", have become timeless anthems that continue to be sung across generations.',
        writingLabel: 'Words & Stories',
        writingTitle: 'Writing Career',
        writingText: 'Dee\'s literary debut began with the phenomenal explosion of "Supernova: Ksatria, Puteri, dan Bintang Jatuh" in 2001, which changed the landscape of Indonesian popular literature. The Supernova series became a magnum opus completed over 15 years. Her other works, such as "Perahu Kertas", "Filosofi Kopi", "Madre", to "Aroma Karsa" and "Rapijali", always manage to captivate readers with deep research, strong characters, and philosophical yet enjoyable narratives.',
        filmLabel: 'The Big Screen',
        filmTitle: 'Movie World',
        filmText: 'The power of Dee Lestari\'s stories often transcends the book page. Many of her works have been adapted to the big screen and achieved both commercial and critical success. "Perahu Kertas", "Filosofi Kopi", "Rectoverso", and "Supernova" are some of the titles that have been successfully adapted. Dee is also actively involved in scriptwriting and adaptation, ensuring the soul of the original story remains intact when transformed into moving images.',
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
        productAdded: 'Product added to cart',
        productUpdated: 'Quantity updated',
        productRemoved: 'Product removed from cart',
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
export const t = (key) => {
    return translations[state.lang]?.[key] ?? translations['id'][key] ?? key;
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
