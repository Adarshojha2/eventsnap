# EventSnap — Production-Ready Event Photo Sharing SaaS

EventSnap is a modern full-stack web application designed for seamless event-based photo and video sharing. Using unique QR codes, guests can instantly view, download, and upload event memories without installing any apps or signing up for accounts.

---

## 🚀 Key Modules
1. **QR Poster System**: Automatically generates high-fidelity QR codes pointing to guest galleries. Users can customize, download, and print physical posters.
2. **Guest Experience (No Auth)**: Guests access galleries directly via QR or URL. If PIN protection is enabled, access requires entering a short-term PIN.
3. **Async Batch Zip Downloads**: Photographers and guests can download individual files, selected batches, or entire albums bundled as ZIP packages. Large ZIP compilation runs asynchronously in the background.
4. **Cloud Storage Pipeline**: Integrates directly with Cloudinary using memory buffers to secure uploads and stream photos safely. Exposes responsive image transformations for lighting-fast thumbnail displays.
5. **Analytics Dashboard**: Tracks real-time analytics data including QR scans, visits, total page views, downloads, and guest contributions.

---

## 🛠️ Tech Stack
- **Frontend**: React.js (Vite), Bootstrap 5, Axios, React Hook Form, React Toastify, Lucide Icons, Framer Motion, Yet Another Lightbox, Masonry Grid.
- **Backend**: Node.js (Express), MongoDB (Mongoose), JWT, BcryptJS, Helmet, CORS, Express-Rate-Limit, Streamifier, Archiver, QRCode.

---

## 💻 Local Setup & Quick Start

### 1. Database Configuration
Ensure MongoDB is running locally:
```bash
mongod
```

### 2. Environment Configurations
Ensure backend variables are configured inside `eventsnap/backend/.env`:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/eventsnap
JWT_SECRET=super_secret_jwt_key_change_in_production
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
```

Ensure frontend variables are configured inside `eventsnap/frontend/.env`:
```env
VITE_API_URL=http://localhost:5001/api
VITE_APP_URL=http://localhost:5173
```

### 3. Execution Commands
Open two terminal windows to execute the client and server concurrently:

**Run API Server:**
```bash
cd eventsnap/backend
npm install
npm run dev
```

**Run React Frontend:**
```bash
cd eventsnap/frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Production Deployment Guide

### Backend (Render / AWS)
1. Deploy the `eventsnap/backend/` subfolder.
2. Configure environment variables in the host dashboard.
3. Set `NODE_ENV=production` and use MongoDB Atlas.

### Frontend (Vercel / Netlify)
1. Deploy the `eventsnap/frontend/` subfolder.
2. Ensure Vercel routing rules proxy `/api/*` to the production backend URL if required, or update `VITE_API_URL` to point to the hosted backend directly.
