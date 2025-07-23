// Notification System for KOD STORES
class NotificationSystem {
    constructor() {
        this.notifications = JSON.parse(localStorage.getItem('kod_notifications') || '[]');
        this.init();
    }

    init() {
        this.createNotificationContainer();
        this.bindEvents();
        this.loadNotifications();
    }

    createNotificationContainer() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        // Create notification bell for header
        if (!document.getElementById('notification-bell')) {
            const bell = document.createElement('div');
            bell.id = 'notification-bell';
            bell.className = 'notification-bell';
            bell.innerHTML = `
                <i class="fas fa-bell"></i>
                <span class="notification-count">0</span>
                <div class="notification-dropdown">
                    <div class="notification-header">
                        <h3>Notifications</h3>
                        <button id="mark-all-read">Mark all as read</button>
                    </div>
                    <div class="notification-list" id="notification-list">
                        <!-- Notifications will be loaded here -->
                    </div>
                    <div class="notification-footer">
                        <a href="#" id="view-all-notifications">View all notifications</a>
                    </div>
                </div>
            `;

            // Add to header if exists
            const header = document.getElementById('header');
            if (header) {
                const navbar = header.querySelector('#navbar');
                if (navbar) {
                    const bellLi = document.createElement('li');
                    bellLi.appendChild(bell);
                    navbar.appendChild(bellLi);
                }
            }
        }
    }

    bindEvents() {
        // Bell click to toggle dropdown
        const bell = document.getElementById('notification-bell');
        if (bell) {
            bell.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleNotificationDropdown();
            });
        }

        // Mark all as read
        const markAllRead = document.getElementById('mark-all-read');
        if (markAllRead) {
            markAllRead.addEventListener('click', () => {
                this.markAllAsRead();
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.notification-bell')) {
                this.closeNotificationDropdown();
            }
        });
    }

    // Show toast notification
    showToast(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notification-container');
        const toast = document.createElement('div');
        toast.className = `notification-toast ${type}`;
        
        const icon = this.getToastIcon(type);
        toast.innerHTML = `
            <div class="toast-content">
                <i class="${icon}"></i>
                <span class="toast-message">${message}</span>
                <button class="toast-close">&times;</button>
            </div>
            <div class="toast-progress"></div>
        `;

        container.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 100);

        // Progress bar animation
        const progress = toast.querySelector('.toast-progress');
        progress.style.animationDuration = `${duration}ms`;

        // Auto remove
        const timeoutId = setTimeout(() => {
            this.removeToast(toast);
        }, duration);

        // Manual close
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(timeoutId);
            this.removeToast(toast);
        });

        return toast;
    }

    removeToast(toast) {
        toast.classList.add('hide');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    getToastIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // Add notification to storage
    addNotification(notification) {
        const newNotification = {
            id: Date.now(),
            title: notification.title,
            message: notification.message,
            type: notification.type || 'info',
            timestamp: new Date().toISOString(),
            read: false,
            action: notification.action || null,
            ...notification
        };

        this.notifications.unshift(newNotification);
        
        // Keep only last 50 notifications
        this.notifications = this.notifications.slice(0, 50);
        
        localStorage.setItem('kod_notifications', JSON.stringify(this.notifications));
        this.updateNotificationCount();
        this.loadNotifications();

        // Show toast if not silent
        if (!notification.silent) {
            this.showToast(notification.message, notification.type);
        }

        return newNotification;
    }

    loadNotifications() {
        const list = document.getElementById('notification-list');
        if (!list) return;

        if (this.notifications.length === 0) {
            list.innerHTML = '<div class="no-notifications">No notifications yet</div>';
            return;
        }

        // Show recent 10 notifications in dropdown
        const recentNotifications = this.notifications.slice(0, 10);
        list.innerHTML = recentNotifications.map(notification => 
            this.createNotificationHTML(notification)
        ).join('');

        // Bind notification actions
        this.bindNotificationActions();
    }

    createNotificationHTML(notification) {
        const timeAgo = this.getTimeAgo(new Date(notification.timestamp));
        return `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
                <div class="notification-icon ${notification.type}">
                    <i class="${this.getToastIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <h4>${notification.title}</h4>
                    <p>${notification.message}</p>
                    <span class="notification-time">${timeAgo}</span>
                </div>
                <div class="notification-actions">
                    ${!notification.read ? '<button class="mark-read-btn" data-id="' + notification.id + '">Mark as read</button>' : ''}
                    ${notification.action ? '<button class="notification-action-btn" data-action="' + notification.action + '">View</button>' : ''}
                </div>
            </div>
        `;
    }

    bindNotificationActions() {
        // Mark individual notification as read
        document.querySelectorAll('.mark-read-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const notificationId = parseInt(e.target.dataset.id);
                this.markAsRead(notificationId);
            });
        });

        // Handle notification actions
        document.querySelectorAll('.notification-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleNotificationAction(action);
            });
        });
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            localStorage.setItem('kod_notifications', JSON.stringify(this.notifications));
            this.updateNotificationCount();
            this.loadNotifications();
        }
    }

    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        localStorage.setItem('kod_notifications', JSON.stringify(this.notifications));
        this.updateNotificationCount();
        this.loadNotifications();
        this.showToast('All notifications marked as read', 'success');
    }

    updateNotificationCount() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const countElement = document.querySelector('.notification-count');
        if (countElement) {
            countElement.textContent = unreadCount;
            countElement.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    toggleNotificationDropdown() {
        const dropdown = document.querySelector('.notification-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }

    closeNotificationDropdown() {
        const dropdown = document.querySelector('.notification-dropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }

    handleNotificationAction(action) {
        switch (action) {
            case 'view-order':
                window.location.href = 'buyer-dashboard.html#orders';
                break;
            case 'view-cart':
                window.location.href = 'cart.html';
                break;
            case 'view-product':
                // Would need product ID in action
                window.location.href = 'shop.html';
                break;
            default:
                console.log('Unknown notification action:', action);
        }
        this.closeNotificationDropdown();
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        
        return date.toLocaleDateString();
    }

    // Predefined notification types
    orderPlaced(orderNumber) {
        return this.addNotification({
            title: 'Order Placed',
            message: `Your order #${orderNumber} has been placed successfully!`,
            type: 'success',
            action: 'view-order'
        });
    }

    orderShipped(orderNumber) {
        return this.addNotification({
            title: 'Order Shipped',
            message: `Your order #${orderNumber} has been shipped and is on its way!`,
            type: 'info',
            action: 'view-order'
        });
    }

    orderDelivered(orderNumber) {
        return this.addNotification({
            title: 'Order Delivered',
            message: `Your order #${orderNumber} has been delivered successfully!`,
            type: 'success',
            action: 'view-order'
        });
    }

    productBackInStock(productName) {
        return this.addNotification({
            title: 'Back in Stock',
            message: `${productName} is now back in stock!`,
            type: 'info',
            action: 'view-product'
        });
    }

    priceDropAlert(productName, newPrice) {
        return this.addNotification({
            title: 'Price Drop Alert',
            message: `${productName} is now available for $${newPrice}!`,
            type: 'success',
            action: 'view-product'
        });
    }

    cartAbandoned() {
        return this.addNotification({
            title: 'Cart Reminder',
            message: 'You have items waiting in your cart. Complete your purchase!',
            type: 'warning',
            action: 'view-cart'
        });
    }

    welcomeMessage(userName) {
        return this.addNotification({
            title: 'Welcome to KOD STORES!',
            message: `Welcome ${userName}! Explore our amazing products and deals.`,
            type: 'success'
        });
    }
}

// Global notification instance
let notificationSystem;

// Initialize notification system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    notificationSystem = new NotificationSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationSystem;
}
