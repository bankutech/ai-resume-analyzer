# ai-resume-analyzer

## Overview
A **creative, professional AI-powered resume analyzer** with stunning visual design, comprehensive insights, and personalized feedback to help your resume stand out!

[![GitHub stars](https://img.shields.io/github/stars/bankutech/ai-resume-analyzer?style=social)](https://github.com/bankutech/ai-resume-analyzer)
[![GitHub forks](https://img.shields.io/github/forks/bankutech/ai-resume-analyzer?style=social)](https://github.com/bankutech/ai-resume-analyzer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![AI Resume Analyzer](https://img.shields.io/badge/AI-Resume%20Analyzer-purple?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react)
![Flask](https://img.shields.io/badge/Flask-3.0-green?style=for-the-badge&logo=flask)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-blue?style=for-the-badge&logo=tailwindcss)

##  Quick Start (3 Steps)

```bash
# 1. Clone and install
git clone https://github.com/bankutech/ai-resume-analyzer.git
cd ai-resume-analyzer
npm install
py -m pip install -r requirements.txt  # Windows
# OR: pip install -r requirements.txt   # Mac/Linux

# 2. Start backend (Terminal 1) - MUST RUN FIRST!
cd backend
py app.py  # Windows
# OR: python3 app.py  # Mac/Linux

# 3. Start frontend (Terminal 2) - NEW TERMINAL!
npm run dev

# 4. Open http://localhost:3000 in your browser
```

**️ IMPORTANT:** You need **TWO terminal windows** - one for backend, one for frontend!

##  Features

- ** Multi-dimensional Analysis**: Completeness, Content Quality, Professionalism, Technical Depth, Creativity
- ** Visual Analytics**: Interactive radar charts and beautiful score visualizations
- ** Creative Insights**: Personality traits, career level assessment, and market readiness
- ** Stunning UI**: Modern glassmorphism design with animated gradients
- ** Smart Suggestions**: Personalized improvement recommendations
- ** Skill Detection**: Automatically identifies technical and soft skills
- ** Real-time Analysis**: Instant feedback on your resume

## ️ Tech Stack

### Frontend
- ️ React 18 with Vite
-  Tailwind CSS (Custom animations & glassmorphism)
-  Recharts (Data visualization)
-  Lucide React (Beautiful icons)
-  Axios (API communication)

### Backend
-  Flask (Python web framework)
-  PyPDF2 (PDF parsing)
-  python-docx (DOCX parsing)
-  Flask-CORS (Cross-origin support)

##  Installation

### Prerequisites
-  Node.js (v16 or higher) - [Download](https://nodejs.org/)
-  Python 3.8 or higher - [Download](https://www.python.org/)
-  npm (comes with Node.js)
-  pip (comes with Python)

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/bankutech/ai-resume-analyzer.git
   cd ai-resume-analyzer
   ```
   
   Or if you already have the project:
   ```bash
   cd ai-resume-analyzer
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```
   This will install React, Vite, Tailwind CSS, and all other frontend packages.

3. **Install Backend Dependencies**
   
   **On Windows:**
   ```bash
   py -m pip install -r requirements.txt
   ```
   
   **On Mac/Linux:**
   ```bash
   pip install -r requirements.txt
   ```
   
   Or use Python 3 explicitly:
   ```bash
   python3 -m pip install -r requirements.txt
   ```
   
   This will install Flask, PyPDF2, python-docx, and other backend packages.

4. **Verify uploads directory exists**
   ```bash
   # The uploads directory should already exist with .gitkeep file
   # If not, create it:
   mkdir uploads
   ```

##  Running the Application

### ️ **CRITICAL: You Need TWO Terminal Windows!**

The application requires **both backend and frontend** to be running simultaneously.

### **Option 1: Manual Start (Recommended)**

#### **Step 1: Start the Backend Server (Terminal 1)**

**On Windows:**
```bash
cd backend
py app.py
```

**On Mac/Linux:**
```bash
cd backend
python3 app.py
```

 **You MUST see this message:**
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

**️ IMPORTANT:** Keep this terminal window open! The backend must stay running.

#### **Step 2: Start the Frontend Server (Terminal 2)**

**Open a NEW terminal window** (keep Terminal 1 running!) and run:

```bash
# Make sure you're in the project root (not backend folder)
npm run dev
```

 **You should see:**
```
  VITE v5.x.x  ready in XXXX ms
    Local:   http://localhost:3000/
```

**Note:** If port 3000 is busy, Vite will automatically use 3001, 3002, etc. Check the terminal output for the actual port.

#### **Step 3: Open in Browser**

 Open your browser and go to:
- **http://localhost:3000** (or the port shown in Terminal 2)

** Both terminals should be running:**
- Terminal 1: Backend (Flask) - port 5000
- Terminal 2: Frontend (Vite) - port 3000

### **Option 2: Using Batch Files (Windows Only)**

1. **Start Backend:**
   ```bash
   .\start_backend.bat
   ```

2. **Start Frontend:**
   ```bash
   npm run dev
   ```

##  How to Use

### Prerequisites
-  Backend must be running (Terminal 1: `cd backend && py app.py`)
-  Frontend must be running (Terminal 2: `npm run dev`)
-  Both terminals should be open and running

### Steps

1. **Open the Application**
   - Navigate to `http://localhost:3000` (or the port shown in Terminal 2)
   - If you see errors, check that backend is running first!

2. **Upload Your Resume**
   - Click "Choose file or drag & drop"
   - Select a PDF, DOCX, or TXT file
   - You'll see a green checkmark when the file is selected

3. **Analyze Your Resume**
   - Click the "Analyze Resume" button
   - Wait a few seconds for the analysis to complete
   - If you get "Network Error", the backend is not running!

4. **View Results**
   - **Overall Score**: See your resume's performance (0-100)
   - **Score Cards**: Detailed breakdown of 6 dimensions
   - **Radar Chart**: Visual performance overview
   - **Creative Insights**: Personality traits and market readiness
   - **Skills Detected**: Technical and soft skills found
   - **Statistics**: Word count, sections, career level
   - **Suggestions**: Personalized improvement tips

##  Analysis Dimensions

| Dimension | Description |
|-----------|-------------|
| **Completeness** | Contact info, links, section coverage |
| **Content Quality** | Word count, skill diversity, detail level |
| **Professionalism** | Email, LinkedIn, formatting quality |
| **Technical Depth** | Technical skills and technologies |
| **Creativity** | Unique elements, projects, soft skills |
| **Market Readiness** | Overall job market preparedness |

##  Project Structure

```
project2/
├── backend/
│   └── app.py                 # Flask API server
├── src/
│   ├── components/
│   │   ├── ScoreCard.jsx      # Score display cards
│   │   ├── AnalysisChart.jsx # Radar chart visualization
│   │   └── InsightsPanel.jsx  # Creative insights panel
│   ├── App.jsx                # Main application
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles & animations
├── index.html                  # HTML template
├── package.json               # Frontend dependencies
├── requirements.txt            # Backend dependencies
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS config
├── start_backend.bat          # Windows startup script
└── README.md                  # This file
```

##  API Endpoints

- `POST /api/analyze` - Analyze uploaded resume file
  - **Request**: Multipart form data with file
  - **Response**: JSON with analysis results
- `GET /api/health` - Health check endpoint

##  Supported File Formats

-  **PDF** (.pdf) - Most common format
-  **Microsoft Word** (.docx) - Word documents
-  **Plain Text** (.txt) - Simple text files

**Maximum file size:** 16MB

##  Design Features

- **Glassmorphism**: Frosted glass effect on cards
- **Animated Gradients**: Smooth color transitions
- **Hover Effects**: Interactive elements with scale animations
- **Custom Animations**: Float, pulse, slide-in effects
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Professional Typography**: Inter and Poppins fonts

##  Troubleshooting

### ️ IMPORTANT: Both Servers Must Be Running!

**The application requires TWO servers running simultaneously:**
1. Backend (Flask) on port 5000
2. Frontend (Vite) on port 3000

**If the page doesn't work, check:**
-  Is the backend running? (You should see "Running on http://127.0.0.1:5000")
-  Is the frontend running? (You should see "Local: http://localhost:3000")
-  Are both terminal windows still open?

### Backend won't start
-  Make sure Python is installed: `py --version` or `python --version`
-  Install dependencies: `py -m pip install -r requirements.txt`
-  Check if port 5000 is already in use
-  Make sure you're in the backend directory: `cd backend`
-  Try: `py app.py` (Windows) or `python3 app.py` (Mac/Linux)

### Frontend won't start
-  Make sure Node.js is installed: `node --version`
-  Install dependencies: `npm install` (run in project root, not backend folder)
-  Check if the port is already in use (Vite will try the next available port)
-  If port 3000 is busy, Vite will use 3001, 3002, etc. - check terminal output

### Can't connect to backend / "Network Error"
-  **MOST COMMON ISSUE**: Backend is not running!
-  Start backend first: `cd backend && py app.py`
-  Wait for: "Running on http://127.0.0.1:5000"
-  Then start frontend: `npm run dev`
-  Check the browser console for errors (F12 → Console tab)
-  Verify backend is accessible: Open http://localhost:5000/api/health in browser

### Page loads but upload doesn't work
-  Check browser console (F12) for errors
-  Verify backend is running (most common issue)
-  Check Network tab in browser DevTools - is the request failing?
-  Make sure file is PDF, DOCX, or TXT
-  Check file size (max 16MB)

### "Cannot connect to backend server" error
-  Backend must be running before you start frontend
-  Check if backend started successfully
-  Try accessing http://localhost:5000/api/health directly
-  Make sure no firewall is blocking port 5000

### File upload errors
-  Make sure file is PDF, DOCX, or TXT
-  Check file size (max 16MB)
-  Ensure backend is running
-  Check uploads directory exists: `ls uploads` or `dir uploads`

### Setup Script Issues
-  Run `setup.bat` (Windows) or `setup.sh` (Mac/Linux) to auto-setup
-  Or manually follow the installation steps above

##  Quick Start Commands

```bash
# 1. Install everything
npm install
py -m pip install -r requirements.txt  # Windows
# OR
pip install -r requirements.txt         # Mac/Linux

# 2. Start backend (Terminal 1) - MUST RUN FIRST!
cd backend
py app.py  # Windows
# OR
python3 app.py  # Mac/Linux

# 3. Start frontend (Terminal 2) - NEW TERMINAL WINDOW!
# (Make sure you're back in project root, not backend folder)
npm run dev

# 4. Open browser
# Go to http://localhost:3000 (or port shown in terminal)
```

**️ Remember:** 
- Backend must start FIRST
- Keep BOTH terminals open
- Backend runs on port 5000
- Frontend runs on port 3000 (or next available)

##  Screenshots

The application features:
-  Beautiful gradient backgrounds
-  Glassmorphism card designs
-  Interactive radar charts
-  Colorful score visualizations
-  Smooth animations and transitions

##  Future Enhancements

- [ ] Integration with OpenAI API for advanced NLP
- [ ] Resume comparison tool
- [ ] Industry-specific analysis
- [ ] Export analysis reports (PDF)
- [ ] Resume templates and suggestions
- [ ] ATS compatibility checker
- [ ] Multi-language support
- [ ] Resume version history

##  License

MIT License - Feel free to use and modify!

##  Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

##  Support

If you encounter any issues:
1. Check the Troubleshooting section above
2. Review the browser console (F12) for errors
3. Ensure both servers are running
4. Verify all dependencies are installed

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- Built with React, Flask, and lots of creativity
- Icons by [Lucide](https://lucide.dev)
- Charts by [Recharts](https://recharts.org)

##  Contact & Support

-  [Report a Bug](https://github.com/bankutech/ai-resume-analyzer/issues)
-  [Request a Feature](https://github.com/bankutech/ai-resume-analyzer/issues)
-  Open an issue for questions

---

**Made with ️ and creativity** - Transform your resume today! 

⭐ Star this repo if you find it helpful!

## Getting Started
Please refer to the source files for specific installation and usage instructions. Ensure that your local environment meets the standard requirements for the associated technologies.

## Project Structure
This project is organized into standard directories. Key configuration files and primary source code are located in the root directory.
