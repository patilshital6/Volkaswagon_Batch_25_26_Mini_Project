// public/script.js
// Frontend JavaScript - Vanilla JS with no frameworks

// ============ CONFIGURATION ============
// Backend API URL
const API_BASE_URL = 'http://localhost:5000/api';

// Category emoji mapping
const categoryEmojis = {
    'Food': '🍔',
    'Transport': '🚗',
    'Bills': '📱',
    'Other': '🏷️'
};

// ============ DOM ELEMENTS ============
// Get references to HTML elements for easier manipulation
const expenseForm = document.getElementById('expenseForm');
const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const categorySelect = document.getElementById('category');
const expensesList = document.getElementById('expensesList');
const totalAmount = document.getElementById('totalAmount');
const expenseCount = document.getElementById('expenseCount');
const emptyState = document.getElementById('emptyState');
const loadingState = document.getElementById('loadingState');
const toast = document.getElementById('toast');
const refreshBtn = document.getElementById('refreshBtn');

// ============ INITIALIZATION ============
// Run when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Set date input to today's date by default
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    
    // Load expenses when page loads
    loadExpenses();
    
    // Add event listeners
    expenseForm.addEventListener('submit', handleAddExpense);
    refreshBtn.addEventListener('click', loadExpenses);
});

// ============ LOAD EXPENSES ============
// Fetch all expenses from the backend
async function loadExpenses() {
    try {
        // Show loading state
        loadingState.style.display = 'flex';
        expensesList.innerHTML = '';
        
        // Fetch expenses from API
        const response = await fetch(`${API_BASE_URL}/expenses`);
        const result = await response.json();
        
        // Hide loading state
        loadingState.style.display = 'none';
        
        // Check if request was successful
        if (!result.success) {
            showToast('Error loading expenses', 'error');
            showEmptyState();
            return;
        }
        
        // Get expenses array
        const expenses = result.data;
        
        // Get today's expenses (filter by date)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            expenseDate.setHours(0, 0, 0, 0);
            return expenseDate.getTime() === today.getTime();
        });
        
        // Update UI based on whether there are expenses
        if (todayExpenses.length === 0) {
            showEmptyState();
        } else {
            emptyState.style.display = 'none';
            expensesList.innerHTML = '';
            
            // Display each expense
            todayExpenses.forEach(expense => {
                const expenseElement = createExpenseElement(expense);
                expensesList.appendChild(expenseElement);
            });
        }
        
        // Update summary statistics
        updateSummary(todayExpenses);
        
    } catch (error) {
        console.error('Error loading expenses:', error);
        loadingState.style.display = 'none';
        showToast('Failed to load expenses', 'error');
        showEmptyState();
    }
}

// ============ CREATE EXPENSE ELEMENT ============
// Create HTML element for displaying an expense
function createExpenseElement(expense) {
    const div = document.createElement('div');
    div.className = `expense-item ${expense.category}`;
    
    // Format date
    const expenseDate = new Date(expense.date);
    const formattedDate = expenseDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    // Format time
    const formattedTime = expenseDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Build HTML for expense item
    div.innerHTML = `
        <div class="expense-info">
            <div class="expense-category-badge">
                ${categoryEmojis[expense.category] || '🏷️'}
            </div>
            <div class="expense-details">
                <span class="expense-title">${escapeHtml(expense.title)}</span>
                <span class="expense-meta">
                    <span class="expense-meta-item">📅 ${formattedDate}</span>
                    <span class="expense-meta-item">⏰ ${formattedTime}</span>
                </span>
            </div>
        </div>
        <div class="expense-amount">
            <span class="amount-label">${expense.category}</span>
            <span class="amount-value">$${expense.amount.toFixed(2)}</span>
        </div>
        <button class="btn-delete" onclick="deleteExpense('${expense._id}')">
            Delete
        </button>
    `;
    
    return div;
}

// ============ ESCAPE HTML ============
// Prevent XSS attacks by escaping HTML characters
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============ ADD EXPENSE ============
// Handle form submission to add new expense
async function handleAddExpense(e) {
    // Prevent default form submission
    e.preventDefault();
    
    // Get form values
    const title = titleInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;
    const category = categorySelect.value;
    
    // Validate inputs
    if (!title || !amount || !date || !category) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Validate amount
    if (amount <= 0) {
        showToast('Amount must be greater than 0', 'error');
        return;
    }
    
    try {
        // Show loading state on button
        const button = expenseForm.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<span>Adding...</span>';
        
        // Send request to backend to create expense
        const response = await fetch(`${API_BASE_URL}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                amount,
                date,
                category
            })
        });
        
        const result = await response.json();
        
        // Reset button
        button.disabled = false;
        button.innerHTML = originalText;
        
        // Check if request was successful
        if (!result.success) {
            showToast('Error adding expense: ' + result.message, 'error');
            return;
        }
        
        // Success! Show toast notification
        showToast('✓ Expense added successfully!', 'success');
        
        // Reset form
        expenseForm.reset();
        
        // Set date back to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        
        // Reload expenses to show the new one
        loadExpenses();
        
    } catch (error) {
        console.error('Error adding expense:', error);
        showToast('Failed to add expense', 'error');
        
        // Reset button
        const button = expenseForm.querySelector('button[type="submit"]');
        button.disabled = false;
        button.innerHTML = '<span>+ Add Expense</span>';
    }
}

// ============ DELETE EXPENSE ============
// Delete an expense by ID
async function deleteExpense(id) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this expense?')) {
        return;
    }
    
    try {
        // Send DELETE request to backend
        const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        // Check if request was successful
        if (!result.success) {
            showToast('Error deleting expense', 'error');
            return;
        }
        
        // Success! Show notification
        showToast('✓ Expense deleted', 'success');
        
        // Reload expenses
        loadExpenses();
        
    } catch (error) {
        console.error('Error deleting expense:', error);
        showToast('Failed to delete expense', 'error');
    }
}

// ============ UPDATE SUMMARY ============
// Update the total amount and expense count
function updateSummary(expenses) {
    // Calculate total amount
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Update DOM with new values
    totalAmount.textContent = `$${total.toFixed(2)}`;
    expenseCount.textContent = expenses.length;
}

// ============ SHOW EMPTY STATE ============
// Display empty state when no expenses
function showEmptyState() {
    emptyState.style.display = 'flex';
    expensesList.innerHTML = '';
    totalAmount.textContent = '$0.00';
    expenseCount.textContent = '0';
}

// ============ SHOW TOAST NOTIFICATION ============
// Display temporary notification message
function showToast(message, type = 'success') {
    // Clear any existing timeout
    if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
    }
    
    // Set toast content and class
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    // Auto-hide after 3 seconds
    toast.timeoutId = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============ REAL-TIME UPDATES ============
// Optional: Poll for updates every 30 seconds
// Uncomment to enable real-time updates
// setInterval(loadExpenses, 30000);
