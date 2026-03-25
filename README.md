# Social Post App

A full-stack social media application built with React, Node.js, Express, and MongoDB.

## Tech Stack
- Frontend: React.js + Vite + React Bootstrap
- Backend: Node.js + Express.js
- Database: MongoDB Atlas
- Image Storage: Cloudinary

## Local Setup

### Backend
```bash
cd server
npm install
# Create server/.env with: MONGO_URI, JWT_SECRET, PORT, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, FRONTEND_URL
node server.js
```

### Frontend
```bash
cd ..
npm install
# Create .env with: VITE_API_URL=http://localhost:5000
npm run dev
```

## Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

After making all these fixes, show me a summary of every file that was changed and what was changed in each file.
