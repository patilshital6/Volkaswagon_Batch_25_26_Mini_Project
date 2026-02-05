// server.js
// Main Express server with MongoDB connection and API routes

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Expense = require('./models/Expense');

const app = express();

// ============ MIDDLEWARE ============
// Enable CORS to allow requests from frontend
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Serve static files from public directory (HTML, CSS, JS)
app.use(express.static('public'));

// ============ MONGODB CONNECTION ============
// Connection URL - using MongoDB Atlas or local MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense_tracker';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✓ MongoDB connected successfully');
})
.catch((err) => {
  console.log('✗ MongoDB connection failed:', err.message);
  console.log('Make sure MongoDB is running on your machine');
});

// ============ API ROUTES ============

// 1. GET all expenses
// Route: GET /api/expenses
// Returns: Array of all expenses from database
app.get('/api/expenses', async (req, res) => {
  try {
    // Fetch all expenses, sorted by date in descending order (newest first)
    const expenses = await Expense.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching expenses',
      error: error.message
    });
  }
});

// 2. GET today's expenses
// Route: GET /api/expenses/today
// Returns: Array of expenses added today
app.get('/api/expenses/today', async (req, res) => {
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get tomorrow's date to create range
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Find expenses where date is between today and tomorrow
    const todayExpenses = await Expense.find({
      date: { $gte: today, $lt: tomorrow }
    }).sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: todayExpenses.length,
      data: todayExpenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching today\'s expenses',
      error: error.message
    });
  }
});

// 3. CREATE a new expense
// Route: POST /api/expenses
// Body: { title, amount, date, category }
// Returns: Created expense object
app.post('/api/expenses', async (req, res) => {
  try {
    const { title, amount, date, category } = req.body;
    
    // Validate required fields
    if (!title || !amount || !date || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, amount, date, category'
      });
    }
    
    // Create new expense object
    const newExpense = new Expense({
      title: title.trim(),
      amount: parseFloat(amount),
      date: new Date(date),
      category
    });
    
    // Save to database
    const savedExpense = await newExpense.save();
    
    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: savedExpense
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating expense',
      error: error.message
    });
  }
});

// 4. DELETE an expense by ID
// Route: DELETE /api/expenses/:id
// Params: id (MongoDB ObjectId)
// Returns: Success message
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID'
      });
    }
    
    // Find and delete the expense
    const deletedExpense = await Expense.findByIdAndDelete(id);
    
    // Check if expense exists
    if (!deletedExpense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: deletedExpense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting expense',
      error: error.message
    });
  }
});

// ============ ERROR HANDLING ============
// Handle 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
