// models/Expense.js
// This file defines the MongoDB schema for expenses using Mongoose

const mongoose = require('mongoose');

// Define the Expense schema
// Schema defines the structure of documents in the expenses collection
const expenseSchema = new mongoose.Schema({
  // Expense title or description
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  
  // Amount spent in rupees/dollars
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0, 'Amount cannot be negative']
  },
  
  // Date of the expense
  date: {
    type: Date,
    required: [true, 'Please add a date'],
    default: Date.now
  },
  
  // Category of expense: Food, Transport, Bills, Other
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Food', 'Transport', 'Bills', 'Other']
  },
  
  // Automatically add timestamps (createdAt, updatedAt)
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export the Expense model
module.exports = mongoose.model('Expense', expenseSchema);
