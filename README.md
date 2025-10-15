# 🔗 Dynamic QR Code Platform

A powerful full-stack application that creates **dynamic QR codes** - QR codes that can redirect to different URLs without regenerating the image. Perfect for marketing campaigns, business cards, and any scenario where you need to update destinations after printing!

## ✨ Key Features

- **🔄 Dynamic URL Updates**: Change destination URLs without regenerating QR codes
- **📊 Real-time Analytics**: Track scans, devices, locations, and user behavior
- **📱 Device Detection**: Identify mobile, tablet, and desktop scans
- **⚡ Instant Updates**: Changes take effect immediately
- **🎯 Custom Short URLs**: Branded redirect links with tracking
- **💰 100% Free Deployment**: No hosting costs with Railway + Vercel
- **🎨 Modern UI**: Clean, responsive dashboard with Tailwind CSS

## 🏗️ Architecture

- **Frontend**: React 18 + Vite + Tailwind CSS + Lucide Icons
- **Backend**: Node.js + Express + SQLite + QRCode.js
- **Database**: SQLite (file-based, zero config)
- **Analytics**: Custom real-time tracking system
- **Deployment**: Railway (backend) + Vercel (frontend)

## 📁 Project Structure

```
dynamic-qr-platform/
├── frontend/              # React + Vite client application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateQR.jsx
│   │   │   ├── QRList.jsx
│   │   │   └── Analytics.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vercel.json
├── backend/               # Node.js + Express API server
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   │   ├── qr.js      # QR code CRUD operations
│   │   │   ├── redirect.js # URL redirection service  
│   │   │   └── analytics.js # Analytics & tracking
│   │   ├── database/      # Database setup
│   │   │   └── init.js    # SQLite initialization
│   │   └── server.js      # Express server setup
│   ├── package.json
│   └── railway.json
└── README.md
```

## � Quick Start

### Prerequisites
- Node.js 18+ installed
- Git installed

### 1. Clone & Setup
```bash
# Backend setup
cd backend
npm install
npm run dev

# Frontend setup (in another terminal)
cd frontend  
npm install
npm run dev
```

### 2. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🎯 How It Works

1. **Create QR Code**: Generate a QR that points to `yourapp.com/r/ABC123`
2. **Dynamic Redirect**: The short URL redirects to your target URL
3. **Update Anytime**: Change the target URL without changing the QR code
4. **Track Everything**: Monitor scans, devices, and user behavior
5. **Never Re-print**: QR code image stays the same forever!

## 📊 API Endpoints

### QR Code Management
- `POST /api/qr/create` - Create new dynamic QR code
- `GET /api/qr` - List all QR codes
- `GET /api/qr/:id` - Get specific QR code
- `PUT /api/qr/:id` - Update QR code (name, URL, status)
- `DELETE /api/qr/:id` - Delete QR code

### Analytics & Tracking
- `GET /api/analytics` - Overall analytics summary
- `GET /api/analytics/:qrId` - QR-specific analytics
- `GET /api/analytics/activity/recent` - Recent scan activity

### Redirect Service
- `GET /r/:shortCode` - Redirect to target URL (tracks analytics)

## 🌐 Free Deployment Guide

### Backend → Railway (Free)
1. **Sign up**: Create account at [railway.app](https://railway.app)
2. **Deploy**: Connect your GitHub repo
3. **Configure**: Railway auto-detects Node.js
4. **Environment**: Set `NODE_ENV=production`
5. **Domain**: Get free `*.railway.app` URL

### Frontend → Vercel (Free)  
1. **Sign up**: Create account at [vercel.com](https://vercel.com)
2. **Import**: Connect your GitHub repo
3. **Configure**: Select the `frontend` directory
4. **Environment**: Set `VITE_BACKEND_URL=https://your-railway-url.railway.app`
5. **Deploy**: Get free `*.vercel.app` URL

### Environment Variables

**Backend (.env)**:
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-vercel-app.vercel.app
```

**Frontend (.env)**:
```env
VITE_BACKEND_URL=https://your-railway-app.railway.app
```

## 🔧 Development Scripts

### Backend
```bash
npm run dev      # Start with auto-reload
npm start        # Production start  
npm test         # Run tests
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## � Analytics Features

- **📊 Scan Tracking**: Total scans and unique visitors
- **📱 Device Detection**: Mobile, tablet, desktop breakdown
- **📅 Daily Activity**: Time-based scan patterns
- **🌍 User Insights**: IP tracking and referrer data
- **⚡ Real-time Updates**: Live dashboard updates
- **📋 Export Data**: Download analytics reports

## 🛡️ Security Features

- **🔒 Helmet.js**: Security headers protection
- **🚫 CORS**: Cross-origin request protection  
- **✅ Input Validation**: URL and data sanitization
- **🔐 SQL Injection**: Parameterized query protection
- **⏱️ Rate Limiting**: API abuse prevention (coming soon)

## 🎨 UI Features

- **📱 Responsive Design**: Mobile-first approach
- **🎯 Intuitive Interface**: Easy QR code management
- **📊 Visual Analytics**: Charts and graphs
- **🎨 Modern Design**: Clean Tailwind CSS styling
- **⚡ Fast Performance**: Optimized React components
- **🔍 Search & Filter**: Find QR codes quickly

## 🔄 Use Cases

- **📄 Business Cards**: Update contact info without reprinting
- **🎪 Marketing Campaigns**: A/B test landing pages
- **📰 Print Advertising**: Update offers and promotions  
- **🏷️ Product Labels**: Link to latest product info
- **📅 Event Materials**: Update schedules and venues
- **📊 Performance Tracking**: Measure campaign effectiveness

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎉 Get Started Now!

Ready to create dynamic QR codes? Follow the Quick Start guide above and you'll be up and running in minutes!

**✅ No complex setup**  
**✅ No hosting costs**  
**✅ No limits on QR codes**  
**✅ Full source code included**

---

**Built with ❤️ for developers who need dynamic QR code solutions**

*Star ⭐ this repo if you found it helpful!*