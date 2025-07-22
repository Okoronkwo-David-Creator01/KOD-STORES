// Shopping System for KOD STORES
class ShoppingSystem {
  constructor() {
    this.products = [];
    this.cart = JSON.parse(localStorage.getItem("kod_cart") || "[]");
    this.wishlist = JSON.parse(localStorage.getItem("kod_wishlist") || "[]");
    this.recentlyViewed = JSON.parse(
      localStorage.getItem("kod_recently_viewed") || "[]"
    );
    this.currentPage = 1;
    this.productsPerPage = 12;
    this.currentFilters = {
      search: "",
      category: "",
      priceRange: "",
      rating: "",
      sort: "name",
    };
    this.init();
  }

  init() {
    this.initProducts();
    this.updateCartCount();
    this.bindEvents();

    // Initialize based on current page
    const currentPage = window.location.pathname.split("/").pop();
    switch (currentPage) {
      case "shop.html":
        this.initShopPage();
        break;
      case "product-detail.html":
        this.initProductDetailPage();
        break;
      case "cart.html":
        this.initCartPage();
        break;
      case "checkout.html":
        this.initCheckoutPage();
        break;
    }
  }

  // Initialize sample products
  initProducts() {
    this.products = [
      {
        id: 1,
        name: "Premium Wireless Headphones",
        category: "electronics",
        price: 199.99,
        originalPrice: 249.99,
        rating: 4.5,
        reviews: 128,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        images: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
        ],
        description:
          "High-quality wireless headphones with noise cancellation and premium sound quality.",
        stock: 50,
        sku: "WH-001",
        tags: ["wireless", "audio", "noise-cancellation"],
        specifications: {
          "Battery Life": "30 hours",
          "Driver Size": "40mm",
          "Frequency Response": "20Hz - 20kHz",
          Weight: "250g",
          Connectivity: "Bluetooth 5.0",
        },
        features: [
          "Active noise cancellation",
          "30-hour battery life",
          "Quick charge technology",
          "Premium build quality",
        ],
      },
      {
        id: 2,
        name: "Organic Cotton T-Shirt",
        category: "clothing",
        price: 29.99,
        rating: 4.2,
        reviews: 85,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
          "https://images.unsplash.com/photo-1503341338985-95702ff9ad22?w=400",
        ],
        description:
          "Comfortable organic cotton t-shirt perfect for everyday wear.",
        stock: 100,
        sku: "TS-002",
        tags: ["organic", "cotton", "casual"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["White", "Black", "Navy", "Gray"],
        specifications: {
          Material: "100% Organic Cotton",
          Fit: "Regular",
          Care: "Machine wash cold",
          Origin: "Made in USA",
        },
      },
      {
        id: 3,
        name: "JavaScript: The Complete Guide",
        category: "books",
        price: 45.99,
        rating: 4.8,
        reviews: 245,
        image:
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
        images: [
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        ],
        description:
          "Comprehensive guide to modern JavaScript programming with practical examples.",
        stock: 75,
        sku: "BK-003",
        tags: ["programming", "javascript", "education"],
        specifications: {
          Pages: "850",
          Publisher: "Tech Books Publishing",
          Edition: "3rd Edition",
          Language: "English",
          Format: "Paperback",
        },
      },
      {
        id: 4,
        name: "Smart Home Security Camera",
        category: "electronics",
        price: 89.99,
        originalPrice: 119.99,
        rating: 4.3,
        reviews: 167,
        image:
          "https://images.unsplash.com/photo-1558002038-bb4237b54708?w=400",
        images: [
          "https://images.unsplash.com/photo-1558002038-bb4237b54708?w=400",
        ],
        description:
          "HD security camera with night vision and smartphone app integration.",
        stock: 30,
        sku: "SC-004",
        tags: ["security", "smart-home", "wifi"],
        specifications: {
          Resolution: "1080p HD",
          "Night Vision": "Yes",
          Storage: "Cloud & Local",
          Connectivity: "WiFi",
          Power: "Battery/Wired",
        },
      },
      {
        id: 5,
        name: "Ceramic Plant Pot Set",
        category: "home",
        price: 34.99,
        rating: 4.6,
        reviews: 92,
        image:
          "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400",
        images: [
          "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400",
        ],
        description:
          "Beautiful set of 3 ceramic plant pots perfect for indoor gardening.",
        stock: 45,
        sku: "PP-005",
        tags: ["home", "garden", "ceramic"],
        specifications: {
          Material: "Ceramic",
          "Set Size": "3 pieces",
          Sizes: "Small, Medium, Large",
          Drainage: "Yes",
          Color: "White/Natural",
        },
      },
      {
        id: 6,
        name: "Yoga Exercise Mat",
        category: "sports",
        price: 39.99,
        rating: 4.4,
        reviews: 156,
        image:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
        images: [
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
        ],
        description:
          "Premium non-slip yoga mat with excellent cushioning and durability.",
        stock: 65,
        sku: "YM-006",
        tags: ["yoga", "fitness", "exercise"],
        colors: ["Purple", "Pink", "Blue", "Green"],
        specifications: {
          Material: "TPE",
          Thickness: "6mm",
          Dimensions: "183cm x 61cm",
          Weight: "0.9kg",
          "Non-slip": "Yes",
        },
      },
      {
        id: 7,
        name: "Natural Face Moisturizer",
        category: "beauty",
        price: 24.99,
        rating: 4.7,
        reviews: 203,
        image:
          "https://images.unsplash.com/photo-1556228578-dd6a4b6c3ea8?w=400",
        images: [
          "https://images.unsplash.com/photo-1556228578-dd6a4b6c3ea8?w=400",
        ],
        description:
          "Organic face moisturizer with natural ingredients for all skin types.",
        stock: 80,
        sku: "FM-007",
        tags: ["skincare", "organic", "moisturizer"],
        specifications: {
          Volume: "50ml",
          "Skin Type": "All types",
          Ingredients: "Natural/Organic",
          SPF: "15",
          "Cruelty Free": "Yes",
        },
      },
      {
        id: 8,
        name: "Bluetooth Portable Speaker",
        category: "electronics",
        price: 79.99,
        originalPrice: 99.99,
        rating: 4.1,
        reviews: 89,
        image:
          "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
        images: [
          "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
        ],
        description:
          "Waterproof Bluetooth speaker with powerful bass and long battery life.",
        stock: 40,
        sku: "BS-008",
        tags: ["bluetooth", "speaker", "waterproof"],
        specifications: {
          "Battery Life": "12 hours",
          Waterproof: "IPX7",
          Range: "10 meters",
          Power: "20W",
          Connectivity: "Bluetooth 5.0",
        },
      },
    ];

    // Add more products for pagination testing
    for (let i = 9; i <= 30; i++) {
      const categories = [
        "electronics",
        "clothing",
        "books",
        "home",
        "sports",
        "beauty",
      ];
      const category =
        categories[Math.floor(Math.random() * categories.length)];

      this.products.push({
        id: i,
        name: `Sample Product ${i}`,
        category: category,
        price: Math.floor(Math.random() * 200) + 20,
        rating: Math.floor(Math.random() * 2) + 3 + Math.random(),
        reviews: Math.floor(Math.random() * 200) + 10,
        image: `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=${i}`,
        images: [
          `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=${i}`,
        ],
        description: `This is a sample product description for product ${i}.`,
        stock: Math.floor(Math.random() * 100) + 10,
        sku: `SP-${String(i).padStart(3, "0")}`,
        tags: ["sample", "product", category],
        specifications: {
          Weight: `${Math.floor(Math.random() * 5) + 1}kg`,
          Color: "Various",
          Material: "Quality materials",
        },
      });
    }
  }

  // Bind event handlers
  bindEvents() {
    // Search functionality
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    if (searchInput) {
      searchInput.addEventListener("input", () => this.handleSearch());
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.handleSearch();
      });
    }
    if (searchBtn) {
      searchBtn.addEventListener("click", () => this.handleSearch());
    }

    // Filter controls
    ["category-filter", "price-filter", "rating-filter", "sort-select"].forEach(
      (id) => {
        const element = document.getElementById(id);
        if (element) {
          element.addEventListener("change", () => this.applyFilters());
        }
      }
    );

    // View toggle
    const gridView = document.getElementById("grid-view");
    const listView = document.getElementById("list-view");
    if (gridView)
      gridView.addEventListener("click", () => this.setViewMode("grid"));
    if (listView)
      listView.addEventListener("click", () => this.setViewMode("list"));

    // Cart functionality
    const clearCartBtn = document.getElementById("clear-cart-btn");
    if (clearCartBtn) {
      clearCartBtn.addEventListener("click", () => this.showClearCartModal());
    }

    // Checkout button
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        if (this.cart.length === 0) {
          alert("Your cart is empty!");
          return;
        }
        window.location.href = "checkout.html";
      });
    }

    // Quantity controls
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("qty-plus")) {
        this.updateQuantity(e.target.dataset.productId, 1);
      } else if (e.target.classList.contains("qty-minus")) {
        this.updateQuantity(e.target.dataset.productId, -1);
      } else if (e.target.classList.contains("remove-item-btn")) {
        this.showRemoveItemModal(e.target.dataset.productId);
      }
    });

    // Modal close events
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal")) {
        this.closeModal(e.target.id);
      } else if (e.target.classList.contains("close")) {
        this.closeModal(e.target.closest(".modal").id);
      }
    });
  }

  // Initialize shop page
  initShopPage() {
    this.loadProducts();
    this.loadRecentlyViewed();
  }

  // Initialize product detail page
  initProductDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get("id"));
    if (productId) {
      this.loadProductDetails(productId);
      this.loadRelatedProducts(productId);
      this.addToRecentlyViewed(productId);
    }
  }

  // Initialize cart page
  initCartPage() {
    this.loadCartItems();
    this.loadRecentlyViewed();
    this.loadRecommendedProducts();
  }

  // Initialize checkout page
  initCheckoutPage() {
    this.loadCheckoutItems();
    this.bindCheckoutEvents();
  }

  // Search functionality
  handleSearch() {
    const searchInput = document.getElementById("search-input");
    this.currentFilters.search = searchInput.value.toLowerCase();
    this.currentPage = 1;
    this.applyFilters();
  }

  // Apply filters and sorting
  applyFilters() {
    // Get filter values
    const categoryFilter = document.getElementById("category-filter");
    const priceFilter = document.getElementById("price-filter");
    const ratingFilter = document.getElementById("rating-filter");
    const sortSelect = document.getElementById("sort-select");

    if (categoryFilter) this.currentFilters.category = categoryFilter.value;
    if (priceFilter) this.currentFilters.priceRange = priceFilter.value;
    if (ratingFilter) this.currentFilters.rating = ratingFilter.value;
    if (sortSelect) this.currentFilters.sort = sortSelect.value;

    this.currentPage = 1;
    this.loadProducts();
  }

  // Filter products based on current filters
  filterProducts() {
    let filtered = [...this.products];

    // Search filter
    if (this.currentFilters.search) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(this.currentFilters.search) ||
          product.description
            .toLowerCase()
            .includes(this.currentFilters.search) ||
          product.tags.some((tag) =>
            tag.toLowerCase().includes(this.currentFilters.search)
          )
      );
    }

    // Category filter
    if (this.currentFilters.category) {
      filtered = filtered.filter(
        (product) => product.category === this.currentFilters.category
      );
    }

    // Price filter
    if (this.currentFilters.priceRange) {
      const [min, max] = this.currentFilters.priceRange
        .split("-")
        .map((p) => (p === "" ? Infinity : parseFloat(p.replace("+", ""))));
      filtered = filtered.filter((product) => {
        if (max === Infinity) return product.price >= min;
        return product.price >= min && product.price <= max;
      });
    }

    // Rating filter
    if (this.currentFilters.rating) {
      const minRating = parseFloat(this.currentFilters.rating.replace("+", ""));
      filtered = filtered.filter((product) => product.rating >= minRating);
    }

    // Sort products
    this.sortProducts(filtered);

    return filtered;
  }

  // Sort products
  sortProducts(products) {
    switch (this.currentFilters.sort) {
      case "price-low":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        products.sort((a, b) => b.id - a.id);
        break;
      default:
        products.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  // Load and display products
  loadProducts() {
    const filteredProducts = this.filterProducts();
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    const pageProducts = filteredProducts.slice(startIndex, endIndex);

    this.displayProducts(pageProducts);
    this.updateResultsInfo(filteredProducts.length);
    this.generatePagination(filteredProducts.length);
  }

  // Display products grid
  displayProducts(products) {
    const productsGrid = document.getElementById("products-grid");
    const noResults = document.getElementById("no-results");

    if (!productsGrid) return;

    if (products.length === 0) {
      productsGrid.style.display = "none";
      if (noResults) noResults.style.display = "block";
      return;
    }

    if (noResults) noResults.style.display = "none";
    productsGrid.style.display = "grid";
    productsGrid.innerHTML = products
      .map((product) => this.createProductCard(product))
      .join("");

    // Add event listeners to product cards
    this.bindProductCardEvents();
  }

  // Create product card HTML
  createProductCard(product) {
    const discountPercentage = product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

    return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${
      product.name
    }" loading="lazy">
                    ${
                      discountPercentage > 0
                        ? `<span class="discount-badge">${discountPercentage}% OFF</span>`
                        : ""
                    }
                    <div class="product-actions">
                    <button class="action-btn add-to-cart-btn-overlay" data-product-id="${
                    product.id
                    }" title="Add to Cart" ${product.stock === 0 ? "disabled" : ""}>
                    <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="action-btn wishlist-btn" data-product-id="${
                    product.id
                    }" title="Add to Wishlist">
                    <i class="far fa-heart"></i>
                    </button>
                    <button class="action-btn quick-view-btn" data-product-id="${
                    product.id
                    }" title="Quick View">
                    <i class="fas fa-eye"></i>
                    </button>
                        <button class="action-btn compare-btn" data-product-id="${
                          product.id
                        }" title="Compare">
                            <i class="fas fa-balance-scale"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">${this.formatCategory(
                      product.category
                    )}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-rating">
                        ${this.generateStars(product.rating)}
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(
                          2
                        )}</span>
                        ${
                          product.originalPrice
                            ? `<span class="original-price">$${product.originalPrice.toFixed(
                                2
                              )}</span>`
                            : ""
                        }
                    </div>
                    <div class="product-stock">
                        ${
                          product.stock > 0
                            ? `<span class="in-stock">In Stock (${product.stock})</span>`
                            : '<span class="out-of-stock">Out of Stock</span>'
                        }
                    </div>
                    <div class="product-buttons">
                        <a href="product-detail.html?id=${
                          product.id
                        }" class="view-details-btn main-details-btn">View Details</a>
                    </div>
                </div>
            </div>
        `;
  }

  // Bind events to product cards
  bindProductCardEvents() {
    // Add to cart buttons
    document.querySelectorAll(".add-to-cart-btn, .add-to-cart-btn-overlay").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = parseInt(btn.dataset.productId);
        this.addToCart(productId);
      });
    });

    // Wishlist buttons
    document.querySelectorAll(".wishlist-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = parseInt(btn.dataset.productId);
        this.toggleWishlist(productId);
      });
    });

    // Quick view buttons
    document.querySelectorAll(".quick-view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = parseInt(btn.dataset.productId);
        this.showQuickView(productId);
      });
    });
  }

  // Load product details for product detail page
  loadProductDetails(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (!product) {
      window.location.href = "shop.html";
      return;
    }

    // Update page title and breadcrumb
    document.title = `${product.name} - KOD STORES`;
    const breadcrumbProduct = document.getElementById("breadcrumb-product");
    if (breadcrumbProduct) breadcrumbProduct.textContent = product.name;

    // Load product images
    this.loadProductImages(product);

    // Load product information
    this.loadProductInfo(product);

    // Load product tabs
    this.loadProductTabs(product);

    // Bind product detail events
    this.bindProductDetailEvents(product);
  }

  // Load product images
  loadProductImages(product) {
    const mainImage = document.getElementById("main-product-image");
    const thumbnailImages = document.getElementById("thumbnail-images");

    if (mainImage) {
      mainImage.src = product.images[0];
      mainImage.alt = product.name;
    }

    if (thumbnailImages && product.images.length > 1) {
      thumbnailImages.innerHTML = product.images
        .map(
          (img, index) => `
                <img src="${img}" alt="${product.name}" class="thumbnail ${
            index === 0 ? "active" : ""
          }" 
                     onclick="switchMainImage('${img}', this)">
            `
        )
        .join("");
    }
  }

  // Load product information
  loadProductInfo(product) {
    // Product title and rating
    const productTitle = document.getElementById("product-title");
    const productStars = document.getElementById("product-stars");
    const ratingText = document.getElementById("rating-text");

    if (productTitle) productTitle.textContent = product.name;
    if (productStars)
      productStars.innerHTML = this.generateStars(product.rating);
    if (ratingText) ratingText.textContent = `(${product.reviews} reviews)`;

    // Product pricing
    const currentPrice = document.getElementById("current-price");
    const originalPrice = document.getElementById("original-price");
    const discountBadge = document.getElementById("discount-badge");

    if (currentPrice) currentPrice.textContent = `$${product.price.toFixed(2)}`;

    if (product.originalPrice && originalPrice && discountBadge) {
      originalPrice.textContent = `$${product.originalPrice.toFixed(2)}`;
      originalPrice.style.display = "inline";

      const discount = Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      );
      discountBadge.textContent = `${discount}% OFF`;
      discountBadge.style.display = "inline";
    }

    // Product description
    const productDescription = document.getElementById("product-description");
    if (productDescription)
      productDescription.textContent = product.description;

    // Product options (sizes, colors)
    this.loadProductOptions(product);

    // Product meta
    this.loadProductMeta(product);

    // Stock information
    const stockInfo = document.getElementById("stock-info");
    if (stockInfo) {
      if (product.stock > 0) {
        stockInfo.textContent = `In Stock (${product.stock} available)`;
        stockInfo.className = "stock-info in-stock";
      } else {
        stockInfo.textContent = "Out of Stock";
        stockInfo.className = "stock-info out-of-stock";
      }
    }
  }

  // Load product options (sizes, colors)
  loadProductOptions(product) {
    // Size options
    if (product.sizes) {
      const sizeOptions = document.getElementById("size-options");
      if (sizeOptions) {
        sizeOptions.style.display = "block";
        const sizeSelector = sizeOptions.querySelector(".size-selector");
        sizeSelector.innerHTML = product.sizes
          .map(
            (size) => `
                    <button class="size-option" data-size="${size}">${size}</button>
                `
          )
          .join("");
      }
    }

    // Color options
    if (product.colors) {
      const colorOptions = document.getElementById("color-options");
      if (colorOptions) {
        colorOptions.style.display = "block";
        const colorSelector = colorOptions.querySelector(".color-selector");
        colorSelector.innerHTML = product.colors
          .map(
            (color) => `
                    <button class="color-option" data-color="${color}" title="${color}">
                        <span class="color-swatch" style="background-color: ${this.getColorCode(
                          color
                        )}"></span>
                        ${color}
                    </button>
                `
          )
          .join("");
      }
    }
  }

  // Load product meta information
  loadProductMeta(product) {
    const productSku = document.getElementById("product-sku");
    const productCategory = document.getElementById("product-category");
    const productTags = document.getElementById("product-tags");

    if (productSku) productSku.textContent = product.sku;
    if (productCategory)
      productCategory.textContent = this.formatCategory(product.category);
    if (productTags) productTags.textContent = product.tags.join(", ");
  }

  // Load product tabs content
  loadProductTabs(product) {
    // Detailed description
    const detailedDescription = document.getElementById("detailed-description");
    if (detailedDescription) {
      detailedDescription.innerHTML = `
                <p>${product.description}</p>
                ${
                  product.features
                    ? `
                    <h4>Key Features:</h4>
                    <ul>
                        ${product.features
                          .map((feature) => `<li>${feature}</li>`)
                          .join("")}
                    </ul>
                `
                    : ""
                }
            `;
    }

    // Specifications
    const productSpecifications = document.getElementById(
      "product-specifications"
    );
    if (productSpecifications && product.specifications) {
      productSpecifications.innerHTML = `
                <table class="specifications-table">
                    ${Object.entries(product.specifications)
                      .map(
                        ([key, value]) => `
                        <tr>
                            <td><strong>${key}:</strong></td>
                            <td>${value}</td>
                        </tr>
                    `
                      )
                      .join("")}
                </table>
            `;
    }

    // Reviews (mock data)
    this.loadProductReviews(product);

    // Bind tab events
    this.bindTabEvents();
  }

  // Load product reviews
  loadProductReviews(product) {
    // Mock review data
    const reviews = this.generateMockReviews(product);

    // Update average rating
    const avgRating = document.getElementById("avg-rating");
    const avgRatingStars = document.getElementById("avg-rating-stars");
    const totalReviews = document.getElementById("total-reviews");

    if (avgRating) avgRating.textContent = product.rating.toFixed(1);
    if (avgRatingStars)
      avgRatingStars.innerHTML = this.generateStars(product.rating);
    if (totalReviews) totalReviews.textContent = `${product.reviews} reviews`;

    // Rating breakdown
    const ratingBreakdown = document.getElementById("rating-breakdown");
    if (ratingBreakdown) {
      ratingBreakdown.innerHTML = this.generateRatingBreakdown(reviews);
    }

    // Reviews list
    const reviewsList = document.getElementById("reviews-list");
    if (reviewsList) {
      reviewsList.innerHTML = reviews
        .map((review) => this.createReviewHTML(review))
        .join("");
    }
  }

  // Generate mock reviews
  generateMockReviews(product) {
    const reviews = [];
    const reviewCount = Math.min(product.reviews, 10); // Show max 10 reviews

    for (let i = 0; i < reviewCount; i++) {
      reviews.push({
        id: i + 1,
        author: `Customer ${i + 1}`,
        rating: Math.floor(Math.random() * 2) + 3 + Math.random(),
        title: `Great product ${i + 1}`,
        content: `This is a sample review for ${product.name}. The product quality is excellent and I would recommend it to others.`,
        date: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        verified: Math.random() > 0.3,
      });
    }

    return reviews;
  }

  // Create review HTML
  createReviewHTML(review) {
    return `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <strong>${review.author}</strong>
                        ${
                          review.verified
                            ? '<span class="verified-badge">Verified Purchase</span>'
                            : ""
                        }
                    </div>
                    <div class="review-date">${review.date}</div>
                </div>
                <div class="review-rating">
                    ${this.generateStars(review.rating)}
                </div>
                <h4 class="review-title">${review.title}</h4>
                <p class="review-content">${review.content}</p>
                <div class="review-actions">
                    <button class="helpful-btn">Helpful (${Math.floor(
                      Math.random() * 10
                    )})</button>
                </div>
            </div>
        `;
  }

  // Generate rating breakdown
  generateRatingBreakdown(reviews) {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      const rating = Math.floor(review.rating);
      breakdown[rating]++;
    });

    const total = reviews.length;
    return Object.entries(breakdown)
      .reverse()
      .map(([rating, count]) => {
        const percentage = total > 0 ? (count / total) * 100 : 0;
        return `
                <div class="rating-bar">
                    <span class="rating-label">${rating} stars</span>
                    <div class="rating-progress">
                        <div class="rating-fill" style="width: ${percentage}%"></div>
                    </div>
                    <span class="rating-count">${count}</span>
                </div>
            `;
      })
      .join("");
  }

  // Bind product detail events
  bindProductDetailEvents(product) {
    // Quantity controls
    const qtyMinus = document.getElementById("qty-minus");
    const qtyPlus = document.getElementById("qty-plus");
    const quantity = document.getElementById("quantity");

    if (qtyMinus) {
      qtyMinus.addEventListener("click", () => {
        const current = parseInt(quantity.value);
        if (current > 1) quantity.value = current - 1;
      });
    }

    if (qtyPlus) {
      qtyPlus.addEventListener("click", () => {
        const current = parseInt(quantity.value);
        const max = Math.min(10, product.stock);
        if (current < max) quantity.value = current + 1;
      });
    }

    // Add to cart
    const addToCartBtn = document.getElementById("add-to-cart-btn");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        const qty = parseInt(quantity.value);
        this.addToCart(product.id, qty);
        this.showModal("success-modal");
      });
    }

    // Wishlist
    const wishlistBtn = document.getElementById("wishlist-btn");
    if (wishlistBtn) {
      wishlistBtn.addEventListener("click", () => {
        this.toggleWishlist(product.id);
      });
    }

    // Buy now
    const buyNowBtn = document.getElementById("buy-now-btn");
    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", () => {
        const qty = parseInt(quantity.value);
        this.addToCart(product.id, qty);
        window.location.href = "checkout.html";
      });
    }

    // Size and color selection
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("size-option")) {
        document
          .querySelectorAll(".size-option")
          .forEach((btn) => btn.classList.remove("selected"));
        e.target.classList.add("selected");
      } else if (e.target.classList.contains("color-option")) {
        document
          .querySelectorAll(".color-option")
          .forEach((btn) => btn.classList.remove("selected"));
        e.target.classList.add("selected");
      }
    });

    // Review form
    const reviewForm = document.getElementById("review-form");
    if (reviewForm) {
      reviewForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.submitReview(product.id);
      });
    }

    // Star rating input
    document.querySelectorAll("#star-rating span").forEach((star) => {
      star.addEventListener("click", () => {
        const rating = star.dataset.rating;
        document.querySelectorAll("#star-rating span").forEach((s, index) => {
          s.classList.toggle("active", index < rating);
        });
      });
    });
  }

  // Bind tab events
  bindTabEvents() {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabName = btn.dataset.tab;

        // Update active tab button
        document
          .querySelectorAll(".tab-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Update active tab content
        document
          .querySelectorAll(".tab-pane")
          .forEach((pane) => pane.classList.remove("active"));
        document.getElementById(`${tabName}-tab`).classList.add("active");
      });
    });
  }

  // Load related products
  loadRelatedProducts(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (!product) return;

    const related = this.products
      .filter((p) => p.id !== productId && p.category === product.category)
      .slice(0, 4);

    const relatedGrid = document.getElementById("related-products-grid");
    if (relatedGrid) {
      relatedGrid.innerHTML = related
        .map((p) => this.createProductCard(p))
        .join("");
      this.bindProductCardEvents();
    }
  }

  // Cart functionality
  addToCart(productId, quantity = 1) {
    const product = this.products.find((p) => p.id === productId);
    if (!product) return;

    const existingItem = this.cart.find((item) => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        productId: productId,
        quantity: quantity,
        selectedSize: null,
        selectedColor: null,
        addedAt: new Date().toISOString(),
      });
    }

    this.saveCart();
    this.updateCartCount();
    this.showSuccessMessage("Product added to cart!");
  }

  // Update cart item quantity
  updateQuantity(productId, change) {
    const item = this.cart.find(
      (item) => item.productId === parseInt(productId)
    );
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
      this.removeFromCart(productId);
    } else {
      this.saveCart();
      this.updateCartDisplay();
    }
  }

  // Remove item from cart
  removeFromCart(productId) {
    this.cart = this.cart.filter(
      (item) => item.productId !== parseInt(productId)
    );
    this.saveCart();
    this.updateCartDisplay();
    this.updateCartCount();
  }

  // Clear entire cart
  clearCart() {
    this.cart = [];
    this.saveCart();
    this.updateCartDisplay();
    this.updateCartCount();
  }

  // Save cart to localStorage
  saveCart() {
    localStorage.setItem("kod_cart", JSON.stringify(this.cart));
  }

  // Update cart count in navigation
  updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
      const totalItems = this.cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      cartCount.textContent = totalItems;
    }
  }

  // Load cart items for cart page
  loadCartItems() {
    const cartItems = document.getElementById("cart-items");
    const emptyCart = document.getElementById("empty-cart");

    if (this.cart.length === 0) {
      if (cartItems) cartItems.style.display = "none";
      if (emptyCart) emptyCart.style.display = "block";
      return;
    }

    if (emptyCart) emptyCart.style.display = "none";
    if (cartItems) {
      cartItems.style.display = "block";
      cartItems.innerHTML = this.cart
        .map((item) => this.createCartItemHTML(item))
        .join("");
    }

    this.updateCartSummary();
    this.bindCartEvents();
  }

  // Create cart item HTML
  createCartItemHTML(cartItem) {
    const product = this.products.find((p) => p.id === cartItem.productId);
    if (!product) return "";

    const itemTotal = product.price * cartItem.quantity;

    return `
            <div class="cart-item" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <div class="cart-item-info">
                    <h4><a href="product-detail.html?id=${product.id}">${
      product.name
    }</a></h4>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <p class="sku">SKU: ${product.sku}</p>
                </div>
                <div class="quantity-controls">
                    <button class="qty-minus" data-product-id="${
                      product.id
                    }">-</button>
                    <span class="quantity">${cartItem.quantity}</span>
                    <button class="qty-plus" data-product-id="${
                      product.id
                    }">+</button>
                </div>
                <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                <div class="cart-item-actions">
                    <button class="save-for-later-btn" data-product-id="${
                      product.id
                    }">Save for Later</button>
                    <button class="remove-item-btn" data-product-id="${
                      product.id
                    }">Remove</button>
                </div>
            </div>
        `;
  }

  // Update cart summary
  updateCartSummary() {
    const subtotal = this.calculateSubtotal();
    const shipping = this.calculateShipping(subtotal);
    const tax = this.calculateTax(subtotal);
    const total = subtotal + shipping + tax;

    // Update cart page summary
    const cartSubtotal = document.getElementById("cart-subtotal");
    const shippingCost = document.getElementById("shipping-cost");
    const taxAmount = document.getElementById("tax-amount");
    const cartTotal = document.getElementById("cart-total");
    const cartItemsCount = document.getElementById("cart-items-count");
    const summaryItemsCount = document.getElementById("summary-items-count");

    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingCost)
      shippingCost.textContent =
        shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`;
    if (taxAmount) taxAmount.textContent = `$${tax.toFixed(2)}`;
    if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;

    const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartItemsCount) cartItemsCount.textContent = itemCount;
    if (summaryItemsCount) summaryItemsCount.textContent = itemCount;

    // Update checkout summary
    this.updateCheckoutSummary();
  }

  // Calculate subtotal
  calculateSubtotal() {
    return this.cart.reduce((sum, item) => {
      const product = this.products.find((p) => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  }

  // Calculate shipping
  calculateShipping(subtotal) {
    if (subtotal >= 50) return 0; // Free shipping over $50
    return 5.99;
  }

  // Calculate tax
  calculateTax(subtotal) {
    return subtotal * 0.08; // 8% tax
  }

  // Bind cart page events
  bindCartEvents() {
    // Save for later buttons
    document.querySelectorAll(".save-for-later-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const productId = parseInt(btn.dataset.productId);
        this.saveForLater(productId);
      });
    });

    // Coupon code
    const applyCouponBtn = document.getElementById("apply-coupon-btn");
    if (applyCouponBtn) {
      applyCouponBtn.addEventListener("click", () => this.applyCoupon());
    }

    // Shipping calculator
    const calculateShippingBtn = document.getElementById(
      "calculate-shipping-btn"
    );
    if (calculateShippingBtn) {
      calculateShippingBtn.addEventListener("click", () =>
        this.calculateShippingCost()
      );
    }
  }

  // Apply coupon code
  applyCoupon() {
    const couponCode = document.getElementById("coupon-code").value.trim();
    const couponMessage = document.getElementById("coupon-message");

    // Mock coupon validation
    const validCoupons = {
      SAVE10: { type: "percentage", value: 10 },
      WELCOME: { type: "fixed", value: 5 },
      FREESHIP: { type: "free_shipping", value: 0 },
    };

    if (validCoupons[couponCode]) {
      const coupon = validCoupons[couponCode];
      // Apply coupon logic here
      couponMessage.textContent = "Coupon applied successfully!";
      couponMessage.className = "coupon-message success";
    } else {
      couponMessage.textContent = "Invalid coupon code.";
      couponMessage.className = "coupon-message error";
    }
  }

  // Wishlist functionality
  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);

    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.showSuccessMessage("Removed from wishlist");
    } else {
      this.wishlist.push(productId);
      this.showSuccessMessage("Added to wishlist");
    }

    localStorage.setItem("kod_wishlist", JSON.stringify(this.wishlist));
    this.updateWishlistUI(productId);
  }

  // Update wishlist UI
  updateWishlistUI(productId) {
    const wishlistBtns = document.querySelectorAll(
      `[data-product-id="${productId}"].wishlist-btn`
    );
    const isInWishlist = this.wishlist.includes(productId);

    wishlistBtns.forEach((btn) => {
      const icon = btn.querySelector("i");
      if (isInWishlist) {
        icon.className = "fas fa-heart";
        btn.classList.add("active");
      } else {
        icon.className = "far fa-heart";
        btn.classList.remove("active");
      }
    });
  }

  // Recently viewed functionality
  addToRecentlyViewed(productId) {
    // Remove if already exists
    this.recentlyViewed = this.recentlyViewed.filter((id) => id !== productId);

    // Add to beginning
    this.recentlyViewed.unshift(productId);

    // Keep only last 10 items
    this.recentlyViewed = this.recentlyViewed.slice(0, 10);

    localStorage.setItem(
      "kod_recently_viewed",
      JSON.stringify(this.recentlyViewed)
    );
  }

  // Load recently viewed products
  loadRecentlyViewed() {
    const recentlyViewedItems = document.getElementById(
      "recently-viewed-items"
    );
    if (!recentlyViewedItems || this.recentlyViewed.length === 0) return;

    const recentProducts = this.recentlyViewed
      .map((id) => this.products.find((p) => p.id === id))
      .filter((p) => p)
      .slice(0, 4);

    recentlyViewedItems.innerHTML = recentProducts
      .map(
        (product) => `
            <div class="recently-viewed-item">
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="item-info">
                        <h4>${product.name}</h4>
                        <span class="price">$${product.price.toFixed(2)}</span>
                    </div>
                </a>
            </div>
        `
      )
      .join("");
  }

  // Checkout functionality
  loadCheckoutItems() {
    const checkoutItems = document.getElementById("checkout-items");
    if (!checkoutItems) return;

    checkoutItems.innerHTML = this.cart
      .map((item) => {
        const product = this.products.find((p) => p.id === item.productId);
        if (!product) return "";

        return `
                <div class="checkout-item">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="item-details">
                        <h4>${product.name}</h4>
                        <span class="quantity">Qty: ${item.quantity}</span>
                    </div>
                    <span class="item-price">$${(
                      product.price * item.quantity
                    ).toFixed(2)}</span>
                </div>
            `;
      })
      .join("");

    this.updateCheckoutSummary();
  }

  // Update checkout summary
  updateCheckoutSummary() {
    const subtotal = this.calculateSubtotal();
    const shipping = this.calculateShipping(subtotal);
    const tax = this.calculateTax(subtotal);
    const total = subtotal + shipping + tax;

    const checkoutSubtotal = document.getElementById("checkout-subtotal");
    const checkoutShipping = document.getElementById("checkout-shipping");
    const checkoutTax = document.getElementById("checkout-tax");
    const checkoutTotal = document.getElementById("checkout-total");

    if (checkoutSubtotal)
      checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (checkoutShipping)
      checkoutShipping.textContent =
        shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`;
    if (checkoutTax) checkoutTax.textContent = `$${tax.toFixed(2)}`;
    if (checkoutTotal) checkoutTotal.textContent = `$${total.toFixed(2)}`;
  }

  // Bind checkout events
  bindCheckoutEvents() {
    // Step navigation
    const placeOrderBtn = document.getElementById("place-order-btn");
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener("click", () => this.placeOrder());
    }

    // Payment method selection
    document
      .querySelectorAll('input[name="paymentMethod"]')
      .forEach((input) => {
        input.addEventListener("change", () =>
          this.updatePaymentForm(input.value)
        );
      });

    // Billing address toggle
    const billingAddressSame = document.getElementById("billingAddressSame");
    if (billingAddressSame) {
      billingAddressSame.addEventListener("change", () => {
        const billingAddress = document.getElementById("billing-address");
        if (billingAddress) {
          billingAddress.style.display = billingAddressSame.checked
            ? "none"
            : "block";
        }
      });
    }
  }

  // Place order
  placeOrder() {
    // Show processing modal
    this.showModal("processing-modal");

    // Simulate order processing
    setTimeout(() => {
      this.closeModal("processing-modal");

      // Generate order number
      const orderNumber = "KOD-" + Date.now().toString().slice(-8);
      document.getElementById("order-number").textContent = orderNumber;

      // Calculate delivery date (7 days from now)
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 7);
      document.getElementById("estimated-delivery").textContent =
        deliveryDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

      // Clear cart
      this.clearCart();

      // Show success step
      this.showStep(4);
    }, 3000);
  }

  // Utility functions
  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = "";

    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
      starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<i class="far fa-star"></i>';
    }

    return starsHTML;
  }

  formatCategory(category) {
    return (
      category.charAt(0).toUpperCase() +
      category.slice(1).replace(/([A-Z])/g, " $1")
    );
  }

  getColorCode(colorName) {
    const colors = {
      White: "#ffffff",
      Black: "#000000",
      Red: "#ff0000",
      Blue: "#0000ff",
      Green: "#008000",
      Yellow: "#ffff00",
      Purple: "#800080",
      Pink: "#ffc0cb",
      Gray: "#808080",
      Navy: "#000080",
    };
    return colors[colorName] || "#cccccc";
  }

  // Update results info
  updateResultsInfo(totalResults) {
    const resultsCount = document.getElementById("results-count");
    if (resultsCount) {
      resultsCount.textContent = `Showing ${totalResults} products`;
    }
  }

  // Generate pagination
  generatePagination(totalResults) {
    const pagination = document.getElementById("pagination");
    if (!pagination) return;

    const totalPages = Math.ceil(totalResults / this.productsPerPage);
    if (totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }

    let paginationHTML = "";

    // Previous button
    if (this.currentPage > 1) {
      paginationHTML += `<button class="page-btn" onclick="shopSystem.goToPage(${
        this.currentPage - 1
      })">Previous</button>`;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === this.currentPage) {
        paginationHTML += `<button class="page-btn active">${i}</button>`;
      } else {
        paginationHTML += `<button class="page-btn" onclick="shopSystem.goToPage(${i})">${i}</button>`;
      }
    }

    // Next button
    if (this.currentPage < totalPages) {
      paginationHTML += `<button class="page-btn" onclick="shopSystem.goToPage(${
        this.currentPage + 1
      })">Next</button>`;
    }

    pagination.innerHTML = paginationHTML;
  }

  // Go to page
  goToPage(page) {
    this.currentPage = page;
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Set view mode
  setViewMode(mode) {
    const gridView = document.getElementById("grid-view");
    const listView = document.getElementById("list-view");
    const productsGrid = document.getElementById("products-grid");

    if (mode === "grid") {
      gridView.classList.add("active");
      listView.classList.remove("active");
      productsGrid.className = "products-grid";
    } else {
      listView.classList.add("active");
      gridView.classList.remove("active");
      productsGrid.className = "products-list";
    }
  }

  // Clear all filters
  clearFilters() {
    document.getElementById("search-input").value = "";
    document.getElementById("category-filter").value = "";
    document.getElementById("price-filter").value = "";
    document.getElementById("rating-filter").value = "";
    document.getElementById("sort-select").value = "name";

    this.currentFilters = {
      search: "",
      category: "",
      priceRange: "",
      rating: "",
      sort: "name",
    };

    this.currentPage = 1;
    this.loadProducts();
  }

  // Show/hide modals
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = "flex";
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = "none";
  }

  // Show remove item modal
  showRemoveItemModal(productId) {
    this.itemToRemove = productId;
    this.showModal("remove-item-modal");

    const confirmBtn = document.getElementById("confirm-remove-btn");
    if (confirmBtn) {
      confirmBtn.onclick = () => {
        this.removeFromCart(this.itemToRemove);
        this.closeModal("remove-item-modal");
        this.showSuccessMessage("Item removed from cart");
      };
    }
  }

  // Show clear cart modal
  showClearCartModal() {
    this.showModal("clear-cart-modal");

    const confirmBtn = document.getElementById("confirm-clear-btn");
    if (confirmBtn) {
      confirmBtn.onclick = () => {
        this.clearCart();
        this.closeModal("clear-cart-modal");
        this.showSuccessMessage("Cart cleared");
      };
    }
  }

  // Show success message
  showSuccessMessage(message) {
    const successMessage = document.getElementById("success-message");
    const successText = document.getElementById("success-text");

    if (successMessage && successText) {
      successText.textContent = message;
      successMessage.style.display = "flex";

      setTimeout(() => {
        successMessage.style.display = "none";
      }, 3000);
    }
  }

  // Checkout step navigation
  showStep(stepNumber) {
    // Update progress
    document.querySelectorAll(".progress-step").forEach((step, index) => {
      if (index + 1 <= stepNumber) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });

    // Update content
    document.querySelectorAll(".checkout-step").forEach((step, index) => {
      if (index + 1 === stepNumber) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });
  }

  // Update cart display
  updateCartDisplay() {
    if (window.location.pathname.includes("cart.html")) {
      this.loadCartItems();
    }
  }

  // Load recommended products
  loadRecommendedProducts() {
    const recommendedGrid = document.getElementById(
      "recommended-products-grid"
    );
    if (!recommendedGrid) return;

    const recommended = this.products.slice(0, 6); // Get first 6 products
    recommendedGrid.innerHTML = recommended
      .map((product) => this.createProductCard(product))
      .join("");
    this.bindProductCardEvents();
  }

  // Load featured products for homepage
  loadFeaturedProducts() {
    const featuredContainer = document.getElementById("featured-products");
    if (!featuredContainer) return;

    // Get first 6 products as featured
    const featuredProducts = this.products.slice(0, 6);
    featuredContainer.innerHTML = featuredProducts
      .map((product) => this.createProductCard(product))
      .join("");

    // Bind events to the new product cards
    this.bindProductCardEvents();
  }
}

// Global functions for HTML onclick events
function switchMainImage(imageSrc, thumbnail) {
  document.getElementById("main-product-image").src = imageSrc;
  document
    .querySelectorAll(".thumbnail")
    .forEach((thumb) => thumb.classList.remove("active"));
  thumbnail.classList.add("active");
}

function nextStep(step) {
  shopSystem.showStep(step);
}

function previousStep(step) {
  shopSystem.showStep(step);
}

function clearFilters() {
  shopSystem.clearFilters();
}

function closeModal(modalId) {
  shopSystem.closeModal(modalId);
}

// Initialize shopping system when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.shopSystem = new ShoppingSystem();
});
