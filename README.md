# 🏠 Buyer Portal — Premium Real Estate Marketplace

A full-stack, production-ready real estate portal where users can discover, compare, and manage properties with ease. Built with a focus on high-performance search, modern aesthetics, and seamless user engagement.

## 🚀 Overview

Buyer Portal is a comprehensive platform designed for property buyers, sellers, and administrators. It features a robust search engine, interactive maps, mortgage tools, and a data-driven admin dashboard, all wrapped in a sleek, glassmorphic UI.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS (Modern Theme + Dark Mode)
- **Animations:** Framer Motion (Page transitions, Staggered reveals)
- **Charts:** Recharts (Analytics & EMI Visualization)
- **Maps:** Leaflet.js (Interactive property pins & clustering)
- **SEO:** React Helmet Async (Dynamic Meta tags & Structured Data)
- **State Management:** React Context API

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (Hosted on Supabase)
- **Authentication:** JWT (JSON Web Tokens) with role-based access control
- **Email Service:** Resend (Password recovery & Inquiries)
- **Payment Gateways:** eSewa ePay Staging (HMAC-SHA256 v2 API)

### Media & Infrastructure
- **Image Storage:** Cloudinary (Dynamic transforms & auto-optimization)
- **Hosting:** Vercel (Frontend) / Render (Backend)

## ✨ Features

For a complete and detailed breakdown of all implemented features, please refer to:
👉 **[features.md](./features.md)**

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database (or Supabase URL)
- Cloudinary Account
- Resend API Key (optional, for emails)

## 💳 Staging eSewa Credentials

To test the property promotion / featuring capability in the sandbox environment, utilize these official eSewa test credentials during checkout:
*   **eSewa ID (Test Wallet):** `9806800001` (or ending in `2` / `3` / `4` / `5`)
*   **Password:** `Nepal@123`
*   **OTP Token:** `123456`

## 🌐 Live Demo

- **Frontend:** [https://buyer-portal-alpha.vercel.app](https://buyer-portal-alpha.vercel.app)
- **Backend Health:** [https://buyer-portal-backend-6uhc.onrender.com/api/health](https://buyer-portal-backend-6uhc.onrender.com/api/health)

> **Note:** The backend is hosted on Render's free tier and may take 30-60 seconds to wake up on the first request if it has been inactive. Please wait a moment if the initial load is slow.
