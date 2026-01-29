// Data produk ecommerce
const products = [
    {
        id: 1,
        name: "Kaos Premium Cotton",
        category: "baju",
        price: 89000,
        icon: "fas fa-tshirt",
        description: "Kaos dengan bahan cotton premium, nyaman dipakai sehari-hari"
    },
    {
        id: 2,
        name: "Kemeja Formal Linen",
        category: "baju",
        price: 199000,
        icon: "fas fa-tshirt",
        description: "Kemeja formal dengan bahan linen berkualitas tinggi"
    },
    {
        id: 3,
        name: "Jaket Denim Classic",
        category: "baju",
        price: 289000,
        icon: "fas fa-vest",
        description: "Jaket denim klasik dengan potongan modern"
    },
    {
        id: 4,
        name: "Celana Jeans Slim Fit",
        category: "celana",
        price: 249000,
        icon: "fas fa-vest",
        description: "Celana jeans dengan model slim fit, bahan stretch"
    },
    {
        id: 5,
        name: "Celana Chino Casual",
        category: "celana",
        price: 179000,
        icon: "fas fa-vest",
        description: "Celana chino untuk tampilan casual yang stylish"
    },
    {
        id: 6,
        name: "Celana Jogger Sport",
        category: "celana",
        price: 159000,
        icon: "fas fa-vest",
        description: "Celana jogger nyaman untuk aktivitas sehari-hari"
    },
    {
        id: 7,
        name: "Sneakers Sport Premium",
        category: "sepatu",
        price: 459000,
        icon: "fas fa-shoe-prints",
        description: "Sneakers sport dengan teknologi cushioning terbaru"
    },
    {
        id: 8,
        name: "Sepatu Formal Leather",
        category: "sepatu",
        price: 389000,
        icon: "fas fa-shoe-prints",
        description: "Sepatu formal kulit asli dengan finishing premium"
    },
    {
        id: 9,
        name: "Sepatu Running",
        category: "sepatu",
        price: 329000,
        icon: "fas fa-shoe-prints",
        description: "Sepatu lari dengan sol anti-slip dan ventilasi optimal"
    },
    {
        id: 10,
        name: "Topi Baseball",
        category: "topi",
        price: 89000,
        icon: "fas fa-hat-cowboy",
        description: "Topi baseball dengan berbagai pilihan warna"
    },
    {
        id: 11,
        name: "Topi Fedora",
        category: "topi",
        price: 129000,
        icon: "fas fa-hat-cowboy",
        description: "Topi fedora elegan untuk gaya kasual maupun formal"
    },
    {
        id: 12,
        name: "Tas Ransel Premium",
        category: "topi",
        price: 299000,
        icon: "fas fa-shopping-bag",
        description: "Tas ransel dengan bahan tahan air dan banyak kompartemen"
    }
];

// Data keranjang belanja
let cart = [];

// Fungsi untuk memformat harga ke Rupiah
function formatRupiah(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
}

// Fungsi untuk menampilkan produk
function displayProducts(filter = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    let filteredProducts = products;
    
    if (filter !== 'all') {
        filteredProducts = products.filter(product => product.category === filter);
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-category', product.category);
        
        productCard.innerHTML = `
            <div class="product-img">
                <i class="${product.icon}"></i>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">${formatRupiah(product.price)}</div>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
                    </button>
                    <button class="whatsapp-btn" data-id="${product.id}">
                        <i class="fab fa-whatsapp"></i>
                    </button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Tambahkan event listener untuk tombol tambah ke keranjang
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
    
    // Tambahkan event listener untuk tombol WhatsApp per produk
    document.querySelectorAll('.whatsapp-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            const message = `Halo, saya tertarik dengan produk: ${product.name} - ${formatRupiah(product.price)}. Apakah masih tersedia?`;
            const whatsappUrl = `https://wa.me/qr/MVZ7FNK2XVOSK1${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    });
}

// Fungsi untuk menambahkan produk ke keranjang
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            icon: product.icon,
            quantity: 1
        });
    }
    
    updateCartUI();
    showNotification(`"${product.name}" telah ditambahkan ke keranjang`);
}

// Fungsi untuk menghapus produk dari keranjang
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    showNotification("Produk telah dihapus dari keranjang");
}

// Fungsi untuk mengubah kuantitas produk di keranjang
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = newQuantity;
        updateCartUI();
    }
}

// Fungsi untuk memperbarui tampilan keranjang
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const totalPriceElement = document.getElementById('totalPrice');
    
    // Update jumlah item di keranjang
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update total harga
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    totalPriceElement.textContent = formatRupiah(totalPrice);
    
    // Update daftar item di keranjang
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Keranjang belanja kosong</p>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-img">
                    <i class="${item.icon}"></i>
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${formatRupiah(item.price)}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Tambahkan event listener untuk tombol kuantitas
        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const cartItem = cart.find(item => item.id === productId);
                if (cartItem) {
                    updateQuantity(productId, cartItem.quantity - 1);
                }
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const cartItem = cart.find(item => item.id === productId);
                if (cartItem) {
                    updateQuantity(productId, cartItem.quantity + 1);
                }
            });
        });
        
        // Tambahkan event listener untuk tombol hapus
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });
    }
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message) {
    // Cek apakah notifikasi sudah ada
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.classList.add('show');
    
    // Hilangkan notifikasi setelah 3 detik
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Fungsi untuk membuat pesan WhatsApp dari keranjang
function createWhatsAppMessage() {
    if (cart.length === 0) {
        return "Halo, saya ingin bertanya tentang produk yang tersedia.";
    }
    
    let message = "Halo RelWeb, saya ingin memesan produk berikut:\n\n";
    
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - ${item.quantity} x ${formatRupiah(item.price)}\n`;
    });
    
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    message += `\nTotal: ${formatRupiah(totalPrice)}\n\nNama: [Nama Anda]\nAlamat: [Alamat Pengiriman]`;
    
    return message;
}

// Fungsi untuk mengirim pesan ke WhatsApp
function sendWhatsAppOrder() {
    if (cart.length === 0) {
        showNotification("Keranjang belanja kosong. Tambahkan produk terlebih dahulu.");
        return;
    }
    
    const message = createWhatsAppMessage();
    const whatsappUrl = `https://wa.me/qr/MVZ7FNK2XVOSK1${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Tampilkan modal sukses
    const modal = document.getElementById('successModal');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = "Pesanan Anda telah dikirim ke WhatsApp kami. Kami akan segera menghubungi Anda untuk konfirmasi pesanan.";
    modal.style.display = 'flex';
    
    // Kosongkan keranjang setelah pesan dikirim
    cart = [];
    updateCartUI();
}

// Fungsi untuk mengirim formulir kontak
function submitContactForm(e) {
    e.preventDefault();
    
    // Simulasi pengiriman formulir
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'flex';
    
    setTimeout(() => {
        loadingOverlay.style.display = 'none';
        
        // Tampilkan modal sukses
        const modal = document.getElementById('successModal');
        const modalMessage = document.getElementById('modalMessage');
        modalMessage.textContent = "Pesan Anda telah berhasil dikirim. Kami akan membalas pesan Anda dalam 1x24 jam.";
        modal.style.display = 'flex';
        
        // Reset formulir
        document.getElementById('contactForm').reset();
    }, 1500);
}

// Inisialisasi aplikasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Tampilkan semua produk saat halaman dimuat
    displayProducts();
    
    // Set tahun saat ini di footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Event listener untuk tombol filter produk
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Hapus kelas active dari semua tombol filter
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Tambahkan kelas active ke tombol yang diklik
            this.classList.add('active');
            
            // Filter produk berdasarkan kategori
            const filter = this.getAttribute('data-filter');
            displayProducts(filter);
        });
    });
    
    // Event listener untuk tombol keranjang
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    
    cartBtn.addEventListener('click', function() {
        cartSidebar.classList.add('active');
    });
    
    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
    });
    
    // Event listener untuk tombol checkout
    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.addEventListener('click', sendWhatsAppOrder);
    
    // Event listener untuk tombol WhatsApp di kontak
    const whatsappBtn = document.getElementById('whatsappBtn');
    whatsappBtn.addEventListener('click', function() {
        const message = "Halo StyleHub, saya ingin bertanya tentang produk yang tersedia.";
        const whatsappUrl = `https://wa.me/qr/MVZ7FNK2XVOSK1${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
    
    // Event listener untuk tombol email
    const emailBtn = document.getElementById('emailBtn');
    emailBtn.addEventListener('click', function() {
        window.location.href = "mailto:info@stylehub.com?subject=Pertanyaan tentang produk&body=Halo StyleHub,%0D%0A%0D%0ASaya ingin bertanya tentang...";
    });
    
    // Event listener untuk tombol peta
    const mapBtn = document.getElementById('mapBtn');
    mapBtn.addEventListener('click', function() {
        window.open("https://www.google.com/maps/place/Jakarta+Pusat,+Jakarta", '_blank');
    });
    
    // Event listener untuk formulir kontak
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', submitContactForm);
    
    // Event listener untuk tombol tutup modal
    const closeModal = document.getElementById('closeModal');
    const successModal = document.getElementById('successModal');
    
    closeModal.addEventListener('click', function() {
        successModal.style.display = 'none';
    });
    
    // Tutup modal ketika klik di luar konten modal
    window.addEventListener('click', function(event) {
        if (event.target === successModal) {
            successModal.style.display = 'none';
        }
    });
    
    // Event listener untuk menu toggle di mobile
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // Tutup menu mobile saat klik tautan
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            
            // Update kelas active pada tautan navigasi
            document.querySelectorAll('.nav-link').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Tambahkan CSS untuk notifikasi
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        .notification {
            position: fixed;
            bottom: 100px;
            right: 30px;
            background-color: var(--accent-color);
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
    `;
    document.head.appendChild(notificationStyle);
    
    // Animasi scroll halus untuk tautan internal
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Efek scroll untuk header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
    });
});