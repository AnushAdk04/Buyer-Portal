# 🏠 Buyer Portal — Core Features & Documentation

> **Last Updated:** May 14, 2026  
> **Project Type:** Full-Stack Real Estate Marketplace  
> **Development Status:** Fully Completed — Production Ready

---

## 🚀 Core Features

### 🔐 Authentication & Security
- **JWT Auth**: Secure registration and login using JSON Web Tokens.
- **Role-Based Access**: Specialized views and permissions for **Buyers**, **Sellers**, and **Admins**.
- **Password Management**: Secure password hashing and integrated "Forgot Password" flow with email recovery.
- **Protected Routes**: Navigation guards to prevent unauthorized access to private dashboards.

### 💳 Staging Promotions & Nepali Payment Gateways
- **Multiple Payment Gateways**: Ready-to-go integrations of the leading local payment portals: **eSewa ePay API v2** (sandbox) and **Khalti e-Commerce API v2** (sandbox).
- **Cryptographic & API Verification**: Tamper-proof server-side verification using standard **HMAC-SHA256** checks (eSewa) and server-to-server lookup queries (Khalti).
- **Premium Featured Listings**: Toggles a listing as "Featured" upon successful promotion payment of **₨ 500.00** using the gateway of the seller's choice.
- **Audit Ledger**: A dedicated transaction history tracking table `payments` in the database to record transaction codes, payment states, and gateways.

### 🏠 Property Management
- **Rich Listings**: Support for detailed property specs including title, location, price, description, type (House, Apartment, etc.), status (For Sale, Rent, Sold), bedrooms, bathrooms, and area.
- **Multi-Image Support**: Upload up to 10 high-resolution images per property with Cloudinary integration.
- **Interactive Dashboards**: Sellers can manage their own listings (Add, Edit, Delete) with a clean UI.
- **Dynamic Status**: Real-time status badges (For Sale, Sold, etc.) on all cards.

### 🔍 Search & Discovery
- **Full-Text Search**: Search by title, location, or description with high-performance debouncing.
- **Advanced Filtering**: Filter properties by type, status, price range, bedrooms, bathrooms, and area.
- **Smart Sorting**: Sort by newest, oldest, and price (asc/desc).
- **URL Synchronization**: Shareable search results with filters synced to the browser URL.
- **Interactive Map**: Visualize listings on an integrated **Leaflet.js** map with marker clustering.

### 💎 User Experience & Engagement
- **Favourites System**: Save properties to a personal wishlist.
- **Property Comparison**: Side-by-side comparison of up to 3 properties in a dedicated view.
- **Recently Viewed**: Persistent history tracking for quickly returning to browsed properties.
- **AI Chatbot Assistant**: Specialized real estate expert powered by GPT-4o-mini to help with property searches, advice, and portal navigation.
- **EMI Calculator**: Interactive mortgage calculator with principal vs interest visualization.
- **Inquiry System**: Direct communication between buyers and sellers via integrated contact forms.
- **Real-Time Notifications**: Instant alerts for inquiries, property updates, and account actions.

### 📊 Admin & Seller Analytics
- **Admin Dashboard**: Modern control center with system-wide stats, user management, and property oversight.
- **Data Visualization**: Interactive charts (Recharts) showing user growth, property volume, and price distribution.
- **View Tracking**: Sellers can see exactly how many people have viewed their listings over time.

### 🎨 Design & UI
- **Modern Aesthetic**: Glassmorphism, smooth gradients, and premium typography (Inter & Outfit).
- **Dark/Light Mode**: Fully theme-aware UI with a toggle.
- **Micro-Animations**: Staggered reveals and smooth transitions powered by **Framer Motion**.
- **Responsive Design**: Optimized for mobile, tablet, and desktop with a slide-out mobile navigation.
- **Skeleton Loading**: High-quality shimmer placeholders for all data-fetching states.

### 🚀 Production Polish
- **SEO Ready**: Dynamic meta tags, Open Graph (OG) support, and JSON-LD structured data.
- **Performance**: Route-level code splitting, lazy loading, and Cloudinary image transformations (f_auto, q_auto).
- **Accessibility**: WCAG AA compliant with full ARIA support and keyboard navigation.

---

## 🛠️ Future Enhancements (Nice-to-Have)
The following features are ideas for future versions of the platform:
- **Saved Searches**: Allow users to save their filter criteria and receive alerts for new matching properties.
- **Virtual Tours**: Support for 360° image viewing or video walkthroughs.
- **Multi-Language Support**: Integration of Nepali and other local languages.
- **PWA Support**: Transform the portal into a Progressive Web App for offline access and home-screen install.


---
*For technical implementation details, refer to the [API Documentation](./backend/API_DOCS.md).*
