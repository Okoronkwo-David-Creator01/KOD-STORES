// Main JavaScript for KOD STORES
document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication if auth.js is loaded
    if (typeof AuthSystem !== 'undefined') {
        window.authSystem = new AuthSystem();
    }
    
    // Add any other initialization code here
    console.log('KOD STORES loaded successfully!');
});
