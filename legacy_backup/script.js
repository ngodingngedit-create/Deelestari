document.addEventListener('DOMContentLoaded', () => {
    // --- EXISTING FUNCTIONALITY ---

    // Header Scroll Effect
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }

    // Horizontal Scroll for Category Chips
    const categoryChips = document.querySelector('.category-chips');
    if (categoryChips) {
        categoryChips.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                categoryChips.scrollLeft += e.deltaY;
            }
        });
    }

    // Mobile Menu Sidebar
    const menuToggle = document.querySelector('.menu-toggle');
    const navSidebar = document.querySelector('.sidebar');
    const navOverlay = document.querySelector('.sidebar-overlay');
    const navClose = document.querySelector('.sidebar-close');

    function toggleNav() {
        if (!navSidebar) return;
        navSidebar.classList.toggle('active');
        if (navOverlay) navOverlay.classList.toggle('active');
        document.body.style.overflow = navSidebar.classList.contains('active') ? 'hidden' : '';
    }

    if (menuToggle) menuToggle.addEventListener('click', toggleNav);
    if (navClose) navClose.addEventListener('click', toggleNav);
    if (navOverlay) navOverlay.addEventListener('click', toggleNav);

    // Filtering Logic
    const searchInput = document.querySelector('.search-input');
    const cards = document.querySelectorAll('.card');
    const chips = document.querySelectorAll('.chip');
    let activeChip = 'Semua';

    function filterContent() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

        cards.forEach(card => {
            const category = card.dataset.category;
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const desc = card.querySelector('.card-desc').textContent.toLowerCase();

            const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);
            const lowerChip = activeChip.toLowerCase();
            const matchesChip = activeChip === 'Semua' || category === lowerChip || title.includes(lowerChip);

            if (matchesSearch && matchesChip) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
            }
        });
    }

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeChip = chip.textContent;
            filterContent();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', filterContent);
    }

    // --- NEW FUNCTIONALITY: CART & LANGUAGE ---

    // State
    let cart = [];
    let currentLang = 'ID';

    // Elements
    const cartToggleBtn = document.querySelector('.cart-toggle');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartCloseBtn = document.querySelector('.cart-close');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartBadge = document.querySelector('.cart-badge');
    const totalCountEls = document.querySelectorAll('.total-count'); // Might be multiple
    const langSwitchBtn = document.querySelector('.lang-switch');

    // Cart Sidebar Toggle
    function toggleCart() {
        if (!cartSidebar) return;
        cartSidebar.classList.toggle('active');
        if (cartOverlay) cartOverlay.classList.toggle('active');
        document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
    }

    if (cartToggleBtn) cartToggleBtn.addEventListener('click', toggleCart);
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Update UI
    function updateCartUI() {
        // 1. Update Badge & Totals
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

        // Calculate Total Price
        const totalPrice = cart.reduce((sum, item) => {
            // Price stored as formatted string "125000" or int in dataset. Assuming int from earlier lookup
            return sum + (item.price * item.qty);
        }, 0);

        if (cartBadge) cartBadge.textContent = totalQty;
        totalCountEls.forEach(el => el.textContent = totalQty);

        // --- UPDATE FLOATING BAR ---
        const floatingBar = document.querySelector('.floating-cart-bar');
        const floatingCount = document.querySelector('.floating-item-count');
        const floatingPrice = document.querySelector('.floating-total-price');
        const detailBadge = document.querySelector('.detail-badge');

        if (floatingBar) {
            if (totalQty > 0) {
                floatingBar.classList.add('active');
                if (floatingCount) floatingCount.textContent = totalQty;
                if (detailBadge) detailBadge.textContent = totalQty;
                if (floatingPrice) floatingPrice.textContent = 'Rp ' + totalPrice.toLocaleString('id-ID');
            } else {
                floatingBar.classList.remove('active');
            }
        }

        // 2. Render Cart Items
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `<div class="empty-cart-message">${currentLang === 'ID' ? 'Keranjang Anda masih kosong.' : 'Your cart is empty.'}</div>`;
            } else {
                cart.forEach(item => {
                    const itemEl = document.createElement('div');
                    itemEl.classList.add('cart-item');
                    itemEl.innerHTML = `
                        <div class="cart-item-image" style="${item.imageStyle}"></div>
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${item.title}</h4>
                            <div class="cart-item-controls">
                                <button class="cart-qty-btn minus" data-id="${item.id}">-</button>
                                <span class="cart-item-qty">${item.qty}</span>
                                <button class="cart-qty-btn plus" data-id="${item.id}">+</button>
                            </div>
                        </div>
                    `;
                    cartItemsContainer.appendChild(itemEl);
                });

                // Attach events to new cart buttons
                cartItemsContainer.querySelectorAll('.cart-qty-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = e.target.dataset.id;
                        const change = e.target.classList.contains('plus') ? 1 : -1;
                        updateCart(id, change);
                    });
                });
            }
        }

        // Update Detail Panel List
        if (typeof renderDetailItems === 'function') {
            renderDetailItems();
        }

        // 3. Update Card Controls (sync qty)
        document.querySelectorAll('.card').forEach(card => {
            const id = card.dataset.id;
            const qtyVal = card.querySelector('.qty-val');
            if (qtyVal) {
                const item = cart.find(i => i.id === id);
                qtyVal.textContent = item ? item.qty : 0;
            }
        });
    }

    // Update Cart State
    function updateCart(id, change) {
        const itemIndex = cart.findIndex(i => i.id === id);

        if (itemIndex > -1) {
            // Item exists
            cart[itemIndex].qty += change;
            if (cart[itemIndex].qty <= 0) {
                cart.splice(itemIndex, 1);
            }
        } else if (change > 0) {
            // New Item
            const card = document.querySelector(`.card[data-id="${id}"]`);
            if (card) {
                const title = card.querySelector('.card-title').textContent;
                const imageStyle = card.querySelector('.card-image').getAttribute('style');
                const price = parseInt(card.dataset.price) || 0; // Capture Price

                cart.push({
                    id: id,
                    title: title,
                    imageStyle: imageStyle,
                    price: price,
                    qty: 1
                });
            }
        }
        updateCartUI();
    }

    // Attach functionality to Card Controls
    document.querySelectorAll('.card').forEach(card => {
        const id = card.dataset.id;
        const minusBtn = card.querySelector('.qty-btn.minus');
        const plusBtn = card.querySelector('.qty-btn.plus');

        if (minusBtn) {
            minusBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click if necessary
                updateCart(id, -1);
            });
        }
        if (plusBtn) {
            plusBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateCart(id, 1);
            });
        }
    });

    // Language Dropdown Logic
    const langDropdown = document.querySelector('.lang-dropdown');
    const langOptions = document.querySelectorAll('.lang-option');

    // Toggle Dropdown
    if (langSwitchBtn) {
        langSwitchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
        });
    }

    // Close Dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (langDropdown && langDropdown.classList.contains('active') && !e.target.closest('.lang-container')) {
            langDropdown.classList.remove('active');
        }
    });

    // Language Option Click
    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedLang = option.dataset.lang;
            if (selectedLang === currentLang) {
                langDropdown.classList.remove('active');
                return;
            }

            currentLang = selectedLang;

            // Update Active State in Dropdown
            langOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');

            // Update Main Button Icon
            const svgs = {
                'ID': `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#EEEEEE" stroke="#333" stroke-width="1"/>
                        <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12" fill="#CE1126"/>
                        <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12" fill="white"/>
                    </svg>`,
                'EN': `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#EEEEEE" stroke="#333" stroke-width="1"/>
                        <path d="M2 12H22" stroke="#B22234" stroke-width="2"/>
                        <path d="M2 5H22" stroke="#B22234" stroke-width="2"/>
                        <path d="M2 19H22" stroke="#B22234" stroke-width="2"/>
                        <rect x="2" y="2" width="10" height="10" fill="#3C3B6E"/>
                    </svg>`
            };

            langSwitchBtn.innerHTML = svgs[currentLang];

            // Update Text Content
            if (currentLang === 'EN') {
                document.querySelector('.search-input').placeholder = 'Search writings, books, or thoughts...';
                const chipAll = document.querySelector('.chip:first-child');
                if (chipAll) chipAll.textContent = 'All';
                const cartHeader = document.querySelector('.cart-header h3');
                if (cartHeader) cartHeader.textContent = 'Cart';
                const emptyMsg = document.querySelector('.empty-cart-message');
                if (emptyMsg && cart.length === 0) emptyMsg.textContent = 'Your cart is empty.';
            } else {
                document.querySelector('.search-input').placeholder = 'Cari tulisan, buku, atau pemikiran…';
                const chipAll = document.querySelector('.chip:first-child');
                if (chipAll) chipAll.textContent = 'Semua';
                const cartHeader = document.querySelector('.cart-header h3');
                if (cartHeader) cartHeader.textContent = 'Keranjang';
                const emptyMsg = document.querySelector('.empty-cart-message');
                if (emptyMsg && cart.length === 0) emptyMsg.textContent = 'Keranjang Anda masih kosong.';
            }

            langDropdown.classList.remove('active');
        });
    });

    // --- FLOATING DETAIL PANEL LOGIC ---
    const detailBtn = document.querySelector('.floating-detail-btn');
    const detailPanel = document.querySelector('.floating-detail-panel');
    const detailClose = document.querySelector('.detail-close-btn');
    const detailList = document.querySelector('.detail-items-list');

    function toggleDetailPanel() {
        if (detailPanel) {
            detailPanel.classList.toggle('active');
            // Rotate chevron
            const chevron = detailBtn.querySelector('.chevron-down');
            if (chevron) {
                chevron.style.transform = detailPanel.classList.contains('active') ? 'rotate(-135deg)' : 'rotate(45deg)';
                chevron.style.marginTop = detailPanel.classList.contains('active') ? '5px' : '0';
            }
        }
    }

    if (detailBtn) detailBtn.addEventListener('click', toggleDetailPanel);
    if (detailClose) detailClose.addEventListener('click', () => {
        if (detailPanel) {
            detailPanel.classList.remove('active');
            const chevron = detailBtn.querySelector('.chevron-down');
            if (chevron) chevron.style.transform = 'rotate(45deg)';
        }
    });

    function renderDetailItems() {
        if (!detailList) return;
        detailList.innerHTML = '';

        cart.forEach(item => {
            const priceVal = item.price || 0;
            const itemTotal = priceVal * item.qty;

            const row = document.createElement('div');
            row.classList.add('detail-item-row');
            row.innerHTML = `
                <div class="detail-item-info">
                    <h4>${item.title}</h4>
                    <span class="detail-item-variant">Standard</span>
                </div>
                <div class="detail-item-actions">
                    <div class="detail-qty-control">
                        <button class="detail-qty-btn minus" data-id="${item.id}">-</button>
                        <span class="detail-qty-val">${item.qty}</span>
                        <button class="detail-qty-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <span class="detail-item-price">Rp ${itemTotal.toLocaleString('id-ID')}</span>
                </div>
            `;
            detailList.appendChild(row);
        });

        // Attach events
        detailList.querySelectorAll('.detail-qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const change = e.target.classList.contains('plus') ? 1 : -1;
                updateCart(id, change);
            });
        });
    }

    // Hook into updateCartUI to refresh the list if it's open (or just always refresh)
    const originalUpdateCartUI = updateCartUI; // Reference existing if needed, but better to just call renderDetailItems inside the main updateCartUI function.
    // We will inject the call into the main updateCartUI function in a separate edit or assume I can't easily hook.
    // Actually, I should just edit updateCartUI to call renderDetailItems().

    // --- CATEGORY MODAL TOGGLE LOGIC ---
    const categoryBtn = document.querySelector('.category-toggle-btn');
    const categoryModal = document.getElementById('categoryModal');
    const modalClose = document.querySelector('.modal-close-btn');
    const modalOverlay = document.querySelector('.category-modal-overlay');

    if (categoryBtn && categoryModal) {
        // Open
        categoryBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            categoryBtn.classList.toggle('active');
            categoryModal.classList.toggle('active');
        });

        // Close functions
        const closeModal = () => {
            categoryBtn.classList.remove('active');
            categoryModal.classList.remove('active');
        };

        // Close on X
        if (modalClose) modalClose.addEventListener('click', closeModal);

        // Close on Overlay click
        if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

        // Close when clicking outside (double check, mainly handled by overlay)
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.category-toggle-btn') && !e.target.closest('.category-modal-content')) {
                // If overlay is clicked it handles it, but this is a fail-safe
                closeModal();
            }
        });
    }

    // --- CATEGORY DROPDOWN TOGGLE ---
    const catToggle = document.querySelector('.category-toggle-btn');
    const catDropdown = document.querySelector('.category-dropdown-menu');

    // Mega Menu Tabs
    const megaTabs = document.querySelectorAll('.mega-tab');
    const megaGrids = document.querySelectorAll('.mega-grid');

    if (catToggle && catDropdown) {
        catToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            catDropdown.classList.toggle('active');

            // Rotate chevron
            const chevron = catToggle.querySelector('.chevron-icon');
            if (chevron) {
                if (catDropdown.classList.contains('active')) {
                    chevron.style.transform = 'rotate(180deg)';
                } else {
                    chevron.style.transform = 'rotate(0deg)';
                }
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!catToggle.contains(e.target) && !catDropdown.contains(e.target)) {
                catDropdown.classList.remove('active');
                const chevron = catToggle.querySelector('.chevron-icon');
                if (chevron) chevron.style.transform = 'rotate(0deg)';
            }
        });

        // Tab Switching Logic
        megaTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active from all tabs
                megaTabs.forEach(t => t.classList.remove('active'));
                // Add active to clicked tab
                tab.classList.add('active');

                // Hide all grids
                megaGrids.forEach(grid => grid.classList.remove('active'));

                // Show target grid
                const targetId = tab.dataset.target;
                const targetGrid = document.getElementById(targetId);
                if (targetGrid) targetGrid.classList.add('active');
            });
        });
    }
    // --- QUANTITY LOGIC & PRICING ---
    const contentGrid = document.querySelector('.content-grid');
    if (contentGrid) {
        contentGrid.addEventListener('click', (e) => {
            // Check if clicked element is a qty button
            const btn = e.target.closest('.qty-btn');
            if (!btn) return;

            // Prevent bubbling to card
            e.preventDefault();
            e.stopPropagation();

            const card = btn.closest('.card');
            if (!card) return;

            const id = card.dataset.id;
            // Get Price on first add or update
            const price = parseInt(card.dataset.price) || 0;
            const title = card.querySelector('.card-title').textContent;

            const change = btn.classList.contains('plus') ? 1 : -1;

            // Pass price to updateCart
            updateCart(id, change, price, title);
        });
    }
});

// Helper: Format Rupiah
function formatRupiah(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

function updateCart(id, change, price = 0, title = '') {
    const existingItemIndex = cart.findIndex(item => item.id === id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += change;
        if (cart[existingItemIndex].quantity <= 0) {
            cart.splice(existingItemIndex, 1);
        }
    } else if (change > 0) {
        cart.push({ id: id, quantity: 1, price: price, title: title });
    }

    updateCartUI();
}

function updateCartUI() {
    // 1. Update Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    // 2. Update Card Controls
    document.querySelectorAll('.card').forEach(card => {
        const id = card.dataset.id;
        const item = cart.find(i => i.id === id);
        const qtyVal = card.querySelector('.qty-val');
        if (qtyVal) {
            qtyVal.textContent = item ? item.quantity : 0;
        }
    });

    // 3. Render Cart Sidebar
    renderCartSidebar();
}

function renderCartSidebar() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalCountSpan = document.querySelector('.total-count'); // We might want to replace this with Price Total

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let grandTotal = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Keranjang Anda masih kosong.</p>';
        if (totalCountSpan) totalCountSpan.textContent = 'Rp 0';
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div class="cart-item-image" style="background-color: #333;"></div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title || 'Produk ' + item.id}</h4>
                <p style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem;">${formatRupiah(item.price)}</p>
                <div class="cart-item-controls">
                    <button class="cart-qty-btn minus" onclick="updateCartFromSidebar('${item.id}', -1)">-</button>
                    <span class="cart-item-qty">${item.quantity}</span>
                    <button class="cart-qty-btn plus" onclick="updateCartFromSidebar('${item.id}', 1)">+</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Update Total Display logic -> Change "Total Items" text to "Total Price" or "Subtotal" implies check
    // Assuming the HTML struct is still <div class="cart-total"><span>Total Items:</span>...
    // We should update the label dynamically if possible or just the value.
    const totalLabel = document.querySelector('.cart-total span:first-child');
    if (totalLabel) totalLabel.textContent = 'Total:';

    if (totalCountSpan) totalCountSpan.textContent = formatRupiah(grandTotal);
}

// Make accessible to onclick
window.updateCartFromSidebar = function (id, change) {
    updateCart(id, change);
};
