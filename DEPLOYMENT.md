# MERN-Auth Deployment Guide

## ✅ PRODUCTION SETUP COMPLETED!

**Your app is now configured for single-server deployment:**
- React build integrated into Express server
- Both frontend and API served from http://localhost:4000
- Static files served from `/server/public` directory
- Ready for production deployment

---

## 🚀 Free Deployment Options

### Option 1: Railway + Vercel (Recommended)

#### Backend Deployment (Railway)
1. **Create Railway Account**: Go to [railway.app](https://railway.app)
2. **Connect GitHub**: Link your GitHub account
3. **Deploy Backend**:
   ```bash
   # Push your code to GitHub first
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/mern-auth.git
   git push -u origin main
   ```
4. **In Railway Dashboard**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Set root directory to `/server`
   - Add environment variables:
     ```
     NODE_ENV=production
     MONGODB_URI=your-mongodb-atlas-connection-string
     JWT_SECRET=your-strong-jwt-secret
     BREVO_API_KEY=your-brevo-api-key
     SENDER_EMAIL=your-sender-email
     FRONTEND_URL=https://your-app.vercel.app
     ```

#### Frontend Deployment (Vercel)
1. **Create Vercel Account**: Go to [vercel.com](https://vercel.com)
2. **Connect GitHub**: Link your GitHub account
3. **Deploy Frontend**:
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `/client`
   - Add environment variable:
     ```
     REACT_APP_API_URL=https://your-backend.railway.app/api
     ```
   - Deploy

### Option 2: Render (Full-Stack)
1. **Backend on Render**:
   - Create account at [render.com](https://render.com)
   - New Web Service from GitHub
   - Root directory: `/server`
   - Build command: `npm install`
   - Start command: `npm start`

2. **Frontend on Render**:
   - New Static Site from GitHub
   - Root directory: `/client`
   - Build command: `npm run build`
   - Publish directory: `build`

### Option 3: Netlify + Railway
1. **Backend**: Use Railway (same as Option 1)
2. **Frontend**: Use Netlify
   - Connect GitHub to [netlify.com](https://netlify.com)
   - Deploy from repository
   - Set build directory to `/client`
   - Build command: `npm run build`
   - Publish directory: `build`

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**: [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Create Cluster**:
   - Choose free tier (M0)
   - Select region closest to your users
   - Create cluster
3. **Setup Database Access**:
   - Create database user
   - Add your deployment platform IPs to whitelist (or use 0.0.0.0/0 for all)
4. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

## 🌐 Domain Configuration (Optional)

### Custom Domain Setup
1. **Purchase Domain**: From any domain registrar
2. **Configure DNS**:
   - Point your domain to your hosting platform
   - Add CNAME records as required by your platform
3. **SSL Certificate**: Most platforms provide free SSL certificates

## 📊 Environment Variables Summary

### Backend (.env)
```
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mernauth
JWT_SECRET=your-super-strong-jwt-secret-key-minimum-32-characters
BREVO_API_KEY=your-brevo-api-key
SENDER_EMAIL=your-verified-sender-email@domain.com
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env.production)
```
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## 🚀 Deployment Steps

### 1. Prepare Repository
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Ready for deployment"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/mern-auth.git
git branch -M main
git push -u origin main
```

### 2. Deploy Backend First
- Follow backend deployment steps for your chosen platform
- Note the deployed backend URL

### 3. Deploy Frontend
- Update frontend environment variables with backend URL
- Deploy frontend using your chosen platform

### 4. Test Deployment
- Visit your deployed frontend URL
- Test registration, login, email verification
- Check all functionality works

## 🔧 Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure FRONTEND_URL matches your deployed frontend domain
2. **Database Connection**: Check MongoDB Atlas IP whitelist and connection string
3. **Email Issues**: Verify Brevo API key and sender email
4. **Build Failures**: Check logs for missing dependencies or environment variables

### Platform-Specific Tips:
- **Railway**: Supports automatic deployments from GitHub
- **Vercel**: Excellent for React apps, automatic SSL
- **Render**: Good for full-stack apps, free tier available
- **Netlify**: Great for static sites, easy custom domains

## 💡 Production Optimizations

1. **Enable gzip compression**
2. **Set up CDN for static assets**
3. **Implement proper logging**
4. **Set up monitoring and alerts**
5. **Configure backup strategies**
6. **Implement rate limiting**
7. **Add security headers**

## 📈 Scaling Considerations

- **Database**: Upgrade MongoDB Atlas tier as needed
- **Backend**: Use load balancers for high traffic
- **Frontend**: Implement CDN for global distribution
- **Caching**: Add Redis for session/data caching

Choose the deployment option that best fits your needs and budget. All options above offer free tiers suitable for development and small-scale production use.
