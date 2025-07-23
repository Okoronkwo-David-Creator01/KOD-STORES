// Advanced Search System for KOD STORES
class AdvancedSearch {
    constructor() {
        this.searchHistory = JSON.parse(localStorage.getItem('kod_search_history') || '[]');
        this.trendingSearches = [
            'wireless headphones', 'smartphone', 'laptop', 'winter jacket',
            'running shoes', 'coffee maker', 'tablet', 'gaming mouse',
            'bluetooth speaker', 'fitness tracker'
        ];
        this.init();
    }

    init() {
        this.enhanceSearchInputs();
        this.bindEvents();
    }

    enhanceSearchInputs() {
        const searchInputs = document.querySelectorAll('#search-input, .search-input');
        searchInputs.forEach(input => {
            this.createSearchDropdown(input);
            this.addSearchEnhancements(input);
        });
    }

    createSearchDropdown(input) {
        // Create search dropdown container
        const container = document.createElement('div');
        container.className = 'search-dropdown-container';
        
        const dropdown = document.createElement('div');
        dropdown.className = 'search-dropdown';
        dropdown.id = `search-dropdown-${input.id}`;
        
        container.appendChild(dropdown);
        
        // Insert after the input
        input.parentNode.insertBefore(container, input.nextSibling);
        
        // Position the dropdown
        this.positionDropdown(input, dropdown);
    }

    positionDropdown(input, dropdown) {
        const rect = input.getBoundingClientRect();
        dropdown.style.position = 'absolute';
        dropdown.style.top = '100%';
        dropdown.style.left = '0';
        dropdown.style.right = '0';
        dropdown.style.zIndex = '1000';
    }

    addSearchEnhancements(input) {
        // Add search icon and clear button
        const searchContainer = input.parentElement;
        searchContainer.classList.add('enhanced-search-container');
        
        // Add voice search button
        const voiceBtn = document.createElement('button');
        voiceBtn.className = 'voice-search-btn';
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceBtn.type = 'button';
        voiceBtn.title = 'Voice Search';
        
        // Add clear button
        const clearBtn = document.createElement('button');
        clearBtn.className = 'search-clear-btn';
        clearBtn.innerHTML = '<i class="fas fa-times"></i>';
        clearBtn.type = 'button';
        clearBtn.title = 'Clear Search';
        clearBtn.style.display = 'none';
        
        searchContainer.appendChild(clearBtn);
        searchContainer.appendChild(voiceBtn);
        
        // Bind clear functionality
        clearBtn.addEventListener('click', () => {
            input.value = '';
            this.hideDropdown(input);
            clearBtn.style.display = 'none';
            input.focus();
        });
        
        // Bind voice search
        voiceBtn.addEventListener('click', () => {
            this.startVoiceSearch(input);
        });
    }

    bindEvents() {
        const searchInputs = document.querySelectorAll('#search-input, .search-input');
        
        searchInputs.forEach(input => {
            // Input event for real-time search
            input.addEventListener('input', (e) => {
                this.handleSearchInput(e.target);
            });
            
            // Focus event to show suggestions
            input.addEventListener('focus', (e) => {
                this.showSearchSuggestions(e.target);
            });
            
            // Blur event to hide dropdown (with delay)
            input.addEventListener('blur', (e) => {
                setTimeout(() => {
                    this.hideDropdown(e.target);
                }, 150);
            });
            
            // Keydown for navigation
            input.addEventListener('keydown', (e) => {
                this.handleKeyNavigation(e, input);
            });
        });
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.enhanced-search-container')) {
                this.hideAllDropdowns();
            }
        });
    }

    handleSearchInput(input) {
        const query = input.value.trim();
        const clearBtn = input.parentElement.querySelector('.search-clear-btn');
        
        // Show/hide clear button
        clearBtn.style.display = query ? 'block' : 'none';
        
        if (query.length >= 2) {
            this.showSearchResults(input, query);
        } else if (query.length === 0) {
            this.showSearchSuggestions(input);
        } else {
            this.hideDropdown(input);
        }
    }

    showSearchSuggestions(input) {
        const dropdown = document.getElementById(`search-dropdown-${input.id}`);
        if (!dropdown) return;
        
        let suggestions = [];
        
        // Recent searches
        if (this.searchHistory.length > 0) {
            suggestions.push({
                type: 'section',
                title: 'Recent Searches'
            });
            
            this.searchHistory.slice(0, 5).forEach(search => {
                suggestions.push({
                    type: 'recent',
                    text: search.query,
                    icon: 'fas fa-history'
                });
            });
        }
        
        // Trending searches
        suggestions.push({
            type: 'section',
            title: 'Trending Searches'
        });
        
        this.trendingSearches.slice(0, 5).forEach(search => {
            suggestions.push({
                type: 'trending',
                text: search,
                icon: 'fas fa-fire'
            });
        });
        
        this.renderDropdown(dropdown, suggestions);
        this.showDropdown(input);
    }

    showSearchResults(input, query) {
        const dropdown = document.getElementById(`search-dropdown-${input.id}`);
        if (!dropdown) return;
        
        // Get products for search
        const products = this.getProductsForSearch();
        const results = this.searchProducts(products, query);
        
        let suggestions = [];
        
        // Search suggestions based on query
        const querySuggestions = this.generateQuerySuggestions(query);
        if (querySuggestions.length > 0) {
            suggestions.push({
                type: 'section',
                title: 'Search Suggestions'
            });
            
            querySuggestions.forEach(suggestion => {
                suggestions.push({
                    type: 'suggestion',
                    text: suggestion,
                    icon: 'fas fa-search'
                });
            });
        }
        
        // Product results
        if (results.length > 0) {
            suggestions.push({
                type: 'section',
                title: `Products (${results.length} found)`
            });
            
            results.slice(0, 5).forEach(product => {
                suggestions.push({
                    type: 'product',
                    product: product,
                    icon: 'fas fa-box'
                });
            });
            
            if (results.length > 5) {
                suggestions.push({
                    type: 'view-all',
                    text: `View all ${results.length} results`,
                    query: query
                });
            }
        }
        
        this.renderDropdown(dropdown, suggestions);
        this.showDropdown(input);
    }

    searchProducts(products, query) {
        const searchTerms = query.toLowerCase().split(' ');
        
        return products.filter(product => {
            const searchableText = [
                product.name,
                product.description,
                product.category,
                ...(product.tags || [])
            ].join(' ').toLowerCase();
            
            return searchTerms.every(term => 
                searchableText.includes(term)
            );
        }).sort((a, b) => {
            // Sort by relevance (name matches first)
            const aNameMatch = a.name.toLowerCase().includes(query.toLowerCase());
            const bNameMatch = b.name.toLowerCase().includes(query.toLowerCase());
            
            if (aNameMatch && !bNameMatch) return -1;
            if (!aNameMatch && bNameMatch) return 1;
            
            return b.rating - a.rating; // Then by rating
        });
    }

    generateQuerySuggestions(query) {
        const suggestions = [];
        const queryLower = query.toLowerCase();
        
        // Category suggestions
        const categories = ['electronics', 'clothing', 'books', 'home', 'sports', 'beauty'];
        categories.forEach(category => {
            if (category.includes(queryLower) || queryLower.includes(category)) {
                suggestions.push(`${query} in ${category}`);
            }
        });
        
        // Brand suggestions (mock data)
        const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG'];
        brands.forEach(brand => {
            if (brand.toLowerCase().includes(queryLower)) {
                suggestions.push(`${brand} ${query}`);
            }
        });
        
        // Popular modifiers
        const modifiers = ['best', 'cheap', 'wireless', 'portable', 'premium'];
        modifiers.forEach(modifier => {
            if (!queryLower.includes(modifier)) {
                suggestions.push(`${modifier} ${query}`);
            }
        });
        
        return suggestions.slice(0, 3);
    }

    renderDropdown(dropdown, suggestions) {
        dropdown.innerHTML = suggestions.map(item => {
            switch (item.type) {
                case 'section':
                    return `<div class="search-section">${item.title}</div>`;
                
                case 'recent':
                case 'trending':
                case 'suggestion':
                    return `
                        <div class="search-item" data-query="${item.text}">
                            <i class="${item.icon}"></i>
                            <span>${this.highlightQuery(item.text)}</span>
                        </div>
                    `;
                
                case 'product':
                    return `
                        <div class="search-product-item" data-product-id="${item.product.id}">
                            <img src="${item.product.image}" alt="${item.product.name}" class="search-product-image">
                            <div class="search-product-info">
                                <div class="search-product-name">${this.highlightQuery(item.product.name)}</div>
                                <div class="search-product-price">$${item.product.price.toFixed(2)}</div>
                                <div class="search-product-rating">
                                    ${'★'.repeat(Math.floor(item.product.rating))}
                                    <span>(${item.product.reviews || 0})</span>
                                </div>
                            </div>
                        </div>
                    `;
                
                case 'view-all':
                    return `
                        <div class="search-view-all" data-query="${item.query}">
                            <i class="fas fa-arrow-right"></i>
                            <span>${item.text}</span>
                        </div>
                    `;
                
                default:
                    return '';
            }
        }).join('');
        
        // Bind click events
        this.bindDropdownEvents(dropdown);
    }

    bindDropdownEvents(dropdown) {
        // Search items
        dropdown.querySelectorAll('.search-item').forEach(item => {
            item.addEventListener('click', () => {
                const query = item.dataset.query;
                this.performSearch(query);
            });
        });
        
        // Product items
        dropdown.querySelectorAll('.search-product-item').forEach(item => {
            item.addEventListener('click', () => {
                const productId = item.dataset.productId;
                window.location.href = `product-detail.html?id=${productId}`;
            });
        });
        
        // View all
        dropdown.querySelectorAll('.search-view-all').forEach(item => {
            item.addEventListener('click', () => {
                const query = item.dataset.query;
                this.performSearch(query);
            });
        });
    }

    highlightQuery(text, query = '') {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    performSearch(query) {
        // Add to search history
        this.addToHistory(query);
        
        // Redirect to shop with search query
        window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
    }

    addToHistory(query) {
        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(item => item.query !== query);
        
        // Add to beginning
        this.searchHistory.unshift({
            query: query,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 20 searches
        this.searchHistory = this.searchHistory.slice(0, 20);
        
        localStorage.setItem('kod_search_history', JSON.stringify(this.searchHistory));
    }

    showDropdown(input) {
        const dropdown = document.getElementById(`search-dropdown-${input.id}`);
        if (dropdown) {
            dropdown.classList.add('show');
        }
    }

    hideDropdown(input) {
        const dropdown = document.getElementById(`search-dropdown-${input.id}`);
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }

    hideAllDropdowns() {
        document.querySelectorAll('.search-dropdown').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }

    handleKeyNavigation(e, input) {
        const dropdown = document.getElementById(`search-dropdown-${input.id}`);
        if (!dropdown || !dropdown.classList.contains('show')) return;
        
        const items = dropdown.querySelectorAll('.search-item, .search-product-item, .search-view-all');
        if (items.length === 0) return;
        
        let currentIndex = -1;
        items.forEach((item, index) => {
            if (item.classList.contains('active')) {
                currentIndex = index;
            }
        });
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentIndex = (currentIndex + 1) % items.length;
                this.highlightItem(items, currentIndex);
                break;
            
            case 'ArrowUp':
                e.preventDefault();
                currentIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
                this.highlightItem(items, currentIndex);
                break;
            
            case 'Enter':
                e.preventDefault();
                if (currentIndex >= 0) {
                    items[currentIndex].click();
                }
                break;
            
            case 'Escape':
                this.hideDropdown(input);
                break;
        }
    }

    highlightItem(items, index) {
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    startVoiceSearch(input) {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            if (window.notificationSystem) {
                window.notificationSystem.showToast('Voice search not supported in this browser', 'error');
            }
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        const voiceBtn = input.parentElement.querySelector('.voice-search-btn');
        voiceBtn.classList.add('listening');
        voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            input.value = transcript;
            this.handleSearchInput(input);
            
            if (window.notificationSystem) {
                window.notificationSystem.showToast('Voice search completed', 'success');
            }
        };
        
        recognition.onerror = (event) => {
            if (window.notificationSystem) {
                window.notificationSystem.showToast('Voice search failed', 'error');
            }
        };
        
        recognition.onend = () => {
            voiceBtn.classList.remove('listening');
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        };
        
        recognition.start();
        
        if (window.notificationSystem) {
            window.notificationSystem.showToast('Listening... Speak now', 'info');
        }
    }

    getProductsForSearch() {
        // Get products from shopping system if available
        if (window.ShoppingSystem && window.shop && window.shop.products) {
            return window.shop.products;
        }
        
        // Fallback mock products for search
        return [];
    }
}

// Initialize advanced search
let advancedSearch;
document.addEventListener('DOMContentLoaded', () => {
    advancedSearch = new AdvancedSearch();
});
