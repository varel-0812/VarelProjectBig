// Data menu restoran
const menuItems = [
    {
        id: 1,
        name: "Salmon Truffle",
        description: "Salmon segar dengan saus truffle dan sayuran panggang",
        price: 125000,
        category: "main",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
    },
    {
        id: 2,
        name: "Steak Wagyu",
        description: "Daging wagyu premium dengan kentang tumbuk dan asparagus",
        price: 275000,
        category: "main",
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
    },
    {
        id: 3,
        name: "Salad Caesar",
        description: "Selada romaine dengan saus caesar, crouton, dan keju parmesan",
        price: 75000,
        category: "appetizer",
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
    },
    {
        id: 4,
        name: "Bruschetta",
        description: "Roti panggang dengan tomat, basil, dan minyak zaitun",
        price: 65000,
        category: "appetizer",
        image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
    },
    {
        id: 5,
        name: "Tiramisu",
        description: "Dessert Italia klasik dengan kopi dan mascarpone",
        price: 55000,
        category: "dessert",
        image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
    },
    {
        id: 6,
        name: "Chocolate Lava",
        description: "Kue coklat dengan lelehan coklat di dalamnya",
        price: 45000,
        category: "dessert",
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
    },
    {
        id: 7,
        name: "Fresh Orange Juice",
        description: "Jus jeruk segar yang baru diperas",
        price: 35000,
        category: "drink",
        image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=765&q=80"
    },
    {
        id: 8,
        name: "Espresso",
        description: "Kopi espresso Italia asli",
        price: 30000,
        category: "drink",
        image: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
    },
    {
        id: 9,
        name: "Pasta Carbonara",
        description: "Pasta dengan saus krim, telur, dan daging asap",
        price: 95000,
        category: "main",
        image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
    },
    {
        id: 10,
        name: "Mushroom Soup",
        description: "Sup krim jamur dengan rempah-rempah pilihan",
        price: 50000,
        category: "appetizer",
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
    },
    {
        id: 11,
        name: "Cheesecake",
        description: "Kue keju lembut dengan berry sauce",
        price: 50000,
        category: "dessert",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1627&q=80"
    },
    {
        id: 12,
        name: "Mocktail Sunrise",
        description: "Minuman segar dengan campuran buah-buahan tropis",
        price: 40000,
        category: "drink",
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=764&q=80"
    }
];

// State aplikasi
let cart = [];
let currentCategory = 'all';

// DOM Elements
const menuItemsContainer = document.getElementById('menuItems');
const categoryTabs = document.querySelectorAll('.category-tab');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartCountElement = document.querySelector('.cart-count');
const checkoutBtn = document.getElementById('checkoutBtn');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');
const reservationForm = document.getElementById('reservationForm');
const contactForm = document.getElementById('contactForm');

// Format harga ke Rupiah
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Render menu items
function renderMenuItems(category = 'all') {
    menuItemsContainer.innerHTML = '';
    
    const filteredItems = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);
    
    filteredItems.forEach(item => {
        const menuItemElement = document.createElement('div');
        menuItemElement.className = 'menu-item';
        menuItemElement.innerHTML = `
            <div class="menu-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="menu-item-content">
                <div class="menu-item-category">${getCategoryName(item.category)}</div>
                <div class="menu-item-title">
                    <h3 class="menu-item-name">${item.name}</h3>
                    <span class="menu-item-price">${formatRupiah(item.price)}</span>
                </div>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-footer">
                    <button class="add-to-cart" data-id="${item.id}">
                        <i class="fas fa-cart-plus"></i> Tambah
                    </button>
                </div>
            </div>
        `;
        
        menuItemsContainer.appendChild(menuItemElement);
    });
    
    // Tambah event listener ke tombol add to cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            addToCart(itemId);
        });
    });
}

// Dapatkan nama kategori
function getCategoryName(category) {
    const categories = {
        'appetizer': 'Hidangan Pembuka',
        'main': 'Hidangan Utama',
        'dessert': 'Pencuci Mulut',
        'drink': 'Minuman'
    };
    return categories[category] || category;
}

// Tambah item ke keranjang
function addToCart(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCart();
    
    // Tampilkan notifikasi
    showNotification(`${item.name} telah ditambahkan ke keranjang!`);
}

// Update keranjang
function updateCart() {
    // Update jumlah di ikon keranjang
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Render ulang item keranjang
    renderCartItems();
    
    // Update total harga
    updateCartTotal();
    
    // Simpan ke localStorage
    saveCartToLocalStorage();
}

// Render item keranjang
function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Keranjang Anda kosong</p>
            </div>
        `;
        return;
    }
    
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">${formatRupiah(item.price)}</p>
            </div>
            <div class="cart-item-controls">
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Tambah event listener ke tombol keranjang
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(itemId, -1);
        });
    });
    
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(itemId, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            removeFromCart(itemId);
        });
    });
}

// Update jumlah item di keranjang
function updateCartItemQuantity(itemId, change) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        updateCart();
    }
}

// Hapus item dari keranjang
function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        const itemName = cart[itemIndex].name;
        cart.splice(itemIndex, 1);
        updateCart();
        
        // Tampilkan notifikasi
        showNotification(`${itemName} telah dihapus dari keranjang!`);
    }
}

// Update total keranjang
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = formatRupiah(total);
}

// Tampilkan notifikasi
function showNotification(message) {
    // Cek jika sudah ada notifikasi
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Buat elemen notifikasi
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Tambah styling untuk notifikasi
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
        animation-fill-mode: forwards;
    `;
    
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    // Tambah keyframe animation untuk notifikasi
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Hapus notifikasi setelah 3 detik
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Simpan keranjang ke localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('restaurantCart', JSON.stringify(cart));
}

// Muat keranjang dari localStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('restaurantCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Inisialisasi aplikasi
function init() {
    // Render menu items
    renderMenuItems();
    
    // Muat keranjang dari localStorage
    loadCartFromLocalStorage();
    
    // Event listener untuk kategori tab
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Hapus class active dari semua tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            
            // Tambah class active ke tab yang diklik
            this.classList.add('active');
            
            // Render menu items berdasarkan kategori
            const category = this.getAttribute('data-category');
            currentCategory = category;
            renderMenuItems(category);
        });
    });
    
    // Event listener untuk tombol keranjang
    cartBtn.addEventListener('click', () => {
        cartModal.style.display = 'flex';
    });
    
    // Event listener untuk tombol tutup keranjang
    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    // Tutup modal keranjang saat klik di luar
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Event listener untuk tombol checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Keranjang Anda kosong!');
            return;
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        showNotification(`Pesanan senilai ${formatRupiah(total)} berhasil dibuat!`);
        
        // Kosongkan keranjang
        cart = [];
        updateCart();
        
        // Tutup modal
        cartModal.style.display = 'none';
    });
    
    // Event listener untuk toggle menu mobile
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Tutup menu mobile saat klik link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Form reservasi
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validasi sederhana
        const name = document.getElementById('name').value;
        const date = document.getElementById('date').value;
        
        if (!name || !date) {
            showNotification('Harap isi semua field yang wajib diisi!');
            return;
        }
        
        // Tampilkan pesan sukses
        showNotification(`Reservasi atas nama ${name} berhasil dibuat!`);
        
        // Reset form
        reservationForm.reset();
        
        // Set tanggal minimal ke hari ini
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').setAttribute('min', today);
    });
    
    // Form kontak
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validasi sederhana
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        if (!name || !email || !message) {
            showNotification('Harap isi semua field!');
            return;
        }
        
        // Tampilkan pesan sukses
        showNotification(`Pesan dari ${name} berhasil dikirim!`);
        
        // Reset form
        contactForm.reset();
    });
    
    // Set tanggal minimal untuk reservasi ke hari ini
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').setAttribute('min', today);
    
    // Smooth scroll untuk anchor links
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
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '10px 0';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            navbar.style.padding = '15px 0';
        }
        
        // Update active nav link berdasarkan scroll position
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Inisialisasi aplikasi saat DOM siap
document.addEventListener('DOMContentLoaded', init);