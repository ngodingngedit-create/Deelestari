import { ref } from 'vue';
import { store } from '../store';

export function useProducts() {
    const products = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const currentPage = ref(1);
    const lastPage = ref(1);

    const creatorIdRef = ref(null);

    const fetchReportStock = async () => {
        try {
            const baseUrl = store.baseUrl;
            const reportId = store.reportId;
            const response = await fetch(`${baseUrl}/api/product-bymerchant/report/${reportId}`);
            const result = await response.json();
            if (result.status && result.data && result.data.variants_report) {
                let reports = result.data.variants_report;
                if (store.allowedVariantIds) {
                    reports = reports.filter(r => store.allowedVariantIds.includes(r.varian_id));
                }
                return reports;
            }
        } catch (err) {
            console.error('Error fetching report stock:', err);
        }
        return null;
    };

    const fetchProducts = async (page = 1, append = false, creatorId = null) => {
        loading.value = true;
        error.value = null;
        if (creatorId !== null) creatorIdRef.value = creatorId;

        try {
            const baseUrl = store.baseUrl;
            let url = `${baseUrl}/api/product?page=${page}`;

            // Handle dynamic creator_id based on environment
            let effectiveCreatorId = creatorIdRef.value;
            if (baseUrl.includes('api.kolektix.com')) {
                effectiveCreatorId = 129;
            }

            if (effectiveCreatorId) {
                if (Array.isArray(effectiveCreatorId)) {
                    effectiveCreatorId.forEach(id => {
                        url += `&creator_id[]=${id}`;
                    });
                } else {
                    url += `&creator_id=${effectiveCreatorId}`;
                }
            }
            
            // Parallel fetch products and report stock
            const [prodResp, reportVariants] = await Promise.all([
                fetch(url),
                fetchReportStock()
            ]);
            
            const result = await prodResp.json();

            if (result.data) {
                const mappedProducts = result.data.map(item => {
                    // Map API fields to app fields
                    const imageUrl = item.product_image && item.product_image.length > 0
                        ? item.product_image[0].image_url
                        : 'https://placehold.co/300x400/2a2a2a/FFF?text=No+Image';

                    let price = parseFloat(item.price);
                    let stock = item.qty;

                    // Apply report stock overrides if available
                    const variants = (item.product_varian || []).map(v => {
                        let isSoldOut = v.is_soldout === 1 || (v.stock_qty !== undefined ? v.stock_qty : v.stock) <= 0;
                        let currentStock = v.stock_qty !== undefined ? v.stock_qty : v.stock;
                        
                        if (reportVariants) {
                            const report = reportVariants.find(r => r.varian_id === v.id);
                            if (report) {
                                // Explicit override based on report sisa_stock
                                currentStock = parseInt(report.sisa_stock);
                                isSoldOut = currentStock <= 0;
                            }
                        }
                        
                        return {
                            ...v,
                            stock_qty: currentStock,
                            is_soldout: isSoldOut ? 1 : 0
                        };
                    });

                    // If it has variants, use them for price and stock if top-level is 0
                    if (variants.length > 0) {
                        if (price === 0) {
                            price = parseFloat(variants[0].price);
                        }
                        // Total stock is sum of variant stocks (calculated from overridden stock_qty/is_soldout)
                        stock = variants.reduce((sum, v) => sum + (v.is_soldout ? 0 : (v.stock_qty || 0)), 0);
                    }

                    return {
                        id: item.id,
                        title: item.product_name,
                        author: item.creator ? item.creator.name : 'Dee Lestari',
                        category: 'merchandise', // Default or map if possible
                        categoryDisplay: 'Merchandise',
                        year: new Date(item.created_at).getFullYear(),
                        price: price,
                        description: item.description.replace(/<[^>]*>/g, ''), // Strip HTML tags
                        image: imageUrl,
                        originalPrice: item.discount > 0 ? price + parseFloat(item.discount) : null,
                        stock: stock,
                        slug: item.slug,
                        isPreorder: item.is_preorder === 1,
                        variants: variants
                    };
                });

                if (append) {
                    products.value = [...products.value, ...mappedProducts];
                } else {
                    products.value = mappedProducts;
                }

                currentPage.value = page;
                lastPage.value = result.last_page || 1;
            }
        } catch (err) {
            error.value = 'Failed to fetch products';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    const loadMore = async () => {
        if (currentPage.value < lastPage.value && !loading.value) {
            await fetchProducts(currentPage.value + 1, true);
        }
    };

    return {
        products,
        loading,
        error,
        currentPage,
        lastPage,
        fetchProducts,
        loadMore
    };
}
