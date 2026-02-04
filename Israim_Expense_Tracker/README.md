# 💰 Daily Expense Tracker

A beautiful and simple web application to track your daily expenses. Built with vanilla HTML, CSS, JavaScript on the frontend and Node.js, Express, MongoDB on the backend.

## 📋 Features

✨ **Amazing Frontend UI**
- Clean, modern, and responsive design
- Beautiful gradient backgrounds and smooth animations
- Category-based color coding (Food, Transport, Bills, Other)
- Real-time summary showing total expenses and count
- Toast notifications for user actions
- Mobile-friendly design

⚙️ **Simple Backend**
- RESTful API with Express.js
- MongoDB integration with Mongoose for data persistence
- Basic CRUD operations (Create, Read, Delete)
- Error handling and validation
- No authentication required (perfect for beginners)

## 🏗️ Project Structure

```
Israim_Expense_Tracker/
├── server.js                 # Main Express server and API routes
├── models/
│   └── Expense.js           # MongoDB schema and model
├── package.json             # Node.js dependencies
├── public/
│   ├── index.html           # HTML structure
│   ├── styles.css           # Beautiful CSS styling
│   └── script.js            # Vanilla JavaScript logic
└── README.md                # This file
```

## 🗄️ MongoDB Schema

```javascript
// Expense Collection Schema
{
  _id: ObjectId,                          // Auto-generated MongoDB ID
  title: String,                          // Expense description (required)
  amount: Number,                         // Amount spent (required)
  date: Date,                             // Date of expense (required)
  category: String,                       // Category: Food, Transport, Bills, Other (required)
  createdAt: Date                         // Timestamp (auto-generated)
}
```

### Example Document:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Coffee at Starbucks",
  "amount": 5.50,
  "date": "2024-02-04T10:30:00.000Z",
  "category": "Food",
  "createdAt": "2024-02-04T10:30:00.000Z"
}
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or MongoDB Atlas cloud) - [Download](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas)

### Step 1: Install Dependencies

```bash
# Navigate to project directory
cd Israim_Expense_Tracker

# Install npm packages
npm install
```

This will install:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - Enable cross-origin requests

### Step 2: Start MongoDB

**Option A: Local MongoDB**
```bash
# On macOS (if installed via Homebrew)
brew services start mongodb-community

# On Windows
net start MongoDB

# On Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Set environment variable:
```bash
export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/expense_tracker"
```

### Step 3: Start the Server

```bash
# Run the server
npm start

# Or use nodemon for auto-reload during development
npm run dev
```

You should see:
```
✓ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

### Step 4: Open in Browser

Open your browser and navigate to:
```
http://localhost:5000
```

## 📱 How to Use

1. **Add an Expense:**
   - Fill in the expense title
   - Enter the amount spent
   - Select the date (defaults to today)
   - Choose a category (Food, Transport, Bills, Other)
   - Click "+ Add Expense"

2. **View Expenses:**
   - All expenses are displayed below the form
   - Summary shows total amount spent and count
   - Expenses are color-coded by category
   - Newest expenses appear first

3. **Delete an Expense:**
   - Click the red "Delete" button on any expense
   - Confirm the deletion
   - Expense will be removed immediately

4. **Refresh Data:**
   - Click the 🔄 refresh button to reload expenses

## 🛠️ API Endpoints

### GET /api/expenses
Fetch all expenses from database

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Coffee",
      "amount": 5.50,
      "date": "2024-02-04T10:30:00.000Z",
      "category": "Food"
    }
  ]
}
```

### POST /api/expenses
Add a new expense

**Request Body:**
```json
{
  "title": "Coffee at Starbucks",
  "amount": 5.50,
  "date": "2024-02-04",
  "category": "Food"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Expense added successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Coffee at Starbucks",
    "amount": 5.50,
    "date": "2024-02-04T00:00:00.000Z",
    "category": "Food"
  }
}
```

### DELETE /api/expenses/:id
Delete an expense by ID

**Response:**
```json
{
  "success": true,
  "message": "Expense deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Coffee at Starbucks",
    "amount": 5.50,
    "date": "2024-02-04T00:00:00.000Z",
    "category": "Food"
  }
}
```

## 🎨 Frontend Details

### Technologies Used:
- **HTML5** - Semantic structure
- **CSS3** - Modern styling with:
  - Gradient backgrounds
  - Flexbox and Grid layouts
  - Smooth animations and transitions
  - Mobile-first responsive design
- **Vanilla JavaScript** - No frameworks, pure JavaScript for:
  - Form validation
  - API calls (Fetch API)
  - DOM manipulation
  - Event handling

### Color Scheme:
- **Primary:** Purple gradient (#667eea → #764ba2)
- **Success:** Green (#10b981)
- **Danger:** Red (#ef4444)
- **Food:** Yellow (#fcd34d)
- **Transport:** Blue (#93c5fd)
- **Bills:** Pink (#fbcfe8)
- **Other:** Gray (#d1d5db)

### Responsive Design:
- Works on desktop (1200px+)
- Tablet optimized (768px - 1200px)
- Mobile friendly (< 768px)

## 🔧 Customization

### Change Server Port
Edit `server.js`:
```javascript
const PORT = process.env.PORT || 3000; // Change 5000 to 3000
```

### Add More Categories
Edit `models/Expense.js`:
```javascript
category: {
  enum: ['Food', 'Transport', 'Bills', 'Entertainment', 'Health', 'Other']
}
```

And update `categoryEmojis` in `public/script.js`:
```javascript
const categoryEmojis = {
    'Food': '🍔',
    'Transport': '🚗',
    'Bills': '📱',
    'Entertainment': '🎮',
    'Health': '⚕️',
    'Other': '🏷️'
};
```

## 📦 Deployment

### Deploy to Heroku (Free tier)

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create app-name`
4. Add MongoDB URI: `heroku config:set MONGODB_URI="your-connection-string"`
5. Push to Heroku: `git push heroku main`

### Deploy to Vercel (Frontend only)
- Move frontend files to separate `frontend/` directory
- Deploy from Vercel dashboard

## 🐛 Troubleshooting

**Problem:** "MongoDB connection failed"
- Solution: Ensure MongoDB is running or check connection string

**Problem:** "Cannot POST /api/expenses"
- Solution: Check if backend server is running (npm start)

**Problem:** Styles not loading
- Solution: Clear browser cache or restart server

**Problem:** "CORS error"
- Solution: Ensure `cors` is enabled in server.js (already included)

## 📚 Learning Resources

- **Express.js:** https://expressjs.com/
- **MongoDB:** https://docs.mongodb.com/
- **Mongoose:** https://mongoosejs.com/
- **JavaScript Fetch API:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

## 📝 Sample Test Data

You can insert test data into MongoDB using MongoDB Compass or mongosh:

```javascript
db.expenses.insertMany([
  {
    title: "Breakfast",
    amount: 12.50,
    date: new Date("2024-02-04"),
    category: "Food"
  },
  {
    title: "Uber ride",
    amount: 25.00,
    date: new Date("2024-02-04"),
    category: "Transport"
  },
  {
    title: "Mobile bill",
    amount: 50.00,
    date: new Date("2024-02-04"),
    category: "Bills"
  }
])
```

## 👨‍💻 Author

Created as a mini project for Volkswagen Batch 25-26 Training Program

## 📄 License

This project is open source and available under the ISC License.

---

**Happy Tracking!** 💸
