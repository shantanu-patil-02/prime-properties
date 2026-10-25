# Prime Properties — Luxury Real Estate Advisory (Mumbai & Pune)

A full-stack luxury real estate brokerage application built with React 19, TypeScript, Express, Tailwind CSS, and Mongoose.

---

## 🚀 Quick Start (Local Development)

1. **Clone & Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill in your configuration (MongoDB URI, SMTP credentials for email alerts, etc.).

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will be running at `http://localhost:3000`.

---

## 🌐 Production Hosting Setup

The application is fully configured for standard production hosting with a built-in static asset server and API routes on port `3000` (or `PORT` from environment).

### Option 1: Render.com (Recommended — Fast & Free/Low Cost)
1. Link your GitHub repository to **Render**.
2. Create a new **Web Service**.
3. Set the following settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. In **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: your MongoDB Atlas connection string (optional; runs in in-memory fallback mode if omitted)
   - `ADMIN_EMAIL`: `shantanupatil636@gmail.com`
   - `SESSION_SECRET`: your secret string
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (for email inquiry notifications)

---

### Option 2: Railway.app
1. Go to [railway.app](https://railway.app) and create a **New Project** from your GitHub repo.
2. Railway detects the `package.json` automatically.
3. In settings, configure:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Add your environment variables in the Railway dashboard.

---

### Option 3: Docker Deployment (Cloud Run, AWS, DigitalOcean, VPS)
A multi-stage `Dockerfile` is included in the root directory.

1. **Build Docker Image**:
   ```bash
   docker build -t prime-properties:latest .
   ```

2. **Run Container**:
   ```bash
   docker run -d -p 3000:3000 \
     -e NODE_ENV=production \
     -e PORT=3000 \
     -e MONGODB_URI="your-mongodb-connection-string" \
     -e ADMIN_EMAIL="shantanupatil636@gmail.com" \
     prime-properties:latest
   ```

3. **Deploy to Google Cloud Run**:
   ```bash
   gcloud run deploy prime-properties \
     --source . \
     --port 3000 \
     --allow-unauthenticated
   ```

---

## 🛠️ Build Commands
- `npm run dev`: Starts the unified full-stack server (Vite middleware + Express API)
- `npm run build`: Compiles frontend into `/dist` for high-performance production serving
- `npm start`: Runs the production Express server serving `/dist` and `/api/*` routes
- `npm run lint`: Verifies TypeScript types and syntax
