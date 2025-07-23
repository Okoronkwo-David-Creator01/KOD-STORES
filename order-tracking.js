// Order Tracking System for KOD STORES
class OrderTrackingSystem {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('kod_orders') || '[]');
        this.orderStatuses = {
            'pending': {
                label: 'Order Placed',
                description: 'Your order has been received and is being processed',
                icon: 'fas fa-clock',
                color: '#ffc107'
            },
            'confirmed': {
                label: 'Order Confirmed',
                description: 'Your order has been confirmed and payment verified',
                icon: 'fas fa-check-circle',
                color: '#28a745'
            },
            'processing': {
                label: 'Processing',
                description: 'Your order is being prepared for shipment',
                icon: 'fas fa-cog',
                color: '#17a2b8'
            },
            'shipped': {
                label: 'Shipped',
                description: 'Your order is on its way to you',
                icon: 'fas fa-shipping-fast',
                color: '#007bff'
            },
            'out_for_delivery': {
                label: 'Out for Delivery',
                description: 'Your order is out for delivery and will arrive soon',
                icon: 'fas fa-truck',
                color: '#fd7e14'
            },
            'delivered': {
                label: 'Delivered',
                description: 'Your order has been successfully delivered',
                icon: 'fas fa-box-open',
                color: '#28a745'
            },
            'cancelled': {
                label: 'Cancelled',
                description: 'Your order has been cancelled',
                icon: 'fas fa-times-circle',
                color: '#dc3545'
            },
            'returned': {
                label: 'Returned',
                description: 'Your order has been returned',
                icon: 'fas fa-undo',
                color: '#6c757d'
            }
        };
        this.init();
    }

    init() {
        this.bindEvents();
        // Generate sample orders if none exist
        if (this.orders.length === 0) {
            this.generateSampleOrders();
        }
    }

    bindEvents() {
        // Track order form
        const trackForm = document.getElementById('track-order-form');
        if (trackForm) {
            trackForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const orderNumber = document.getElementById('order-number').value;
                this.trackOrder(orderNumber);
            });
        }
    }

    generateSampleOrders() {
        const currentUser = JSON.parse(localStorage.getItem('kod_current_user'));
        if (!currentUser) return;

        const sampleOrders = [
            {
                orderNumber: 'KOD-2024-001',
                userId: currentUser.id,
                customerEmail: currentUser.email,
                customerName: currentUser.fullName,
                status: 'delivered',
                orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                actualDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                items: [
                    { name: 'Premium Wireless Headphones', quantity: 1, price: 199.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100' }
                ],
                shipping: {
                    address: '123 Main St, City, State 12345',
                    method: 'Standard Shipping',
                    cost: 9.99,
                    trackingNumber: 'TRK123456789'
                },
                payment: {
                    method: 'Credit Card',
                    total: 209.98,
                    subtotal: 199.99,
                    tax: 15.99,
                    shipping: 9.99
                },
                timeline: [
                    { status: 'pending', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), note: 'Order placed successfully' },
                    { status: 'confirmed', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), note: 'Payment confirmed' },
                    { status: 'processing', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), note: 'Order is being prepared' },
                    { status: 'shipped', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), note: 'Package shipped via FedEx' },
                    { status: 'delivered', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), note: 'Package delivered successfully' }
                ]
            },
            {
                orderNumber: 'KOD-2024-002',
                userId: currentUser.id,
                customerEmail: currentUser.email,
                customerName: currentUser.fullName,
                status: 'shipped',
                orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                items: [
                    { name: 'Organic Cotton T-Shirt', quantity: 2, price: 29.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100' },
                    { name: 'JavaScript: The Complete Guide', quantity: 1, price: 45.99, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100' }
                ],
                shipping: {
                    address: '123 Main St, City, State 12345',
                    method: 'Express Shipping',
                    cost: 15.99,
                    trackingNumber: 'TRK987654321'
                },
                payment: {
                    method: 'PayPal',
                    total: 121.97,
                    subtotal: 105.97,
                    tax: 8.48,
                    shipping: 15.99
                },
                timeline: [
                    { status: 'pending', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), note: 'Order placed successfully' },
                    { status: 'confirmed', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), note: 'Payment confirmed via PayPal' },
                    { status: 'processing', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), note: 'Items picked and packed' },
                    { status: 'shipped', timestamp: new Date().toISOString(), note: 'Package shipped via UPS Express' }
                ]
            }
        ];

        this.orders = sampleOrders;
        this.saveOrders();
    }

    trackOrder(orderNumber) {
        const order = this.orders.find(o => o.orderNumber.toLowerCase() === orderNumber.toLowerCase());
        
        if (!order) {
            this.showError('Order not found. Please check your order number and try again.');
            return;
        }

        this.displayOrderTracking(order);
    }

    displayOrderTracking(order) {
        const container = document.getElementById('tracking-results');
        if (!container) return;

        container.innerHTML = `
            <div class="tracking-result">
                <div class="order-header">
                    <div class="order-info">
                        <h2>Order #${order.orderNumber}</h2>
                        <p class="order-date">Placed on ${this.formatDate(order.orderDate)}</p>
                        <div class="order-status">
                            <span class="status-badge ${order.status}">
                                <i class="${this.orderStatuses[order.status].icon}"></i>
                                ${this.orderStatuses[order.status].label}
                            </span>
                        </div>
                    </div>
                    <div class="order-actions">
                        <button class="secondary-btn" onclick="printOrder('${order.orderNumber}')">
                            <i class="fas fa-print"></i> Print
                        </button>
                        <button class="secondary-btn" onclick="shareTracking('${order.orderNumber}')">
                            <i class="fas fa-share"></i> Share
                        </button>
                    </div>
                </div>

                <div class="tracking-content">
                    <div class="tracking-progress">
                        <h3>Order Progress</h3>
                        <div class="progress-timeline">
                            ${this.generateTimelineHTML(order)}
                        </div>
                    </div>

                    <div class="tracking-details">
                        <div class="detail-section">
                            <h3><i class="fas fa-box"></i> Order Items</h3>
                            <div class="order-items">
                                ${order.items.map(item => `
                                    <div class="order-item">
                                        <img src="${item.image}" alt="${item.name}" class="item-image">
                                        <div class="item-details">
                                            <h4>${item.name}</h4>
                                            <p>Quantity: ${item.quantity}</p>
                                            <p class="item-price">$${item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="detail-section">
                            <h3><i class="fas fa-shipping-fast"></i> Shipping Information</h3>
                            <div class="shipping-info">
                                <p><strong>Address:</strong> ${order.shipping.address}</p>
                                <p><strong>Method:</strong> ${order.shipping.method}</p>
                                <p><strong>Tracking Number:</strong> 
                                    <span class="tracking-number">${order.shipping.trackingNumber}</span>
                                    <button class="copy-btn" onclick="copyTrackingNumber('${order.shipping.trackingNumber}')">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </p>
                                ${order.estimatedDelivery ? `
                                    <p><strong>Estimated Delivery:</strong> ${this.formatDate(order.estimatedDelivery)}</p>
                                ` : ''}
                                ${order.actualDelivery ? `
                                    <p><strong>Delivered On:</strong> ${this.formatDate(order.actualDelivery)}</p>
                                ` : ''}
                            </div>
                        </div>

                        <div class="detail-section">
                            <h3><i class="fas fa-credit-card"></i> Payment Summary</h3>
                            <div class="payment-summary">
                                <div class="summary-line">
                                    <span>Subtotal:</span>
                                    <span>$${order.payment.subtotal.toFixed(2)}</span>
                                </div>
                                <div class="summary-line">
                                    <span>Shipping:</span>
                                    <span>$${order.payment.shipping.toFixed(2)}</span>
                                </div>
                                <div class="summary-line">
                                    <span>Tax:</span>
                                    <span>$${order.payment.tax.toFixed(2)}</span>
                                </div>
                                <div class="summary-line total">
                                    <span><strong>Total:</strong></span>
                                    <span><strong>$${order.payment.total.toFixed(2)}</strong></span>
                                </div>
                                <p class="payment-method">Paid via ${order.payment.method}</p>
                            </div>
                        </div>
                    </div>
                </div>

                ${order.status !== 'delivered' && order.status !== 'cancelled' ? `
                    <div class="order-actions-footer">
                        <button class="danger-btn" onclick="cancelOrder('${order.orderNumber}')">
                            <i class="fas fa-times"></i> Cancel Order
                        </button>
                        <button class="secondary-btn" onclick="modifyOrder('${order.orderNumber}')">
                            <i class="fas fa-edit"></i> Modify Order
                        </button>
                    </div>
                ` : ''}
            </div>
        `;

        container.classList.remove('hidden');
        
        // Send notification about order tracking
        if (window.notificationSystem) {
            window.notificationSystem.showToast('Order details loaded successfully', 'success');
        }
    }

    generateTimelineHTML(order) {
        const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
        const currentStatusIndex = statuses.indexOf(order.status);
        
        return `
            <div class="timeline">
                ${statuses.map((status, index) => {
                    const statusInfo = this.orderStatuses[status];
                    const timelineItem = order.timeline.find(t => t.status === status);
                    const isCompleted = index <= currentStatusIndex && order.status !== 'cancelled';
                    const isCurrent = index === currentStatusIndex;
                    const isCancelled = order.status === 'cancelled' && status !== 'pending';
                    
                    if (isCancelled && !timelineItem) return '';
                    
                    return `
                        <div class="timeline-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isCancelled ? 'cancelled' : ''}">
                            <div class="timeline-marker">
                                <i class="${statusInfo.icon}"></i>
                            </div>
                            <div class="timeline-content">
                                <h4>${statusInfo.label}</h4>
                                <p>${statusInfo.description}</p>
                                ${timelineItem ? `
                                    <div class="timeline-meta">
                                        <span class="timeline-date">${this.formatDateTime(timelineItem.timestamp)}</span>
                                        ${timelineItem.note ? `<span class="timeline-note">${timelineItem.note}</span>` : ''}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    createOrder(orderData) {
        const orderNumber = `KOD-${new Date().getFullYear()}-${String(this.orders.length + 1).padStart(3, '0')}`;
        
        const order = {
            orderNumber,
            userId: orderData.userId,
            customerEmail: orderData.customerEmail,
            customerName: orderData.customerName,
            status: 'pending',
            orderDate: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            items: orderData.items,
            shipping: orderData.shipping,
            payment: orderData.payment,
            timeline: [
                {
                    status: 'pending',
                    timestamp: new Date().toISOString(),
                    note: 'Order placed successfully'
                }
            ]
        };

        this.orders.push(order);
        this.saveOrders();

        // Send notifications
        if (window.notificationSystem) {
            window.notificationSystem.orderPlaced(orderNumber);
        }

        return order;
    }

    updateOrderStatus(orderNumber, newStatus, note = '') {
        const order = this.orders.find(o => o.orderNumber === orderNumber);
        if (!order) return false;

        order.status = newStatus;
        order.timeline.push({
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: note
        });

        // Update delivery date if delivered
        if (newStatus === 'delivered') {
            order.actualDelivery = new Date().toISOString();
        }

        this.saveOrders();

        // Send notifications
        if (window.notificationSystem) {
            if (newStatus === 'shipped') {
                window.notificationSystem.orderShipped(orderNumber);
            } else if (newStatus === 'delivered') {
                window.notificationSystem.orderDelivered(orderNumber);
            }
        }

        return true;
    }

    getUserOrders(userId) {
        return this.orders.filter(order => order.userId === userId);
    }

    getAllOrders() {
        return this.orders;
    }

    cancelOrder(orderNumber) {
        const order = this.orders.find(o => o.orderNumber === orderNumber);
        if (!order) return false;

        if (['delivered', 'cancelled'].includes(order.status)) {
            if (window.notificationSystem) {
                window.notificationSystem.showToast('Cannot cancel this order', 'error');
            }
            return false;
        }

        if (confirm('Are you sure you want to cancel this order?')) {
            order.status = 'cancelled';
            order.timeline.push({
                status: 'cancelled',
                timestamp: new Date().toISOString(),
                note: 'Order cancelled by customer'
            });

            this.saveOrders();

            if (window.notificationSystem) {
                window.notificationSystem.showToast('Order cancelled successfully', 'info');
            }

            // Refresh the display
            this.displayOrderTracking(order);
            return true;
        }

        return false;
    }

    saveOrders() {
        localStorage.setItem('kod_orders', JSON.stringify(this.orders));
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatDateTime(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    showError(message) {
        const errorDiv = document.getElementById('tracking-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        } else if (window.notificationSystem) {
            window.notificationSystem.showToast(message, 'error');
        }
    }
}

// Global order tracking instance
let orderTracker;

// Initialize order tracking system
document.addEventListener('DOMContentLoaded', () => {
    orderTracker = new OrderTrackingSystem();
});

// Global functions for order tracking
function printOrder(orderNumber) {
    window.print();
}

function shareTracking(orderNumber) {
    const shareUrl = `${window.location.origin}/track-order.html?order=${orderNumber}`;
    
    if (navigator.share) {
        navigator.share({
            title: `Order Tracking - ${orderNumber}`,
            text: `Track your KOD STORES order ${orderNumber}`,
            url: shareUrl
        });
    } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
            if (window.notificationSystem) {
                window.notificationSystem.showToast('Tracking link copied to clipboard!', 'success');
            }
        });
    }
}

function copyTrackingNumber(trackingNumber) {
    navigator.clipboard.writeText(trackingNumber).then(() => {
        if (window.notificationSystem) {
            window.notificationSystem.showToast('Tracking number copied!', 'success');
        }
    });
}

function cancelOrder(orderNumber) {
    if (orderTracker) {
        orderTracker.cancelOrder(orderNumber);
    }
}

function modifyOrder(orderNumber) {
    if (window.notificationSystem) {
        window.notificationSystem.showToast('Order modification will be available soon', 'info');
    }
}
