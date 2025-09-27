# 🔗 Shorttty - Modern URL Shortener

> **Transform long URLs into shareable short links with comprehensive analytics and QR code generation**

Shorttty is a full-featured URL shortening service built with React, TypeScript, and Supabase. Create custom short URLs, track click analytics, and generate QR codes - all with a beautiful, responsive interface.

## ✨ Features

### 🎯 **Core Functionality**
- **URL Shortening**: Convert long URLs into compact, shareable links
- **Custom URLs**: Create personalized short URLs (up to 8 characters)
- **QR Code Generation**: Automatic QR code creation for every shortened URL
- **Link Management**: View, edit, and delete your URLs from a centralized dashboard

### 📊 **Analytics & Insights**
- **Click Tracking**: Monitor how many times your links are clicked
- **Location Analytics**: See where your clicks are coming from (city, country)
- **Device Detection**: Track desktop vs mobile usage
- **Visual Charts**: Interactive location-based analytics with Recharts
- **Real-time Updates**: Live statistics as clicks happen

### 🎨 **User Experience**
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Theme**: Modern, eye-friendly dark interface
- **One-Click Actions**: Copy links, download QR codes, and share with ease
- **Protected Routes**: Secure access to your personal dashboard
- **Guest Mode**: Create URLs without signing up (limited features)

### 🔐 **Authentication & Security**
- **GitHub OAuth**: Secure authentication via GitHub
- **User Isolation**: Each user can only access their own URLs
- **Protected Analytics**: Private click data and statistics

## 🎥 Demo



## 🚀 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS |
| **Routing** | React Router DOM |
| **UI Components** | Radix UI, Lucide React |
| **Charts** | Recharts |
| **Backend** | Supabase (Database, Auth, Storage) |
| **Build Tool** | Vite |
| **Validation** | Zod |

## 🏗️ Architecture

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (buttons, cards, etc.)
│   ├── Header.tsx       # Navigation header
│   ├── Footer.tsx       # Page footer
│   ├── LinkCard.tsx     # Individual URL display card
│   ├── CreateLink.tsx   # URL creation modal
│   ├── Location.tsx     # Analytics charts
│   └── QrCode.tsx       # QR code generator
├── pages/               # Main application pages
│   ├── home.tsx         # Landing page
│   ├── dashboard.tsx    # User dashboard
│   ├── link.tsx         # Individual URL details
│   ├── auth.tsx         # Authentication page
│   └── redirect-link.tsx # URL redirection handler
├── hooks/               # Custom React hooks
│   ├── use-auth.tsx     # Authentication logic
│   └── use-url-operations.tsx # URL management operations
├── utils/               # Utility functions
│   ├── api-urls.ts      # URL-related API calls
│   ├── api-clicks.ts    # Analytics API calls
│   └── supabase.ts      # Supabase client configuration
├── contexts/            # React Context providers
└── layout/              # Page layout components
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository
```bash
git clone https://github.com/jha-om/shorttty.git
cd shorttty
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Supabase Database Setup

Create the following tables in your Supabase database:

**URLs Table:**
```sql
CREATE TABLE urls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    original_url TEXT NOT NULL,
    short_url VARCHAR(8) UNIQUE NOT NULL,
    custom_url VARCHAR(8) UNIQUE,
    title VARCHAR(255),
    qr TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Clicks Table:**
```sql
CREATE TABLE clicks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    url_id UUID REFERENCES urls(id) ON DELETE CASCADE,
    city VARCHAR(100),
    country VARCHAR(100),
    device VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Start Development Server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173` to see your application!

## 🎯 Usage Guide

### Creating Your First Short URL

1. **Homepage**: Enter any long URL in the input field
2. **Authentication**: Sign in with GitHub (first-time users)
3. **Dashboard**: Access your personalized URL management center
4. **Create Link**: Click "Create New Link" to open the creation modal
5. **Customize**: Add a title and custom short URL (optional)
6. **Generate**: Your short URL and QR code are created instantly!

### Managing Your URLs

- **View All Links**: Dashboard shows all your created URLs
- **Click Analytics**: Click on any URL card to see detailed statistics
- **Quick Actions**: Copy, download QR code, or delete URLs with one click
- **Search & Filter**: Find specific URLs using the search functionality

### Understanding Analytics

- **Total Clicks**: See how many times your link has been clicked
- **Geographic Data**: View clicks by city and country
- **Device Breakdown**: Monitor desktop vs mobile usage
- **Time Series**: Track click patterns over time
- **Location Chart**: Visual representation of your global reach

## 🌟 Key Features Explained

### 🔗 Smart URL Generation
- **Collision-free**: Automatic generation ensures unique short URLs
- **Custom Options**: Users can create memorable custom URLs
- **Validation**: Real-time validation prevents conflicts

### 📱 QR Code Integration
- **Auto-generation**: Every URL gets a QR code automatically
- **Downloadable**: Save QR codes as PNG images
- **Customizable**: Clean, professional QR code design

### 📈 Advanced Analytics
- **Real-time Tracking**: Click data updates instantly
- **Geographic Insights**: Location-based analytics with city-level precision
- **Device Detection**: Comprehensive device and browser information
- **Visual Charts**: Interactive charts powered by Recharts

### 🎨 Modern UI/UX
- **Responsive Design**: Perfect experience on all device sizes
- **Dark Theme**: Easy on the eyes with a modern aesthetic
- **Smooth Animations**: Delightful micro-interactions
- **Accessibility**: Built with accessibility best practices

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

<br>
<hr>
<br>

<div align="center">

**Made with ❤️ and lots of ☕**

*If you found this project helpful, please consider giving it a ⭐!*

</div>
