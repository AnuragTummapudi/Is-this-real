# Is this Real? Frontend

React frontend for the deepfake/media forensics workflow. It calls your Colab + ngrok backend for image, video, and URL/article analysis.

## Stack
- React + Vite
- Modular component architecture
- Environment-based API URL (`VITE_API_BASE_URL`)

## Project Structure

```text
src/
  components/
    common/
      Cursor.jsx
      Intro.jsx
      SectionDivider.jsx
    layout/
      Footer.jsx
      Hero.jsx
      NavBar.jsx
    screens/
      UploadScreen.jsx
      AnalyzingScreen.jsx
      ResultsScreen.jsx
  hooks/
    useCustomCursor.js
    useReveal.js
  styles/
    app.css
  utils/
    api.js
    constants.js
    report.js
  App.jsx
  main.jsx
```

## Local Setup

1. Install dependencies:
```bash
npm install
```

2. Add environment config:
```bash
cp .env.example .env
```

3. Set backend URL in `.env`:
```env
VITE_API_BASE_URL=https://your-ngrok-url.ngrok-free.app
```

4. Run frontend:
```bash
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

Deploy `dist/` to Netlify, Vercel, Cloudflare Pages, or any static host.

## Backend Contract

This UI expects:
- `POST /api/analyze/image` (multipart file)
- `POST /api/analyze/video` (multipart file)
- `POST /api/analyze/url` (json `{ url, type: "auto" }`)

