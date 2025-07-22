// Buyer Dashboard Management System
class BuyerDashboard {
    constructor() {
        this.currentUser = null;
        this.orders = [];
        this.favorites = [];
        this.cart = [];
        this.addresses = [];
        this.userSettings = {};
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.loadUserData();
        this.setupEventListeners();
        this.updateUI();
        this.loadSectionFromHash();
    }

    // Check if user is authenticated and is a buyer
    checkAuthentication() {
        const currentUser = localStorage.getItem('kod_current_user');
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }

        this.currentUser = JSON.parse(currentUser);
        if (this.currentUser.role !== 'buyer') {
            alert('Access denied. This dashboard is for buyers only.');
            window.location.href = 'index.html';
            return;
        }
    }

    // Load user data from localStorage
    loadUserData() {
        const userId = this.currentUser.id;
        
        // Load orders
        this.orders = JSON.parse(localStorage.getItem(`kod_orders_${userId}`) || '[]');
        
        // Load favorites
        this.favorites = JSON.parse(localStorage.getItem(`kod_favorites_${userId}`) || '[]');
        
        // Load cart
        this.cart = JSON.parse(localStorage.getItem(`kod_cart_${userId}`) || '[]');
        
        // Load addresses
        this.addresses = JSON.parse(localStorage.getItem(`kod_addresses_${userId}`) || '[]');
        
        // Load settings
        this.userSettings = JSON.parse(localStorage.getItem(`kod_settings_${userId}`) || '{}');
        
        // Initialize sample data if empty (for demo purposes)
        this.initializeSampleData();
    }

    // Initialize sample data for demonstration
    initializeSampleData() {
        if (this.orders.length === 0) {
            this.orders = [
                {
                    id: 'ORD-001',
                    date: '2024-01-15',
                    status: 'delivered',
                    total: 25000,
                    items: [
                        { name: 'Wireless Headphones', price: 15000, quantity: 1 },
                        { name: 'Phone Case', price: 5000, quantity: 2 }
                    ]
                },
                {
                    id: 'ORD-002',
                    date: '2024-01-20',
                    status: 'shipped',
                    total: 45000,
                    items: [
                        { name: 'Bluetooth Speaker', price: 45000, quantity: 1 }
                    ]
                }
            ];
        }

        if (this.favorites.length === 0) {
            this.favorites = [
                {
                    id: 'PROD-001',
                    name: 'Laptop Stand',
                    price: 12000,
                    image: 'https://via.placeholder.com/200x200',
                    rating: 4.5
                },
                {
                    id: 'PROD-002',
                    name: 'USB-C Cable',
                    price: 3000,
                    image: 'https://via.placeholder.com/200x200',
                    rating: 4.8
                }
            ];
        }

        if (this.cart.length === 0) {
            this.cart = [
                {
                    id: 'PROD-003',
                    name: 'Wireless Mouse',
                    price: 8000,
                    quantity: 1,
                    image: 'https://via.placeholder.com/100x100'
                }
            ];
        }

        if (this.addresses.length === 0) {
            this.addresses = [
                {
                    id: 'ADDR-001',
                    title: 'Home',
                    street: '123 Main Street',
                    city: 'Lagos',
                    state: 'Lagos State',
                    postalCode: '100001',
                    country: 'Nigeria',
                    isDefault: true
                }
            ];
        }

        this.saveUserData();
    }

    // Save user data to localStorage
    saveUserData() {
        const userId = this.currentUser.id;
        localStorage.setItem(`kod_orders_${userId}`, JSON.stringify(this.orders));
        localStorage.setItem(`kod_favorites_${userId}`, JSON.stringify(this.favorites));
        localStorage.setItem(`kod_cart_${userId}`, JSON.stringify(this.cart));
        localStorage.setItem(`kod_addresses_${userId}`, JSON.stringify(this.addresses));
        localStorage.setItem(`kod_settings_${userId}`, JSON.stringify(this.userSettings));
    }

    // Setup event listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link, .view-all-btn').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Profile form
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        }

        // Address management
        const addAddressBtn = document.getElementById('add-address-btn');
        const addFirstAddressBtn = document.getElementById('add-first-address-btn');
        if (addAddressBtn) addAddressBtn.addEventListener('click', () => this.showAddressModal());
        if (addFirstAddressBtn) addFirstAddressBtn.addEventListener('click', () => this.showAddressModal());

        const addressForm = document.getElementById('address-form');
        if (addressForm) {
            addressForm.addEventListener('submit', (e) => this.handleAddAddress(e));
        }

        // Password change
        const changePasswordBtn = document.getElementById('change-password-btn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => this.showPasswordModal());
        }

        const passwordForm = document.getElementById('password-form');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => this.handlePasswordChange(e));
        }

        // Cart actions
        const clearCartBtn = document.getElementById('clear-cart-btn');
        const checkoutBtn = document.getElementById('checkout-btn');
        if (clearCartBtn) clearCartBtn.addEventListener('click', () => this.clearCart());
        if (checkoutBtn) checkoutBtn.addEventListener('click', () => this.proceedToCheckout());

        // Favorites actions
        const clearFavoritesBtn = document.getElementById('clear-favorites-btn');
        if (clearFavoritesBtn) {
            clearFavoritesBtn.addEventListener('click', () => this.clearFavorites());
        }

        // Order filter
        const orderFilter = document.getElementById('order-status-filter');
        if (orderFilter) {
            orderFilter.addEventListener('change', (e) => this.filterOrders(e.target.value));
        }

        // Settings toggles
        document.querySelectorAll('.toggle input').forEach(toggle => {
            toggle.addEventListener('change', (e) => this.handleSettingChange(e));
        });

        // Modal controls
        this.setupModalListeners();

        // Delete account
        const deleteAccountBtn = document.getElementById('delete-account-btn');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', () => this.handleDeleteAccount());
        }
    }

    // Setup modal event listeners
    setupModalListeners() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const closeButtons = modal.querySelectorAll('.close');
            closeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    modal.style.display = 'none';
                });
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    // Load section from URL hash
    loadSectionFromHash() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            this.showSection(hash);
        }
    }

    // Show specific dashboard section
    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionName) {
                link.classList.add('active');
            }
        });

        // Update sections
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            window.location.hash = sectionName;
        }

        // Load section-specific data
        this.loadSectionData(sectionName);
    }

    // Load data for specific section
    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'overview':
                this.renderOverview();
                break;
            case 'orders':
                this.renderOrders();
                break;
            case 'favorites':
                this.renderFavorites();
                break;
            case 'cart':
                this.renderCart();
                break;
            case 'profile':
                this.loadProfile();
                break;
            case 'addresses':
                this.renderAddresses();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    // Update UI with user data
    updateUI() {
        // Welcome message
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome back, ${this.currentUser.fullName}!`;
        }

        // Quick stats
        this.updateQuickStats();
        
        // Load overview by default
        this.renderOverview();
    }

    // Update quick stats
    updateQuickStats() {
        document.getElementById('total-orders').textContent = this.orders.length;
        document.getElementById('total-favorites').textContent = this.favorites.length;
        document.getElementById('cart-items').textContent = this.cart.reduce((total, item) => total + item.quantity, 0);
        
        const totalSpent = this.orders
            .filter(order => order.status === 'delivered')
            .reduce((total, order) => total + order.total, 0);
        document.getElementById('total-spent').textContent = `₦${totalSpent.toLocaleString()}`;
    }

    // Render overview section
    renderOverview() {
        this.renderRecentOrders();
        this.renderRecentFavorites();
    }

    // Render recent orders
    renderRecentOrders() {
        const container = document.getElementById('recent-orders-list');
        const recentOrders = this.orders.slice(0, 3);

        if (recentOrders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-bag"></i>
                    <p>No orders yet. Start shopping!</p>
                    <a href="shop.html" class="shop-btn">Browse Products</a>
                </div>
            `;
            return;
        }

        container.innerHTML = recentOrders.map(order => `
            <div class="order-item">
                <div class="order-info">
                    <h4>Order #${order.id}</h4>
                    <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
                    <p>Total: ₦${order.total.toLocaleString()}</p>
                </div>
                <div class="order-status">
                    <span class="status-badge ${order.status}">${this.capitalizeFirst(order.status)}</span>
                </div>
            </div>
        `).join('');
    }

    // Render recent favorites
    renderRecentFavorites() {
        const container = document.getElementById('recent-favorites-list');
        const recentFavorites = this.favorites.slice(0, 4);

        if (recentFavorites.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart"></i>
                    <p>No favorites yet. Add products to your wishlist!</p>
                    <a href="shop.html" class="shop-btn">Browse Products</a>
                </div>
            `;
            return;
        }

        container.innerHTML = recentFavorites.map(item => `
            <div class="favorite-item">
                <img src="${item.image}" alt="${item.name}">
                <h4>${item.name}</h4>
                <p>₦${item.price.toLocaleString()}</p>
                <div class="rating">
                    ${this.renderStars(item.rating)}
                </div>
                <button onclick="dashboard.addToCart('${item.id}')" class="add-to-cart-btn">
                    <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        `).join('');
    }

    // Render orders section
    renderOrders(filter = 'all') {
        const container = document.getElementById('orders-list');
        let filteredOrders = this.orders;

        if (filter !== 'all') {
            filteredOrders = this.orders.filter(order => order.status === filter);
        }

        if (filteredOrders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-bag"></i>
                    <p>No orders found</p>
                    <a href="shop.html" class="shop-btn">Start Shopping</a>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredOrders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <h3>Order #${order.id}</h3>
                    <span class="status-badge ${order.status}">${this.capitalizeFirst(order.status)}</span>
                </div>
                <div class="order-details">
                    <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> ₦${order.total.toLocaleString()}</p>
                    <p><strong>Items:</strong> ${order.items.length} item(s)</p>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item-detail">
                            <span>${item.name} x${item.quantity}</span>
                            <span>₦${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-actions">
                    <button onclick="dashboard.trackOrder('${order.id}')" class="secondary-btn">Track Order</button>
                    ${order.status === 'delivered' ? '<button onclick="dashboard.reorderItems(\'' + order.id + '\')" class="primary-btn">Reorder</button>' : ''}
                </div>
            </div>
        `).join('');
    }

    // Render favorites section
    renderFavorites() {
        const container = document.getElementById('favorites-list');

        if (this.favorites.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart"></i>
                    <p>No favorites yet</p>
                    <a href="shop.html" class="shop-btn">Browse Products</a>
                </div>
            `;
            return;
        }

        container.innerHTML = this.favorites.map(item => `
            <div class="favorite-card">
                <img src="${item.image}" alt="${item.name}">
                <div class="favorite-info">
                    <h4>${item.name}</h4>
                    <p class="price">₦${item.price.toLocaleString()}</p>
                    <div class="rating">
                        ${this.renderStars(item.rating)}
                    </div>
                </div>
                <div class="favorite-actions">
                    <button onclick="dashboard.addToCart('${item.id}')" class="primary-btn">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button onclick="dashboard.removeFromFavorites('${item.id}')" class="remove-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Render cart section
    renderCart() {
        const container = document.getElementById('cart-list');
        const totalElement = document.getElementById('cart-total');

        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="shop.html" class="shop-btn">Start Shopping</a>
                </div>
            `;
            totalElement.textContent = '₦0.00';
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalElement.textContent = `₦${total.toLocaleString()}`;

        container.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="price">₦${item.price.toLocaleString()}</p>
                </div>
                <div class="quantity-controls">
                    <button onclick="dashboard.updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="dashboard.updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-total">
                    ₦${(item.price * item.quantity).toLocaleString()}
                </div>
                <button onclick="dashboard.removeFromCart('${item.id}')" class="remove-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    // Render addresses section
    renderAddresses() {
        const container = document.getElementById('addresses-list');

        if (this.addresses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-map-marker-alt"></i>
                    <p>No addresses saved</p>
                    <button onclick="dashboard.showAddressModal()" class="shop-btn">Add Address</button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.addresses.map(address => `
            <div class="address-card">
                <div class="address-header">
                    <h4>${address.title}</h4>
                    ${address.isDefault ? '<span class="default-badge">Default</span>' : ''}
                </div>
                <div class="address-details">
                    <p>${address.street}</p>
                    <p>${address.city}, ${address.state}</p>
                    <p>${address.postalCode ? address.postalCode + ', ' : ''}${address.country}</p>
                </div>
                <div class="address-actions">
                    <button onclick="dashboard.editAddress('${address.id}')" class="secondary-btn">Edit</button>
                    ${!address.isDefault ? '<button onclick="dashboard.deleteAddress(\'' + address.id + '\')" class="danger-btn">Delete</button>' : ''}
                </div>
            </div>
        `).join('');
    }

    // Load profile data
    loadProfile() {
        document.getElementById('profile-name').value = this.currentUser.fullName || '';
        document.getElementById('profile-email').value = this.currentUser.email || '';
        document.getElementById('profile-phone').value = this.currentUser.phone || '';
        document.getElementById('profile-birthday').value = this.currentUser.birthday || '';
    }

    // Load settings
    loadSettings() {
        document.getElementById('email-notifications').checked = this.userSettings.emailNotifications !== false;
        document.getElementById('sms-notifications').checked = this.userSettings.smsNotifications === true;
        document.getElementById('profile-public').checked = this.userSettings.profilePublic === true;
        document.getElementById('activity-tracking').checked = this.userSettings.activityTracking !== false;
    }

    // Handle profile update
    handleProfileUpdate(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const profileData = Object.fromEntries(formData);

        // Update current user data
        this.currentUser.fullName = profileData.fullName;
        this.currentUser.phone = profileData.phone;
        this.currentUser.birthday = profileData.birthday;

        // Update in localStorage
        localStorage.setItem('kod_current_user', JSON.stringify(this.currentUser));

        // Update user in users array
        const users = JSON.parse(localStorage.getItem('kod_users') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...profileData };
            localStorage.setItem('kod_users', JSON.stringify(users));
        }

        this.showMessage('Profile updated successfully!', 'success');
    }

    // Handle add address
    handleAddAddress(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const addressData = Object.fromEntries(formData);

        const newAddress = {
            id: `ADDR-${Date.now()}`,
            ...addressData,
            isDefault: addressData.isDefault === 'on'
        };

        // If this is set as default, remove default from others
        if (newAddress.isDefault) {
            this.addresses.forEach(addr => addr.isDefault = false);
        }

        this.addresses.push(newAddress);
        this.saveUserData();
        this.renderAddresses();
        
        // Close modal
        document.getElementById('address-modal').style.display = 'none';
        e.target.reset();

        this.showMessage('Address added successfully!', 'success');
    }

    // Handle password change
    handlePasswordChange(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const passwordData = Object.fromEntries(formData);

        // Validate current password (simplified)
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            this.showMessage('New passwords do not match!', 'error');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            this.showMessage('Password must be at least 8 characters long!', 'error');
            return;
        }

        // Update password (simplified - in real app, use proper authentication)
        this.showMessage('Password updated successfully!', 'success');
        
        // Close modal
        document.getElementById('password-modal').style.display = 'none';
        e.target.reset();
    }

    // Handle setting changes
    handleSettingChange(e) {
        const settingName = e.target.id;
        const settingValue = e.target.checked;

        this.userSettings[settingName] = settingValue;
        this.saveUserData();

        this.showMessage('Setting updated successfully!', 'success');
    }

    // Utility methods
    showAddressModal() {
        document.getElementById('address-modal').style.display = 'block';
    }

    showPasswordModal() {
        document.getElementById('password-modal').style.display = 'block';
    }

    filterOrders(status) {
        this.renderOrders(status);
    }

    addToCart(productId) {
        const favorite = this.favorites.find(f => f.id === productId);
        if (!favorite) return;

        const existingItem = this.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...favorite,
                quantity: 1,
                image: favorite.image || 'https://via.placeholder.com/100x100'
            });
        }

        this.saveUserData();
        this.updateQuickStats();
        this.showMessage('Item added to cart!', 'success');
    }

    removeFromFavorites(productId) {
        this.favorites = this.favorites.filter(f => f.id !== productId);
        this.saveUserData();
        this.updateQuickStats();
        this.renderFavorites();
        this.showMessage('Item removed from favorites!', 'success');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveUserData();
        this.updateQuickStats();
        this.renderCart();
        this.showMessage('Item removed from cart!', 'success');
    }

    updateCartQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveUserData();
            this.updateQuickStats();
            this.renderCart();
        }
    }

    clearCart() {
        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            this.saveUserData();
            this.updateQuickStats();
            this.renderCart();
            this.showMessage('Cart cleared!', 'success');
        }
    }

    clearFavorites() {
        if (confirm('Are you sure you want to clear all favorites?')) {
            this.favorites = [];
            this.saveUserData();
            this.updateQuickStats();
            this.renderFavorites();
            this.showMessage('Favorites cleared!', 'success');
        }
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showMessage('Your cart is empty!', 'error');
            return;
        }
        alert('Checkout functionality coming soon!');
    }

    trackOrder(orderId) {
        alert(`Order tracking for ${orderId} - Coming soon!`);
    }

    reorderItems(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        order.items.forEach(item => {
            const existingItem = this.cart.find(cartItem => cartItem.name === item.name);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                this.cart.push({
                    id: `PROD-${Date.now()}-${Math.random()}`,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: 'https://via.placeholder.com/100x100'
                });
            }
        });

        this.saveUserData();
        this.updateQuickStats();
        this.showMessage('Items added to cart!', 'success');
    }

    deleteAddress(addressId) {
        if (confirm('Are you sure you want to delete this address?')) {
            this.addresses = this.addresses.filter(addr => addr.id !== addressId);
            this.saveUserData();
            this.renderAddresses();
            this.showMessage('Address deleted!', 'success');
        }
    }

    editAddress(addressId) {
        alert('Edit address functionality coming soon!');
    }

    handleDeleteAccount() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            if (confirm('This will permanently delete all your data. Are you absolutely sure?')) {
                // Remove user data
                const userId = this.currentUser.id;
                localStorage.removeItem(`kod_orders_${userId}`);
                localStorage.removeItem(`kod_favorites_${userId}`);
                localStorage.removeItem(`kod_cart_${userId}`);
                localStorage.removeItem(`kod_addresses_${userId}`);
                localStorage.removeItem(`kod_settings_${userId}`);
                localStorage.removeItem('kod_current_user');

                // Remove from users array
                const users = JSON.parse(localStorage.getItem('kod_users') || '[]');
                const filteredUsers = users.filter(u => u.id !== userId);
                localStorage.setItem('kod_users', JSON.stringify(filteredUsers));

                alert('Account deleted successfully. You will be redirected to the homepage.');
                window.location.href = 'index.html';
            }
        }
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }

        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }

        return stars;
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showMessage(message, type = 'info') {
        // Create message element if it doesn't exist
        let messageElement = document.getElementById('dashboard-message');
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'dashboard-message';
            messageElement.className = 'dashboard-message';
            document.body.appendChild(messageElement);
        }

        messageElement.textContent = message;
        messageElement.className = `dashboard-message ${type} show`;

        setTimeout(() => {
            messageElement.classList.remove('show');
        }, 3000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new BuyerDashboard();
});

// Update auth.js to redirect to buyer dashboard
if (window.authSystem) {
    const originalGoToDashboard = window.authSystem.goToDashboard;
    window.authSystem.goToDashboard = function() {
        if (!this.currentUser) return;
        
        if (this.currentUser.role === 'buyer') {
            window.location.href = 'buyer-dashboard.html';
        } else if (this.currentUser.role === 'seller') {
            alert('Seller Dashboard - Coming Soon!\nHere you can manage your products, orders, and sales.');
        }
    };
}
