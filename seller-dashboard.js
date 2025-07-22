// Seller Dashboard JavaScript for KOD STORES
class SellerDashboard {
    constructor() {
        this.currentUser = null;
        this.products = [];
        this.orders = [];
        this.customers = [];
        this.storeSettings = {};
        this.analytics = {};
        this.init();
    }

    init() {
        this.checkSellerAuth();
        this.loadData();
        this.bindEvents();
        this.updateStats();
        this.loadDashboardData();
    }

    checkSellerAuth() {
        const user = JSON.parse(localStorage.getItem('kod_current_user'));
        if (!user || user.role !== 'seller') {
            alert('Access denied. Seller account required.');
            window.location.href = 'login.html';
            return;
        }
        this.currentUser = user;
        this.updateWelcomeMessage();
    }

    updateWelcomeMessage() {
        const welcomeMsg = document.getElementById('welcome-message');
        if (welcomeMsg && this.currentUser) {
            welcomeMsg.textContent = `Welcome back, ${this.currentUser.fullName}! Manage your store and track your performance.`;
        }
    }

    loadData() {
        // Load seller's products
        this.products = JSON.parse(localStorage.getItem(`kod_seller_products_${this.currentUser.id}`) || '[]');
        
        // Load seller's orders
        this.orders = JSON.parse(localStorage.getItem(`kod_seller_orders_${this.currentUser.id}`) || '[]');
        
        // Load customers
        this.customers = JSON.parse(localStorage.getItem(`kod_seller_customers_${this.currentUser.id}`) || '[]');
        
        // Load store settings
        this.storeSettings = JSON.parse(localStorage.getItem(`kod_store_settings_${this.currentUser.id}`) || '{}');
        
        // Initialize sample data if empty
        if (this.products.length === 0) {
            this.initializeSampleData();
        }
    }

    initializeSampleData() {
        // Sample products for demonstration
        const sampleProducts = [
            {
                id: 'prod_1',
                name: 'Wireless Bluetooth Headphones',
                description: 'High-quality wireless headphones with noise cancellation',
                price: 99.99,
                category: 'electronics',
                stock: 25,
                sku: 'WBH001',
                images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
                status: 'active',
                sales: 15,
                createdAt: new Date().toISOString()
            },
            {
                id: 'prod_2',
                name: 'Casual Cotton T-Shirt',
                description: 'Comfortable 100% cotton t-shirt in various colors',
                price: 24.99,
                category: 'fashion',
                stock: 50,
                sku: 'CCT002',
                images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
                status: 'active',
                sales: 8,
                createdAt: new Date().toISOString()
            },
            {
                id: 'prod_3',
                name: 'Smart Home Speaker',
                description: 'Voice-controlled smart speaker with AI assistant',
                price: 149.99,
                category: 'electronics',
                stock: 12,
                sku: 'SHS003',
                images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
                status: 'active',
                sales: 22,
                createdAt: new Date().toISOString()
            }
        ];

        // Sample orders
        const sampleOrders = [
            {
                id: 'order_1',
                customerName: 'John Smith',
                customerEmail: 'john@example.com',
                products: [{ id: 'prod_1', name: 'Wireless Bluetooth Headphones', quantity: 1, price: 99.99 }],
                total: 99.99,
                status: 'pending',
                orderDate: new Date().toISOString(),
                shippingAddress: '123 Main St, City, State 12345'
            },
            {
                id: 'order_2',
                customerName: 'Sarah Johnson',
                customerEmail: 'sarah@example.com',
                products: [{ id: 'prod_2', name: 'Casual Cotton T-Shirt', quantity: 2, price: 24.99 }],
                total: 49.98,
                status: 'shipped',
                orderDate: new Date(Date.now() - 86400000).toISOString(),
                shippingAddress: '456 Oak Ave, City, State 12345'
            }
        ];

        // Sample customers
        const sampleCustomers = [
            {
                id: 'cust_1',
                name: 'John Smith',
                email: 'john@example.com',
                totalOrders: 3,
                totalSpent: 249.97,
                lastOrder: new Date().toISOString()
            },
            {
                id: 'cust_2',
                name: 'Sarah Johnson',
                email: 'sarah@example.com',
                totalOrders: 1,
                totalSpent: 49.98,
                lastOrder: new Date(Date.now() - 86400000).toISOString()
            }
        ];

        this.products = sampleProducts;
        this.orders = sampleOrders;
        this.customers = sampleCustomers;
        this.saveData();
    }

    saveData() {
        localStorage.setItem(`kod_seller_products_${this.currentUser.id}`, JSON.stringify(this.products));
        localStorage.setItem(`kod_seller_orders_${this.currentUser.id}`, JSON.stringify(this.orders));
        localStorage.setItem(`kod_seller_customers_${this.currentUser.id}`, JSON.stringify(this.customers));
        localStorage.setItem(`kod_store_settings_${this.currentUser.id}`, JSON.stringify(this.storeSettings));
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(e.target.dataset.section);
            });
        });

        // Add product form
        const addProductForm = document.getElementById('add-product-form');
        if (addProductForm) {
            addProductForm.addEventListener('submit', (e) => this.handleAddProduct(e));
        }

        // Edit product form
        const editProductForm = document.getElementById('edit-product-form');
        if (editProductForm) {
            editProductForm.addEventListener('submit', (e) => this.handleEditProduct(e));
        }

        // Store settings forms
        const storeInfoForm = document.getElementById('store-info-form');
        if (storeInfoForm) {
            storeInfoForm.addEventListener('submit', (e) => this.handleStoreInfo(e));
        }

        // Profile form
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        }

        // Search and filter events
        this.bindSearchAndFilters();
    }

    bindSearchAndFilters() {
        // Product search
        const productSearch = document.getElementById('product-search');
        if (productSearch) {
            productSearch.addEventListener('input', () => this.filterProducts());
        }

        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterProducts());
        }

        // Status filter
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterProducts());
        }

        // Order status filter
        const orderStatusFilter = document.getElementById('order-status-filter');
        if (orderStatusFilter) {
            orderStatusFilter.addEventListener('change', () => this.filterOrders());
        }
    }

    switchSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show selected section
        const section = document.getElementById(sectionName);
        if (section) {
            section.classList.add('active');
        }

        // Add active class to clicked nav link
        const navLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (navLink) {
            navLink.classList.add('active');
        }

        // Load section-specific data
        this.loadSectionData(sectionName);
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'overview':
                this.loadOverviewData();
                break;
            case 'products':
                this.loadProductsData();
                break;
            case 'orders':
                this.loadOrdersData();
                break;
            case 'analytics':
                this.loadAnalyticsData();
                break;
            case 'customers':
                this.loadCustomersData();
                break;
            case 'inventory':
                this.loadInventoryData();
                break;
            case 'store-settings':
                this.loadStoreSettings();
                break;
            case 'profile':
                this.loadProfileData();
                break;
        }
    }

    loadDashboardData() {
        this.loadOverviewData();
        this.loadProductsData();
        this.loadOrdersData();
    }

    updateStats() {
        // Update dashboard stats
        document.getElementById('total-products').textContent = this.products.length;
        document.getElementById('total-orders').textContent = this.orders.length;
        
        const totalRevenue = this.orders.reduce((sum, order) => sum + order.total, 0);
        document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
        
        document.getElementById('total-customers').textContent = this.customers.length;
    }

    loadOverviewData() {
        this.loadRecentOrders();
        this.loadTopProducts();
        this.updateStats();
    }

    loadRecentOrders() {
        const recentOrdersContainer = document.getElementById('recent-orders');
        const recentOrders = this.orders.slice(0, 3);

        if (recentOrders.length === 0) {
            recentOrdersContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <p>No recent orders</p>
                </div>
            `;
            return;
        }

        recentOrdersContainer.innerHTML = recentOrders.map(order => `
            <div class="order-item">
                <div class="order-info">
                    <h4>Order #${order.id}</h4>
                    <p>${order.customerName} - $${order.total.toFixed(2)}</p>
                </div>
                <span class="status-badge ${order.status}">${order.status}</span>
            </div>
        `).join('');
    }

    loadTopProducts() {
        const topProductsContainer = document.getElementById('top-products');
        const topProducts = this.products
            .sort((a, b) => (b.sales || 0) - (a.sales || 0))
            .slice(0, 3);

        if (topProducts.length === 0) {
            topProductsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-boxes"></i>
                    <p>No products yet</p>
                </div>
            `;
            return;
        }

        topProductsContainer.innerHTML = topProducts.map(product => `
            <div class="product-item">
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p>$${product.price} - ${product.sales || 0} sales</p>
                </div>
                <span class="stock-info">${product.stock} in stock</span>
            </div>
        `).join('');
    }

    loadProductsData() {
        this.renderProducts(this.products);
    }

    renderProducts(products) {
        const productsGrid = document.getElementById('products-grid');
        
        if (products.length === 0) {
            productsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-boxes"></i>
                    <p>No products found</p>
                    <button class="primary-btn" onclick="openAddProductModal()">Add Your First Product</button>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.images?.[0] || 'https://via.placeholder.com/200'}" alt="${product.name}">
                    <div class="product-actions">
                        <button class="action-btn" onclick="editProduct('${product.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn danger" onclick="deleteProduct('${product.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="product-category">${product.category}</p>
                    <div class="product-details">
                        <span class="price">$${product.price}</span>
                        <span class="stock ${product.stock <= 5 ? 'low-stock' : ''}">${product.stock} in stock</span>
                    </div>
                    <div class="product-status">
                        <span class="status-badge ${product.status}">${product.status}</span>
                        <span class="sales-info">${product.sales || 0} sales</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    filterProducts() {
        const searchTerm = document.getElementById('product-search').value.toLowerCase();
        const categoryFilter = document.getElementById('category-filter').value;
        const statusFilter = document.getElementById('status-filter').value;

        const filteredProducts = this.products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                                product.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !categoryFilter || product.category === categoryFilter;
            const matchesStatus = !statusFilter || product.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        });

        this.renderProducts(filteredProducts);
    }

    loadOrdersData() {
        this.renderOrders(this.orders);
    }

    renderOrders(orders) {
        const ordersContainer = document.getElementById('orders-list');
        
        if (orders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <p>No orders found</p>
                </div>
            `;
            return;
        }

        ordersContainer.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <h3>Order #${order.id}</h3>
                    <span class="status-badge ${order.status}">${order.status}</span>
                </div>
                <div class="order-details">
                    <p><strong>Customer:</strong> ${order.customerName}</p>
                    <p><strong>Email:</strong> ${order.customerEmail}</p>
                    <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                </div>
                <div class="order-items">
                    <h4>Items:</h4>
                    ${order.products.map(item => `
                        <div class="order-item-detail">
                            <span>${item.name} (x${item.quantity})</span>
                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-actions">
                    <select onchange="updateOrderStatus('${order.id}', this.value)" class="status-select">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                    <button class="secondary-btn" onclick="viewOrderDetails('${order.id}')">View Details</button>
                </div>
            </div>
        `).join('');
    }

    filterOrders() {
        const statusFilter = document.getElementById('order-status-filter').value;
        
        const filteredOrders = statusFilter 
            ? this.orders.filter(order => order.status === statusFilter)
            : this.orders;

        this.renderOrders(filteredOrders);
    }

    loadCustomersData() {
        const customersContainer = document.getElementById('customers-list');
        
        if (this.customers.length === 0) {
            customersContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>No customers yet</p>
                </div>
            `;
            return;
        }

        customersContainer.innerHTML = this.customers.map(customer => `
            <div class="customer-card">
                <div class="customer-info">
                    <h4>${customer.name}</h4>
                    <p>${customer.email}</p>
                </div>
                <div class="customer-stats">
                    <div class="stat">
                        <span class="stat-label">Orders</span>
                        <span class="stat-value">${customer.totalOrders}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Total Spent</span>
                        <span class="stat-value">$${customer.totalSpent.toFixed(2)}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Last Order</span>
                        <span class="stat-value">${new Date(customer.lastOrder).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadInventoryData() {
        this.loadLowStockAlerts();
        this.loadOutOfStockAlerts();
        this.renderInventoryGrid();
    }

    loadLowStockAlerts() {
        const lowStockContainer = document.getElementById('low-stock-products');
        const lowStockProducts = this.products.filter(product => product.stock <= 5 && product.stock > 0);

        if (lowStockProducts.length === 0) {
            lowStockContainer.innerHTML = '<p>No low stock alerts</p>';
            return;
        }

        lowStockContainer.innerHTML = lowStockProducts.map(product => `
            <div class="alert-item">
                <span>${product.name}</span>
                <span class="stock-warning">${product.stock} left</span>
            </div>
        `).join('');
    }

    loadOutOfStockAlerts() {
        const outOfStockContainer = document.getElementById('out-of-stock-products');
        const outOfStockProducts = this.products.filter(product => product.stock === 0);

        if (outOfStockProducts.length === 0) {
            outOfStockContainer.innerHTML = '<p>No out of stock items</p>';
            return;
        }

        outOfStockContainer.innerHTML = outOfStockProducts.map(product => `
            <div class="alert-item">
                <span>${product.name}</span>
                <span class="out-of-stock">Out of Stock</span>
            </div>
        `).join('');
    }

    renderInventoryGrid() {
        const inventoryGrid = document.getElementById('inventory-grid');
        
        inventoryGrid.innerHTML = this.products.map(product => `
            <div class="inventory-item">
                <div class="inventory-info">
                    <h4>${product.name}</h4>
                    <p>SKU: ${product.sku || 'N/A'}</p>
                </div>
                <div class="inventory-stock">
                    <input type="number" value="${product.stock}" min="0" 
                           onchange="updateStock('${product.id}', this.value)" 
                           class="stock-input">
                    <span class="stock-status ${product.stock <= 5 ? 'low' : ''}">${product.stock <= 5 ? 'Low' : 'Normal'}</span>
                </div>
            </div>
        `).join('');
    }

    loadAnalyticsData() {
        // Update analytics stats
        document.getElementById('new-customers').textContent = this.customers.filter(c => 
            new Date(c.lastOrder).getMonth() === new Date().getMonth()
        ).length;

        document.getElementById('returning-customers').textContent = this.customers.filter(c => 
            c.totalOrders > 1
        ).length;

        const retentionRate = this.customers.length > 0 
            ? ((this.customers.filter(c => c.totalOrders > 1).length / this.customers.length) * 100).toFixed(1)
            : 0;
        document.getElementById('customer-retention').textContent = `${retentionRate}%`;

        // Load charts would go here (Chart.js implementation)
        this.loadAnalyticsCharts();
    }

    loadAnalyticsCharts() {
        // Placeholder for chart implementations
        // You would implement Chart.js charts here
        console.log('Analytics charts would be loaded here');
    }

    loadStoreSettings() {
        // Load store settings into forms
        if (this.storeSettings.storeName) {
            document.getElementById('store-name').value = this.storeSettings.storeName || '';
            document.getElementById('store-description').value = this.storeSettings.storeDescription || '';
            document.getElementById('store-logo').value = this.storeSettings.storeLogo || '';
            document.getElementById('store-banner').value = this.storeSettings.storeBanner || '';
        }
    }

    loadProfileData() {
        // Load current user data into profile form
        document.getElementById('profile-name').value = this.currentUser.fullName || '';
        document.getElementById('profile-email').value = this.currentUser.email || '';
        document.getElementById('profile-phone').value = this.storeSettings.phone || '';
        document.getElementById('profile-address').value = this.storeSettings.address || '';
    }

    // Product Management
    handleAddProduct(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const productData = Object.fromEntries(formData);

        const newProduct = {
            id: 'prod_' + Date.now(),
            name: productData.name,
            description: productData.description,
            price: parseFloat(productData.price),
            category: productData.category,
            stock: parseInt(productData.stock),
            sku: productData.sku,
            images: productData.images ? productData.images.split('\n').filter(url => url.trim()) : [],
            status: productData.status,
            sales: 0,
            createdAt: new Date().toISOString()
        };

        this.products.push(newProduct);
        this.saveData();
        this.updateStats();
        this.loadProductsData();
        this.closeAddProductModal();
        this.showNotification('Product added successfully!', 'success');
    }

    handleEditProduct(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const productData = Object.fromEntries(formData);

        const productIndex = this.products.findIndex(p => p.id === productData.id);
        if (productIndex !== -1) {
            this.products[productIndex] = {
                ...this.products[productIndex],
                name: productData.name,
                description: productData.description,
                price: parseFloat(productData.price),
                category: productData.category,
                stock: parseInt(productData.stock),
                sku: productData.sku,
                images: productData.images ? productData.images.split('\n').filter(url => url.trim()) : [],
                status: productData.status
            };

            this.saveData();
            this.updateStats();
            this.loadProductsData();
            this.closeEditProductModal();
            this.showNotification('Product updated successfully!', 'success');
        }
    }

    handleStoreInfo(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const storeData = Object.fromEntries(formData);

        this.storeSettings = {
            ...this.storeSettings,
            ...storeData
        };

        this.saveData();
        this.showNotification('Store settings saved successfully!', 'success');
    }

    handleProfileUpdate(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const profileData = Object.fromEntries(formData);

        // Update current user
        this.currentUser.fullName = profileData.fullName;
        this.currentUser.email = profileData.email;
        
        // Update in localStorage
        localStorage.setItem('kod_current_user', JSON.stringify(this.currentUser));
        
        // Update store settings
        this.storeSettings.phone = profileData.phone;
        this.storeSettings.address = profileData.address;
        this.saveData();

        this.showNotification('Profile updated successfully!', 'success');
    }

    // Utility functions for global access
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    closeAddProductModal() {
        document.getElementById('add-product-modal').style.display = 'none';
        document.getElementById('add-product-form').reset();
    }

    closeEditProductModal() {
        document.getElementById('edit-product-modal').style.display = 'none';
        document.getElementById('edit-product-form').reset();
    }
}

// Global functions for HTML onclick events
function openAddProductModal() {
    document.getElementById('add-product-modal').style.display = 'block';
}

function editProduct(productId) {
    const product = sellerDashboard.products.find(p => p.id === productId);
    if (product) {
        // Populate edit form
        document.getElementById('edit-product-id').value = product.id;
        document.getElementById('edit-product-name').value = product.name;
        document.getElementById('edit-product-description').value = product.description;
        document.getElementById('edit-product-price').value = product.price;
        document.getElementById('edit-product-category').value = product.category;
        document.getElementById('edit-product-stock').value = product.stock;
        document.getElementById('edit-product-sku').value = product.sku || '';
        document.getElementById('edit-product-images').value = product.images ? product.images.join('\n') : '';
        document.getElementById('edit-product-status').value = product.status;

        // Show modal
        document.getElementById('edit-product-modal').style.display = 'block';
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        const productIndex = sellerDashboard.products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            sellerDashboard.products.splice(productIndex, 1);
            sellerDashboard.saveData();
            sellerDashboard.updateStats();
            sellerDashboard.loadProductsData();
            sellerDashboard.showNotification('Product deleted successfully!', 'success');
        }
    }
}

function updateOrderStatus(orderId, newStatus) {
    const orderIndex = sellerDashboard.orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        sellerDashboard.orders[orderIndex].status = newStatus;
        sellerDashboard.saveData();
        sellerDashboard.showNotification(`Order status updated to ${newStatus}!`, 'success');
    }
}

function updateStock(productId, newStock) {
    const productIndex = sellerDashboard.products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        sellerDashboard.products[productIndex].stock = parseInt(newStock);
        sellerDashboard.saveData();
        sellerDashboard.loadInventoryData();
        sellerDashboard.showNotification('Stock updated successfully!', 'success');
    }
}

function switchSection(sectionName) {
    sellerDashboard.switchSection(sectionName);
}

function viewOrderDetails(orderId) {
    const order = sellerDashboard.orders.find(o => o.id === orderId);
    if (order) {
        alert(`Order Details:\n\nOrder ID: ${order.id}\nCustomer: ${order.customerName}\nEmail: ${order.customerEmail}\nTotal: $${order.total.toFixed(2)}\nStatus: ${order.status}\nShipping Address: ${order.shippingAddress}`);
    }
}

function exportInventory() {
    const inventoryData = sellerDashboard.products.map(product => ({
        Name: product.name,
        SKU: product.sku || 'N/A',
        Category: product.category,
        Price: product.price,
        Stock: product.stock,
        Status: product.status,
        Sales: product.sales || 0
    }));

    const csvContent = "data:text/csv;charset=utf-8," 
        + Object.keys(inventoryData[0]).join(",") + "\n"
        + inventoryData.map(row => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function updateAnalytics() {
    sellerDashboard.loadAnalyticsData();
    sellerDashboard.showNotification('Analytics updated!', 'success');
}

function changePassword() {
    const newPassword = prompt('Enter new password (min 8 characters):');
    if (newPassword && newPassword.length >= 8) {
        // In a real app, you'd hash the password and update it
        sellerDashboard.showNotification('Password changed successfully!', 'success');
    } else if (newPassword) {
        alert('Password must be at least 8 characters long.');
    }
}

function closeAddProductModal() {
    sellerDashboard.closeAddProductModal();
}

function closeEditProductModal() {
    sellerDashboard.closeEditProductModal();
}

// Initialize dashboard when DOM is loaded
let sellerDashboard;
document.addEventListener('DOMContentLoaded', () => {
    sellerDashboard = new SellerDashboard();
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    const addModal = document.getElementById('add-product-modal');
    const editModal = document.getElementById('edit-product-modal');
    
    if (e.target === addModal) {
        closeAddProductModal();
    }
    if (e.target === editModal) {
        closeEditProductModal();
    }
});
