import { ref } from 'vue';

export function useProducts() {
    const products = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const currentPage = ref(1);
    const lastPage = ref(1);

    const creatorIdRef = ref(null);

    const fetchProducts = async (page = 1, append = false, creatorId = null) => {
        loading.value = true;
        error.value = null;
        if (creatorId !== null) creatorIdRef.value = creatorId;

        try {
            const baseUrl = import.meta.env.VITE_API_URL || 'https://api.kolektix.cloud';
            let url = `${baseUrl}/api/product?page=${page}`;
            if (creatorIdRef.value) {
                if (Array.isArray(creatorIdRef.value)) {
                    creatorIdRef.value.forEach(id => {
                        url += `&creator_id[]=${id}`;
                    });
                } else {
                    url += `&creator_id=${creatorIdRef.value}`;
                }
            }
            const response = await fetch(url);
            const result = await response.json();

            if (result.data) {
                const mappedProducts = result.data.map(item => {
                    // Map API fields to app fields
                    const imageUrl = item.product_image && item.product_image.length > 0
                        ? item.product_image[0].image_url
                        : 'https://placehold.co/300x400/2a2a2a/FFF?text=No+Image';

                    return {
                        id: item.id,
                        title: item.product_name,
                        author: item.creator ? item.creator.name : 'Dee Lestari',
                        category: 'fiksi', // Default or map if possible
                        categoryDisplay: 'Fiksi',
                        year: new Date(item.created_at).getFullYear(),
                        price: parseFloat(item.price),
                        description: item.description.replace(/<[^>]*>/g, ''), // Strip HTML tags
                        image: imageUrl,
                        originalPrice: item.discount > 0 ? parseFloat(item.price) + parseFloat(item.discount) : null,
                        stock: item.qty,
                        slug: item.slug,
                        isPreorder: item.is_preorder === 1,
                        variants: item.variants || []
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
