# 🚀 Quick Start Guide - Expense Tracker

## One-Command Setup (macOS/Linux)

```bash
# 1. Navigate to project
cd Israim_Expense_Tracker

# 2. Install dependencies
npm install

# 3. Make sure MongoDB is running
# macOS: brew services start mongodb-community
# Windows: net start MongoDB

# 4. Start the server
npm start

# 5. Open browser to http://localhost:5000
```

## What Gets Installed?

```
✓ express       - Web framework
✓ mongoose      - Database ORM
✓ cors          - Cross-origin requests
✓ nodemon       - Auto-reload (dev only)
```

## MongoDB Setup (Choose One)

### Option 1: Local MongoDB (Recommended for beginners)

**macOS:**
```bash
# Install with Homebrew (if not already installed)
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify it's running
mongosh
```

**Windows:**
```bash
# Download installer from https://www.mongodb.com/try/download/community
# Run installer and follow setup
# MongoDB will start automatically

# Verify
mongosh
```

### Option 2: MongoDB Atlas (Cloud, Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a cluster
4. Get connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/`)
5. Set in terminal: `export MONGODB_URI="your-connection-string"`

## File Structure

```
Israim_Expense_Tracker/
├── 📄 server.js              ← Backend API server
├── 📁 models/
│   └── Expense.js           ← Database schema
├── 📁 public/
│   ├── index.html           ← Frontend
│   ├── styles.css           ← Beautiful styling
│   └── script.js            ← Frontend logic
├── 📄 package.json          ← Dependencies
└── 📄 README.md             ← Full documentation
```

## Common Commands

```bash
# Start server
npm start

# Start with auto-reload
npm run dev

# View MongoDB data
mongosh
> use expense_tracker
> db.expenses.find()
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB not found | Install MongoDB or use Atlas |
| Port 5000 in use | Change PORT in server.js |
| CORS errors | Already fixed in code |
| Styles not loading | Restart server and hard refresh |

## Next Steps

1. ✅ Add an expense using the web form
2. ✅ Check it appears in the list
3. ✅ Delete an expense to test
4. ✅ View MongoDB data with `mongosh`
5. ✅ Customize colors/categories in code

## Need Help?

- Check README.md for detailed API docs
- Look at server.js comments for backend logic
- Check script.js comments for frontend logic
- Error messages in browser console

Happy expense tracking! 💰
