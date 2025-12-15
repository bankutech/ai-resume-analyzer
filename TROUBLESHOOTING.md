# Troubleshooting Guide

## 🚨 Most Common Issues

### Issue: "Page loads but nothing works" or "Network Error"

**Solution:** The backend is not running!

1. Open a terminal
2. Navigate to backend: `cd backend`
3. Start backend: `py app.py` (Windows) or `python3 app.py` (Mac/Linux)
4. Wait for: `Running on http://127.0.0.1:5000`
5. Keep that terminal open
6. Refresh your browser

### Issue: "Cannot connect to backend server"

**Solution:** Backend must be started BEFORE frontend!

**Correct order:**
1. ✅ Start backend first: `cd backend && py app.py`
2. ✅ Wait for backend to start
3. ✅ Then start frontend: `npm run dev`
4. ✅ Then open browser

**Wrong order:**
❌ Starting frontend before backend
❌ Closing the backend terminal window

### Issue: Port already in use

**Backend (port 5000):**
```bash
# Windows: Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux: Find and kill process
lsof -ti:5000 | xargs kill -9
```

**Frontend (port 3000):**
- Vite will automatically use the next available port (3001, 3002, etc.)
- Check terminal output for the actual port
- Use that port in your browser

### Issue: Dependencies not installed

**Symptoms:**
- `ModuleNotFoundError` (Python)
- `Cannot find module` (Node.js)
- Import errors

**Solution:**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
py -m pip install -r requirements.txt  # Windows
pip install -r requirements.txt          # Mac/Linux
```

### Issue: File upload fails

**Checklist:**
- ✅ Backend is running
- ✅ File is PDF, DOCX, or TXT
- ✅ File size is under 16MB
- ✅ Check browser console (F12) for errors
- ✅ Check Network tab in DevTools

### Issue: Page is blank or styles missing

**Solution:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Check browser console (F12) for errors
4. Make sure frontend started successfully

## 🔍 Debugging Steps

### Step 1: Verify Backend is Running

Open in browser: http://localhost:5000/api/health

**Expected:** `{"status":"healthy"}`

**If not working:**
- Backend is not running
- Port 5000 is blocked
- Wrong URL

### Step 2: Verify Frontend is Running

Check terminal output for:
```
➜  Local:   http://localhost:3000/
```

**If not showing:**
- Frontend didn't start
- Check for errors in terminal
- Try `npm install` again

### Step 3: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for red errors
4. Check Network tab for failed requests

### Step 4: Verify File Structure

Make sure you have:
```
project/
├── backend/
│   └── app.py
├── src/
│   └── App.jsx
├── package.json
├── requirements.txt
└── uploads/ (directory exists)
```

## 🛠️ Quick Fixes

### Reset Everything

```bash
# Stop all running servers (Ctrl+C in terminals)

# Reinstall dependencies
rm -rf node_modules  # Mac/Linux
rmdir /s node_modules  # Windows
npm install

# Reinstall Python packages
py -m pip install --upgrade -r requirements.txt

# Restart both servers
```

### Use Setup Scripts

**Windows:**
```bash
.\setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

## 📞 Still Having Issues?

1. Check the main README.md troubleshooting section
2. Verify both servers are running
3. Check browser console for specific errors
4. Ensure all dependencies are installed
5. Try the setup scripts

## ✅ Verification Checklist

Before reporting issues, verify:

- [ ] Node.js is installed: `node --version`
- [ ] Python is installed: `py --version` or `python --version`
- [ ] Dependencies installed: `npm install` and `pip install -r requirements.txt`
- [ ] Backend is running: http://localhost:5000/api/health works
- [ ] Frontend is running: Terminal shows "Local: http://localhost:3000"
- [ ] Both terminals are open and running
- [ ] Browser console has no errors
- [ ] File is correct format (PDF, DOCX, TXT)

---

**Remember: Both servers must be running for the app to work!**
