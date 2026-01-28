// E-Commerce Website - Full Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Product Data
    const products = [
        {
            id: 1,
            name: "Smartphone Pro X",
            price: 8999000,
            description: "Smartphone flagship dengan kamera 108MP dan chipset terbaru",
            icon: "📱"
        },
        {
            id: 2,
            name: "Laptop Gaming",
            price: 15500000,
            description: "Laptop gaming dengan RTX 4070 dan processor i9",
            icon: "💻"
        },
        {
            id: 3,
            name: "Wireless Headphone",
            price: 2499000,
            description: "Headphone wireless dengan noise cancellation premium",
            icon: "🎧"
        },
        {
            id: 4,
            name: "Smart Watch Pro",
            price: 3999000,
            description: "Smartwatch dengan monitor kesehatan lengkap",
            icon: "⌚"
        },
        {
            id: 5,
            name: "Tablet Pro",
            price: 7999000,
            description: "Tablet dengan layar OLED dan stylus pen",
            icon: "📱"
        },
        {
            id: 6,
            name: "Gaming Console",
            price: 6999000,
            description: "Console gaming terbaru dengan 4K gaming",
            icon: "🎮"
        }
    ];

    // Shopping Cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Initialize
    initialize();

    function initialize() {
        renderProducts();
        renderCart();
        updateCartSummary();
        setupEventListeners();
    }

    function renderProducts() {
        const productGrid = document.getElementById('productGrid');
        productGrid.innerHTML = '';

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-img">${product.icon}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">Rp ${product.price.toLocaleString('id-ID')}</div>
                <p class="product-desc">${product.description}</p>
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
                </button>
            `;
            productGrid.appendChild(productCard);
        });
    }

    function renderCart() {
        const cartItems = document.getElementById('cartItems');
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Keranjang belanja kosong</p>';
            return;
        }

        cartItems.innerHTML = '';
        
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (!product) return;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-img">${product.icon}</div>
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${product.name}</h4>
                    <div class="cart-item-price">Rp ${product.price.toLocaleString('id-ID')}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${product.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${product.id}">+</button>
                </div>
                <button class="remove-item" data-id="${product.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    function updateCartSummary() {
        const subtotal = cart.reduce((total, item) => {
            const product = products.find(p => p.id === item.id);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);

        const tax = subtotal * 0.1;
        const total = subtotal + tax;

        document.getElementById('subtotal').textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
        document.getElementById('tax').textContent = `Rp ${tax.toLocaleString('id-ID')}`;
        document.getElementById('total').textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }

    function addToCart(productId) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id: productId, quantity: 1 });
        }
        
        saveCart();
        renderCart();
        updateCartSummary();
        showNotification('Produk ditambahkan ke keranjang!');
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        renderCart();
        updateCartSummary();
        showNotification('Produk dihapus dari keranjang!');
    }

    function updateQuantity(productId, change) {
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                saveCart();
                renderCart();
                updateCartSummary();
            }
        }
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function setupEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart')) {
                const productId = parseInt(e.target.closest('.add-to-cart').dataset.id);
                addToCart(productId);
            }

            // Decrease quantity
            if (e.target.closest('.decrease')) {
                const productId = parseInt(e.target.closest('.decrease').dataset.id);
                updateQuantity(productId, -1);
            }

            // Increase quantity
            if (e.target.closest('.increase')) {
                const productId = parseInt(e.target.closest('.increase').dataset.id);
                updateQuantity(productId, 1);
            }

            // Remove item
            if (e.target.closest('.remove-item')) {
                const productId = parseInt(e.target.closest('.remove-item').dataset.id);
                removeFromCart(productId);
            }
        });

        // Checkout button
        document.getElementById('checkoutBtn').addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Keranjang belanja kosong!');
                return;
            }

            const total = cart.reduce((sum, item) => {
                const product = products.find(p => p.id === item.id);
                return sum + (product ? product.price * item.quantity : 0);
            }, 0) * 1.1;

            if (confirm(`Checkout dengan total Rp ${total.toLocaleString('id-ID')}?`)) {
                // Simulate payment process
                showNotification('Pembayaran sedang diproses...');
                
                setTimeout(() => {
                    cart = [];
                    saveCart();
                    renderCart();
                    updateCartSummary();
                    showNotification('Pembayaran berhasil! Terima kasih telah berbelanja.');
                }, 2000);
            }
        });
    }

    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff003c;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 1000;
            box-shadow: 0 5px 15px rgba(255, 0, 60, 0.3);
            animation: slideIn 0.3s ease;
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Initialize cart badge
    function updateCartBadge() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCount = document.querySelector('.cart-count');
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    // Expose updateCartBadge for external calls if needed
    window.updateCartBadge = updateCartBadge;
});