// Authentication System for KOD STORES
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('kod_users') || '[]');
        this.init();
    }

    init() {
        this.checkAuthState();
        this.bindEvents();
    }

    // Check if user is logged in
    checkAuthState() {
        const currentUser = localStorage.getItem('kod_current_user');
        if (currentUser) {
            this.currentUser = JSON.parse(currentUser);
            this.updateUI();
        }
    }

    // Update navigation UI based on auth state
    updateUI() {
        const loginLink = document.querySelector('a[href="login.html"]');
        const registerLink = document.querySelector('a[href="registration.html"]');
        const userMenu = document.getElementById('user-menu');
        const logoutBtn = document.getElementById('logout-btn');

        if (this.currentUser) {
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';
            if (userMenu) {
                userMenu.style.display = 'block';
                userMenu.textContent = `${this.currentUser.fullName} (${this.currentUser.role})`;
            }
            if (logoutBtn) logoutBtn.style.display = 'block';
        } else {
            if (loginLink) loginLink.style.display = 'block';
            if (registerLink) registerLink.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    }

    // Bind event handlers
    bindEvents() {
        // Registration form
        const regForm = document.getElementById('registration-form');
        if (regForm) {
            regForm.addEventListener('submit', (e) => this.handleRegistration(e));
        }

        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // User menu
        const userMenu = document.getElementById('user-menu');
        if (userMenu) {
            userMenu.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToDashboard();
            });
        }
    }

    // Handle user registration
    handleRegistration(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData);

        // Validate form
        const validation = this.validateRegistration(userData);
        if (!validation.isValid) {
            this.showError(validation.error);
            return;
        }

        // Check if user already exists
        const existingUser = this.users.find(user => user.email === userData.email);
        if (existingUser) {
            this.showError('An account with this email already exists.');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            password: this.hashPassword(userData.password),
            role: userData.userRole,
            createdAt: new Date().toISOString(),
            isActive: true
        };

        // Save user
        this.users.push(newUser);
        localStorage.setItem('kod_users', JSON.stringify(this.users));

        // Auto login after registration
        this.loginUser(newUser);
        this.showSuccess('Account created successfully! Redirecting...');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    // Handle user login
    handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const loginData = Object.fromEntries(formData);

        // Find user
        const user = this.users.find(u => u.email === loginData.email);
        if (!user || !this.verifyPassword(loginData.password, user.password)) {
            this.showError('Invalid email or password.');
            return;
        }

        if (!user.isActive) {
            this.showError('Your account has been deactivated. Please contact support.');
            return;
        }

        // Login user
        this.loginUser(user);
        this.showSuccess('Login successful! Redirecting...');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    // Login user and set session
    loginUser(user) {
        const userSession = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            loginTime: new Date().toISOString()
        };

        this.currentUser = userSession;
        localStorage.setItem('kod_current_user', JSON.stringify(userSession));
        this.updateUI();
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('kod_current_user');
        this.updateUI();
        window.location.href = 'index.html';
    }

    // Go to dashboard based on user role
    goToDashboard() {
        if (!this.currentUser) return;
        
        if (this.currentUser.role === 'seller') {
            window.location.href = 'seller-dashboard.html';
        } else if (this.currentUser.role === 'buyer') {
            window.location.href = 'buyer-dashboard.html';
        }
    }

    // Validate registration data
    validateRegistration(data) {
        if (!data.fullName || data.fullName.trim().length < 2) {
            return { isValid: false, error: 'Full name must be at least 2 characters long.' };
        }

        if (!this.isValidEmail(data.email)) {
            return { isValid: false, error: 'Please enter a valid email address.' };
        }

        if (!data.phone || data.phone.length < 10) {
            return { isValid: false, error: 'Please enter a valid phone number.' };
        }

        if (!data.password || data.password.length < 8) {
            return { isValid: false, error: 'Password must be at least 8 characters long.' };
        }

        if (data.password !== data.confirmPassword) {
            return { isValid: false, error: 'Passwords do not match.' };
        }

        if (!data.userRole) {
            return { isValid: false, error: 'Please select an account type.' };
        }

        if (!data.terms) {
            return { isValid: false, error: 'You must agree to the Terms and Conditions.' };
        }

        return { isValid: true };
    }

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Simple password hashing (in real app, use proper hashing)
    hashPassword(password) {
        return btoa(password + 'kod_salt_2024');
    }

    // Verify password
    verifyPassword(password, hashedPassword) {
        return this.hashPassword(password) === hashedPassword;
    }

    // Show error message
    showError(message) {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.className = 'error-message show';
            setTimeout(() => {
                errorDiv.className = 'error-message';
            }, 5000);
        }
    }

    // Show success message
    showSuccess(message) {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.className = 'success-message show';
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user has specific role
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    // Get all users (admin function)
    getAllUsers() {
        return this.users;
    }
}

// Initialize authentication system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});
