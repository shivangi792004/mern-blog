# 📝 MERN Blog – Full Stack Blogging Platform

A full-stack **MERN (MongoDB, Express, React, Node.js)** project where users can create and manage blog posts with secure **JWT Authentication**.  
Now enhanced with **Protected Routes** and a **modern responsive UI**.

---

## 🚀 Live Demo
🔗 **Deployed App:** [https://mern-blog-jn6u.onrender.com](https://mern-blog-jn6u.onrender.com)

<img width="1903" height="875" alt="image" src="https://github.com/user-attachments/assets/1165d578-7414-46b5-8ea8-4e96e45b5632" />

---

## 📖 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [License](#license)

---

## 🧩 Overview
MERN Blog is a full-featured blogging web application built using the **MERN stack**.  
It enables users to:
- Register or log in securely,
- Create, update, and view blog posts,
- Explore posts from other users,
- Search blogs by keywords or titles.

---

## ✨ Features
✅ User Authentication with **JWT**  
✅ Create, update, delete, and browse blog posts  
✅ Search functionality for blogs  
✅ Responsive & modern UI built with **React + Tailwind CSS**  
✅ Integrated **MongoDB Atlas** for cloud-based data storage  
✅ Backend built using **Express.js** and **Node.js**  
✅ Hosted on **Render** (single full-stack deployment)

---

## 🧠 Tech Stack
| Layer | Technology |
|-------|-------------|
| Frontend | React, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Hosting | Render |
| Authentication | JWT |
| Security | bcryptjs |

---

## ⚙️ Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/abhi-2029/mern-estate.git
cd mern-estate

2️⃣ Install Dependencies
npm install
npm install --prefix client

3️⃣ Environment Setup

Create two .env files:
  .One in the root for backend
  .One in the client folder for frontend


🔐 Environment Variables
    Root .env
MONGO=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
VITE_FIREBASE_API_KEY=your_firebase_api_key

Client .env
VITE_FIREBASE_API_KEY=your_firebase_api_key

🧱 Project Structure
mern-blog/
│
├── api/                     # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── index.js             # Entry point for backend server
│
├── client/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── redux/
│   │   ├── firebase.js
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
├── .gitignore
├── package.json             # Root package.json (controls both)
└── README.md

⚡ Deployment (Render)

1️⃣ Push to GitHub
Make sure your repo includes both api and client folders.
2️⃣ Configure Render
Environment: Node
Build Command:  npm run build
Start Command:  npm start
Root Directory: (leave blank)
Add all environment variables in Render’s dashboard.

3️⃣ Connect Repository
Once deployed, Render will serve both your backend and frontend from: https://your-app-name.onrender.com


🧰 Firebase Setup

1.Go to Firebase Console → Authentication
2.Enable: Email/Password Authentication
Google Sign-In
3.Add authorized domains:
localhost
mern-estate-a4f80.firebaseapp.com
mern-estate-a4f80.web.app
mern-estate-l7c1.onrender.com
4.Copy your Firebase config to client/src/firebase.js

🧑‍💻 Author

Shivangi Singh
🎓 B.Tech 2026 Batch | Full Stack Developer | DSA & C++ Enthusiast
🔗 LinkedIn
📧 shivangisingh8688@gmail.com

🪪 License

This project is licensed under the MIT License – free to use, modify, and distribute.

💬 Notes

If you fork or redeploy this app, make sure to:
  .Add your Render domain in Firebase Authorized Domains
  .Update .env with your own Firebase and MongoDB credentials
  .Enable Google reCAPTCHA for your new domain

⭐ If you found this project helpful, don’t forget to give it a star on GitHub!

---

Would you like me to also include a **short LinkedIn post description** to announce this project professionally (for better engagement)?
