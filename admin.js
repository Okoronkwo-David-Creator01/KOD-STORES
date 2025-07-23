class AdminDashboard {
    constructor() {
        this.init();
        this.loadData();
        this.setupEventListeners();
    }

    init() {
        this.updateLastUpdated();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        // Refresh button
        document.getElementById('refreshData').addEventListener('click', () => {
            this.loadData();
        });

        // User filters
        document.getElementById('userTypeFilter').addEventListener('change', () => {
            this.filterUsers();
        });

        document.getElementById('userSearch').addEventListener('input', () => {
            this.filterUsers();
        });

        // File restore
        document.getElementById('restoreFile').addEventListener('change', (e) => {
            this.restoreData(e.target.files[0]);
        });
    }

    loadData() {
        this.loadUserStats();
        this.loadUsers();
        this.loadRecentActivity();
        this.loadContactMessages();
        this.updateLastUpdated();
    }

    loadUserStats() {
        const users = JSON.parse(localStorage.getItem('kod_users') || '[]');
        const messages = JSON.parse(localStorage.getItem('kod_contact_messages') || '[]');
        const currentUser = JSON.parse(localStorage.getItem('kod_current_user') || 'null');

        const buyers = users.filter(user => user.role === 'buyer');
        const sellers = users.filter(user => user.role === 'seller');
        const onlineUsers = currentUser ? 1 : 0; // Simplified for demo

        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('totalBuyers').textContent = buyers.length;
        document.getElementById('totalSellers').textContent = sellers.length;
        document.getElementById('onlineUsers').textContent = onlineUsers;
        document.getElementById('totalMessages').textContent = messages.length;
    }

    loadUsers() {
        const users = JSON.parse(localStorage.getItem('kod_users') || '[]');
        const tbody = document.getElementById('userTableBody');
        
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>
                    <span class="role-badge ${user.role}">${user.role}</span>
                </td>
                <td>${this.formatDate(user.registeredAt || user.createdAt)}</td>
                <td>
                    <span class="status-badge ${(user.active || user.isActive) ? 'active' : 'inactive'}">
                        ${(user.active || user.isActive) ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <button class="admin-btn small" onclick="adminDashboard.viewUser('${user.email}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="admin-btn small ${(user.active || user.isActive) ? 'warning' : 'success'}" 
                            onclick="adminDashboard.toggleUserStatus('${user.email}')">
                        <i class="fas fa-${(user.active || user.isActive) ? 'ban' : 'check'}"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    filterUsers() {
        const typeFilter = document.getElementById('userTypeFilter').value;
        const searchTerm = document.getElementById('userSearch').value.toLowerCase();
        const users = JSON.parse(localStorage.getItem('kod_users') || '[]');

        let filteredUsers = users;

        if (typeFilter) {
            filteredUsers = filteredUsers.filter(user => user.role === typeFilter);
        }

        if (searchTerm) {
            filteredUsers = filteredUsers.filter(user => 
                user.fullName.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm)
            );
        }

        const tbody = document.getElementById('userTableBody');
        tbody.innerHTML = filteredUsers.map(user => `
            <tr>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>
                    <span class="role-badge ${user.role}">${user.role}</span>
                </td>
                <td>${this.formatDate(user.registeredAt || user.createdAt)}</td>
                <td>
                    <span class="status-badge ${(user.active || user.isActive) ? 'active' : 'inactive'}">
                        ${(user.active || user.isActive) ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <button class="admin-btn small" onclick="adminDashboard.viewUser('${user.email}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="admin-btn small ${(user.active || user.isActive) ? 'warning' : 'success'}" 
                            onclick="adminDashboard.toggleUserStatus('${user.email}')">
                        <i class="fas fa-${(user.active || user.isActive) ? 'ban' : 'check'}"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    loadRecentActivity() {
        const users = JSON.parse(localStorage.getItem('kod_users') || '[]');
        const messages = JSON.parse(localStorage.getItem('kod_contact_messages') || '[]');
        const currentUser = JSON.parse(localStorage.getItem('kod_current_user') || 'null');

        let activities = [];

        // Add user registrations
        users.forEach(user => {
            activities.push({
                type: 'registration',
                user: user.fullName,
                action: `Registered as ${user.role}`,
                timestamp: user.registeredAt,
                icon: 'fa-user-plus',
                color: 'success'
            });
        });

        // Add contact messages
        messages.forEach(message => {
            activities.push({
                type: 'message',
                user: `${message.firstName} ${message.lastName}`,
                action: `Sent message: ${message.subject}`,
                timestamp: message.timestamp,
                icon: 'fa-envelope',
                color: 'info'
            });
        });

        // Add current login
        if (currentUser) {
            activities.push({
                type: 'login',
                user: currentUser.fullName,
                action: 'Logged in',
                timestamp: new Date().toISOString(),
                icon: 'fa-sign-in-alt',
                color: 'primary'
            });
        }

        // Sort by timestamp (newest first)
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Take only recent 10 activities
        activities = activities.slice(0, 10);

        const container = document.getElementById('activityList');
        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.color}">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">
                        <strong>${activity.user}</strong> ${activity.action}
                    </div>
                    <div class="activity-time">${this.formatDate(activity.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    loadContactMessages() {
        const messages = JSON.parse(localStorage.getItem('kod_contact_messages') || '[]');
        const container = document.getElementById('messagesContainer');

        if (messages.length === 0) {
            container.innerHTML = '<div class="no-data">No contact messages yet.</div>';
            return;
        }

        // Sort by timestamp (newest first)
        messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        container.innerHTML = messages.map(message => `
            <div class="message-item ${message.read ? 'read' : 'unread'}">
                <div class="message-header">
                    <div class="message-sender">
                        <strong>${message.firstName} ${message.lastName}</strong>
                        <span class="message-email">${message.email}</span>
                    </div>
                    <div class="message-meta">
                        <span class="message-subject">${message.subject}</span>
                        <span class="message-time">${this.formatDate(message.timestamp)}</span>
                    </div>
                </div>
                <div class="message-content">
                    <p>${message.message}</p>
                    ${message.phone ? `<p><strong>Phone:</strong> ${message.phone}</p>` : ''}
                </div>
                <div class="message-actions">
                    <button class="admin-btn small" onclick="adminDashboard.toggleMessageRead('${message.id}')">
                        <i class="fas fa-${message.read ? 'envelope' : 'envelope-open'}"></i>
                        ${message.read ? 'Mark Unread' : 'Mark Read'}
                    </button>
                    <button class="admin-btn small danger" onclick="adminDashboard.deleteMessage('${message.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    viewUser(email) {
        const users = JSON.parse(localStorage.getItem('kod_users') || '[]');
        const user = users.find(u => u.email === email);
        
        if (user) {
            alert(`User Details:\n\nName: ${user.fullName}\nEmail: ${user.email}\nPhone: ${user.phone}\nRole: ${user.role}\nRegistered: ${this.formatDate(user.registeredAt)}\nStatus: ${user.active ? 'Active' : 'Inactive'}`);
        }
    }

    toggleUserStatus(email) {
        const users = JSON.parse(localStorage.getItem('kod_users') || '[]');
        const userIndex = users.findIndex(u => u.email === email);
        
        if (userIndex !== -1) {
            const currentStatus = users[userIndex].active || users[userIndex].isActive;
            users[userIndex].active = !currentStatus;
            users[userIndex].isActive = !currentStatus;
            localStorage.setItem('kod_users', JSON.stringify(users));
            this.loadUsers();
            this.loadUserStats();
            
            const action = users[userIndex].active ? 'activated' : 'deactivated';
            alert(`User ${users[userIndex].fullName} has been ${action}.`);
        }
    }

    toggleMessageRead(messageId) {
        const messages = JSON.parse(localStorage.getItem('kod_contact_messages') || '[]');
        const messageIndex = messages.findIndex(m => m.id == messageId);
        
        if (messageIndex !== -1) {
            messages[messageIndex].read = !messages[messageIndex].read;
            localStorage.setItem('kod_contact_messages', JSON.stringify(messages));
            this.loadContactMessages();
        }
    }

    deleteMessage(messageId) {
        if (confirm('Are you sure you want to delete this message?')) {
            const messages = JSON.parse(localStorage.getItem('kod_contact_messages') || '[]');
            const filteredMessages = messages.filter(m => m.id != messageId);
            localStorage.setItem('kod_contact_messages', JSON.stringify(filteredMessages));
            this.loadContactMessages();
            this.loadUserStats();
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    updateLastUpdated() {
        document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
    }

    startAutoRefresh() {
        // Auto refresh every 30 seconds
        setInterval(() => {
            this.loadData();
        }, 30000);
    }

    // Data management functions
    exportUsers() {
        const users = JSON.parse(localStorage.getItem('kod_users') || '[]');
        const dataStr = JSON.stringify(users, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `kod-users-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    backupData() {
        const data = {
            users: JSON.parse(localStorage.getItem('kod_users') || '[]'),
            messages: JSON.parse(localStorage.getItem('kod_contact_messages') || '[]'),
            currentUser: JSON.parse(localStorage.getItem('kod_current_user') || 'null'),
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `kod-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    restoreData(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (confirm('This will replace all current data. Are you sure?')) {
                    if (data.users) localStorage.setItem('kod_users', JSON.stringify(data.users));
                    if (data.messages) localStorage.setItem('kod_contact_messages', JSON.stringify(data.messages));
                    if (data.currentUser) localStorage.setItem('kod_current_user', JSON.stringify(data.currentUser));
                    
                    this.loadData();
                    alert('Data restored successfully!');
                }
            } catch (error) {
                alert('Invalid backup file format.');
            }
        };
        reader.readAsText(file);
    }

    clearUserData() {
        if (confirm('Are you sure you want to clear all user data? This cannot be undone.')) {
            localStorage.removeItem('kod_users');
            localStorage.removeItem('kod_current_user');
            this.loadData();
            alert('User data cleared.');
        }
    }

    clearMessages() {
        if (confirm('Are you sure you want to clear all contact messages? This cannot be undone.')) {
            localStorage.removeItem('kod_contact_messages');
            this.loadData();
            alert('Contact messages cleared.');
        }
    }

    resetAllData() {
        if (confirm('Are you sure you want to reset ALL data? This will clear everything and cannot be undone.')) {
            localStorage.clear();
            this.loadData();
            alert('All data has been reset.');
        }
    }
}

// Global functions for HTML onclick events
function exportUsers() {
    adminDashboard.exportUsers();
}

function backupData() {
    adminDashboard.backupData();
}

function clearUserData() {
    adminDashboard.clearUserData();
}

function clearMessages() {
    adminDashboard.clearMessages();
}

function resetAllData() {
    adminDashboard.resetAllData();
}

function markAllRead() {
    const messages = JSON.parse(localStorage.getItem('kod_contact_messages') || '[]');
    messages.forEach(message => message.read = true);
    localStorage.setItem('kod_contact_messages', JSON.stringify(messages));
    adminDashboard.loadContactMessages();
}

// Initialize admin dashboard when page loads
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
});
