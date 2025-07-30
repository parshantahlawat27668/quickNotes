# 📝 QuickNotes

QuickNotes is a full-stack note-taking app where users can securely register, log in (with email/password or Google), and manage personal notes. It includes OTP-based verification, cookie-based JWT tokens, protected routes, and a polished UI.

🌐 **Live Demo:** [https://quicknotes26.netlify.app](https://quicknotes26.netlify.app)

---

## 🚀 Features

- User Registration & Login with Email/Password
- Google OAuth Login using ID Token
- Email & Phone OTP Verification
- Access + Refresh Token authentication (cookie-based)
- Create, Edit, and Delete Personal Notes
- Protected Routes & Auto-login
- Redux-based User State Management
- Toast Notifications & Error Handling

---

## 🛠️ Tech Stack

### 🔹 Frontend

- React (Vite)
- Redux Toolkit
- Axios
- React Router DOM
- @react-oauth/google
- Toastify

### 🔸 Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT (access + refresh tokens)
- bcrypt
- dotenv, cors, cookie-parser

---

## ⚙️ Environment Variables

### Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongo_uri
CORS_ORIGIN=https://quicknotes26.netlify.app
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_refresh
ACCESS_TOKEN_EXPIRY=30m
REFRESH_TOKEN_EXPIRY=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=https://quicknotes26.netlify.app


/QuickNotes
├── frontend/                  # React + Vite Frontend
│   ├── src/
│   │   ├── assets/            # Images, icons, or static files
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route-based pages (Login, Home, etc.)
│   │   ├── routes/            # React Router-based route configs
│   │   ├── store/             # Redux Toolkit setup
│   │   └── main.jsx           # App entry point
│   └── .env

├── backend/                   # Node.js + Express Backend
│   ├── controllers/           # All route logic
│   ├── db/                    # Database connection config
│   ├── middlewares/           # Custom middlewares (auth, errorHandler, etc.)
│   ├── models/                # Mongoose models (User, Note, etc.)
│   ├── routes/                # Express route definitions
│   ├── utils/                 # Helper functions (e.g., OTP, token generation)
│   ├── constants.js           # App-wide constants
│   ├── app.js                 # Express app setup
│   └── server.js              # Server initialization
│   └── .env

├── README.md
└── .gitignore
