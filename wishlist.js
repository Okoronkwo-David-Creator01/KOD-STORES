// Wishlist System for KOD STORES
class WishlistSystem {
    constructor() {
        this.wishlist = JSON.parse(localStorage.getItem('kod_wishlist') || '[]');
        this.init();
    }

    init() {
        this.updateWishlistCount();
        this.bindWishlistEvents();
        this.createWishlistButton();
    }

    createWishlistButton() {
        // Add wishlist button to header if it doesn't exist
        const navbar = document.querySelector('#navbar');
        if (navbar && !document.getElementById('wishlist-btn')) {
            const wishlistLi = document.createElement('li');
            wishlistLi.innerHTML = `
                <a href="wishlist.html" class="wishlist-link" id="wishlist-btn">
                    <i class="fas fa-heart"></i> Wishlist 
                    <span id="wishlist-count" class="count-badge">0</span>
                </a>
            `;
            
            // Insert before cart link
            const cartLink = navbar.querySelector('.cart-link');
            if (cartLink) {
                navbar.insertBefore(wishlistLi, cartLink.parentElement);
            } else {
                navbar.appendChild(wishlistLi);
            }
        }
        
        this.updateWishlistCount();
    }

    bindWishlistEvents() {
        // Bind wishlist buttons that already exist
        document.addEventListener('click', (e) => {
            if (e.target.closest('.wishlist-btn') || e.target.closest('[data-wishlist-id]')) {
                e.preventDefault();
                const button = e.target.closest('.wishlist-btn') || e.target.closest('[data-wishlist-id]');
                const productId = parseInt(button.dataset.productId || button.dataset.wishlistId);
                
                if (productId) {
                    this.toggleWishlist(productId);
                }
            }
        });
    }

    toggleWishlist(productId) {
        const isInWishlist = this.isInWishlist(productId);
        
        if (isInWishlist) {
            this.removeFromWishlist(productId);
        } else {
            this.addToWishlist(productId);
        }
        
        // Update all wishlist buttons for this product
        this.updateWishlistButtons(productId);
    }

    addToWishlist(productId) {
        // Get product details
        const product = this.getProductById(productId);
        if (!product) {
            if (window.notificationSystem) {
                window.notificationSystem.showToast('Product not found', 'error');
            }
            return;
        }

        // Check if already in wishlist
        if (this.isInWishlist(productId)) {
            if (window.notificationSystem) {
                window.notificationSystem.showToast('Product already in wishlist', 'info');
            }
            return;
        }

        // Add to wishlist
        const wishlistItem = {
            productId: productId,
            addedAt: new Date().toISOString(),
            ...product
        };

        this.wishlist.push(wishlistItem);
        this.saveWishlist();
        this.updateWishlistCount();

        // Show notification
        if (window.notificationSystem) {
            window.notificationSystem.showToast(`${product.name} added to wishlist!`, 'success');
        }
    }

    removeFromWishlist(productId) {
        const product = this.wishlist.find(item => item.productId === productId);
        
        this.wishlist = this.wishlist.filter(item => item.productId !== productId);
        this.saveWishlist();
        this.updateWishlistCount();

        // Show notification
        if (window.notificationSystem && product) {
            window.notificationSystem.showToast(`${product.name} removed from wishlist`, 'info');
        }

        // If on wishlist page, refresh display
        if (window.location.pathname.includes('wishlist.html')) {
            this.displayWishlist();
        }
    }

    isInWishlist(productId) {
        return this.wishlist.some(item => item.productId === productId);
    }

    updateWishlistButtons(productId) {
        const buttons = document.querySelectorAll(`[data-product-id="${productId}"].wishlist-btn, [data-wishlist-id="${productId}"]`);
        const isInWishlist = this.isInWishlist(productId);
        
        buttons.forEach(button => {
            const icon = button.querySelector('i');
            if (icon) {
                if (isInWishlist) {
                    icon.className = 'fas fa-heart';
                    button.classList.add('active');
                    button.title = 'Remove from wishlist';
                } else {
                    icon.className = 'far fa-heart';
                    button.classList.remove('active');
                    button.title = 'Add to wishlist';
                }
            }
        });
    }

    updateWishlistCount() {
        const countElements = document.querySelectorAll('#wishlist-count, .wishlist-count');
        countElements.forEach(element => {
            element.textContent = this.wishlist.length;
            element.style.display = this.wishlist.length > 0 ? 'inline-block' : 'none';
        });
    }

    saveWishlist() {
        localStorage.setItem('kod_wishlist', JSON.stringify(this.wishlist));
    }

    getProductById(productId) {
        // Try to get from shopping system first
        if (window.shop && window.shop.products) {
            return window.shop.products.find(p => p.id === productId);
        }
        
        // Fallback: create basic product object
        return {
            id: productId,
            name: `Product ${productId}`,
            price: 0,
            image: 'https://via.placeholder.com/300x300?text=Product',
            description: 'Product description not available'
        };
    }

    // Display wishlist on wishlist page
    displayWishlist() {
        const wishlistContainer = document.getElementById('wishlist-items');
        if (!wishlistContainer) return;

        if (this.wishlist.length === 0) {
            wishlistContainer.innerHTML = `
                <div class="empty-wishlist">
                    <i class="fas fa-heart-broken"></i>
                    <h3>Your wishlist is empty</h3>
                    <p>Save items you love for later. All your favorites will appear here.</p>
                    <a href="shop.html" class="primary-btn">Start Shopping</a>
                </div>
            `;
            return;
        }

        wishlistContainer.innerHTML = this.wishlist.map(item => `
            <div class="wishlist-item" data-product-id="${item.productId}">
                <div class="wishlist-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    <div class="wishlist-item-overlay">
                        <button class="quick-view-btn" data-product-id="${item.productId}" title="Quick View">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="wishlist-item-info">
                    <div class="wishlist-item-category">${this.formatCategory(item.category || 'general')}</div>
                    <h3 class="wishlist-item-title">
                        <a href="product-detail.html?id=${item.productId}">${item.name}</a>
                    </h3>
                    <div class="wishlist-item-rating">
                        ${this.generateStars(item.rating || 0)}
                        <span class="rating-count">(${item.reviews || 0})</span>
                    </div>
                    <div class="wishlist-item-price">
                        <span class="current-price">$${(item.price || 0).toFixed(2)}</span>
                        ${item.originalPrice ? `<span class="original-price">$${item.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <div class="wishlist-item-stock">
                        ${(item.stock || 0) > 0 ? 
                            `<span class="in-stock">In Stock (${item.stock})</span>` : 
                            '<span class="out-of-stock">Out of Stock</span>'
                        }
                    </div>
                    <div class="wishlist-item-actions">
                        <button class="primary-btn add-to-cart-btn" data-product-id="${item.productId}" ${(item.stock || 0) === 0 ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="secondary-btn remove-from-wishlist-btn" data-product-id="${item.productId}">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                        <button class="secondary-btn share-btn" data-product-id="${item.productId}">
                            <i class="fas fa-share"></i> Share
                        </button>
                    </div>
                </div>
                <div class="wishlist-item-meta">
                    <span class="added-date">Added ${this.formatDate(item.addedAt)}</span>
                    ${item.originalPrice && item.price < item.originalPrice ? 
                        `<span class="price-drop">Price dropped!</span>` : ''
                    }
                </div>
            </div>
        `).join('');

        this.bindWishlistPageEvents();
    }

    bindWishlistPageEvents() {
        // Remove from wishlist buttons
        document.querySelectorAll('.remove-from-wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('[data-product-id]').dataset.productId);
                this.removeFromWishlist(productId);
            });
        });

        // Add to cart from wishlist
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('[data-product-id]').dataset.productId);
                if (window.shop) {
                    window.shop.addToCart(productId);
                }
            });
        });

        // Share buttons
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('[data-product-id]').dataset.productId);
                this.shareProduct(productId);
            });
        });

        // Quick view buttons
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                if (window.shop && window.shop.showQuickView) {
                    window.shop.showQuickView(productId);
                }
            });
        });
    }

    shareProduct(productId) {
        const product = this.wishlist.find(item => item.productId === productId);
        if (!product) return;

        const shareUrl = `${window.location.origin}/product-detail.html?id=${productId}`;
        const shareText = `Check out ${product.name} on KOD STORES!`;

        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: shareText,
                url: shareUrl
            }).catch(console.error);
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareUrl).then(() => {
                if (window.notificationSystem) {
                    window.notificationSystem.showToast('Product link copied to clipboard!', 'success');
                }
            }).catch(() => {
                // Final fallback: show share modal
                this.showShareModal(product, shareUrl);
            });
        }
    }

    showShareModal(product, shareUrl) {
        // Create share modal
        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-modal-content">
                <div class="share-modal-header">
                    <h3>Share ${product.name}</h3>
                    <button class="share-modal-close">&times;</button>
                </div>
                <div class="share-modal-body">
                    <div class="share-url">
                        <input type="text" value="${shareUrl}" readonly>
                        <button class="copy-url-btn">Copy</button>
                    </div>
                    <div class="share-buttons">
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" target="_blank" class="share-btn facebook">
                            <i class="fab fa-facebook"></i> Facebook
                        </a>
                        <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out ${product.name}`)}" target="_blank" class="share-btn twitter">
                            <i class="fab fa-twitter"></i> Twitter
                        </a>
                        <a href="https://wa.me/?text=${encodeURIComponent(`${product.name} - ${shareUrl}`)}" target="_blank" class="share-btn whatsapp">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Bind modal events
        modal.querySelector('.share-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('.copy-url-btn').addEventListener('click', () => {
            const input = modal.querySelector('input');
            input.select();
            document.execCommand('copy');
            if (window.notificationSystem) {
                window.notificationSystem.showToast('Link copied to clipboard!', 'success');
            }
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    formatCategory(category) {
        return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return '★'.repeat(fullStars) + 
               (hasHalfStar ? '☆' : '') + 
               '☆'.repeat(emptyStars);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        
        return date.toLocaleDateString();
    }

    // Wishlist management functions
    clearWishlist() {
        if (confirm('Are you sure you want to clear your entire wishlist?')) {
            this.wishlist = [];
            this.saveWishlist();
            this.updateWishlistCount();
            this.displayWishlist();
            
            if (window.notificationSystem) {
                window.notificationSystem.showToast('Wishlist cleared', 'info');
            }
        }
    }

    moveAllToCart() {
        if (this.wishlist.length === 0) {
            if (window.notificationSystem) {
                window.notificationSystem.showToast('Wishlist is empty', 'info');
            }
            return;
        }

        let addedCount = 0;
        this.wishlist.forEach(item => {
            if (item.stock > 0 && window.shop) {
                window.shop.addToCart(item.productId);
                addedCount++;
            }
        });

        if (addedCount > 0) {
            if (window.notificationSystem) {
                window.notificationSystem.showToast(`${addedCount} items moved to cart`, 'success');
            }
        }
    }

    exportWishlist() {
        if (this.wishlist.length === 0) {
            if (window.notificationSystem) {
                window.notificationSystem.showToast('Wishlist is empty', 'info');
            }
            return;
        }

        const csvContent = [
            ['Product Name', 'Price', 'Category', 'Added Date', 'Product URL'],
            ...this.wishlist.map(item => [
                item.name,
                item.price,
                item.category || 'General',
                new Date(item.addedAt).toLocaleDateString(),
                `${window.location.origin}/product-detail.html?id=${item.productId}`
            ])
        ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kod-stores-wishlist-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        if (window.notificationSystem) {
            window.notificationSystem.showToast('Wishlist exported successfully', 'success');
        }
    }
}

// Initialize wishlist system
let wishlistSystem;
document.addEventListener('DOMContentLoaded', () => {
    wishlistSystem = new WishlistSystem();
    
    // Initialize wishlist page if we're on it
    if (window.location.pathname.includes('wishlist.html')) {
        wishlistSystem.displayWishlist();
    }
});

// Global wishlist functions
function toggleWishlist(productId) {
    if (wishlistSystem) {
        wishlistSystem.toggleWishlist(productId);
    }
}

function clearWishlist() {
    if (wishlistSystem) {
        wishlistSystem.clearWishlist();
    }
}

function moveAllToCart() {
    if (wishlistSystem) {
        wishlistSystem.moveAllToCart();
    }
}

function exportWishlist() {
    if (wishlistSystem) {
        wishlistSystem.exportWishlist();
    }
}
