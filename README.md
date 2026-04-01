# AI Coding Mentor 🚀

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

A modern, full-stack AI-powered coding mentor designed to help developers solve bugs and learn best practices. Instead of just generating the raw code solutions, this chatbot employs a **Socratic mentoring** approach—asking guiding questions, pointing out conceptual errors, and providing hints to help you write the code yourself!

## 🌟 Features

- **Socratic Mentorship**: Leveraging Google's **Gemini 2.5 API**, the AI is strictly instructed to review your code and guide you conceptually.
- **Advanced UI/UX**: Built with Framer Motion and modern **glassmorphism** design principles.
- **IDE-like Code Rendering**: Integrates `react-markdown` and VS Code-style syntax highlighting for rich, readable code blocks.
- **Contextual Memory**: Built-in chat history lets the mentor remember your previous messages and code context within the session.
- **Vercel Serverless Ready**: Packaged as a unified monorepo perfectly optimized for easy deployment to Vercel.

---

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite)** with dynamic hooks.
- **Tailwind CSS** for responsive, utility-first styling.
- **Framer Motion** for fluid micro-animations.
- **Lucide React** for crisp, scalable icon sets.

### Backend
- **Node.js & Express.js** providing a robust API architecture.
- **Google GenAI / Fetch** to interact seamlessly with Google's LLM ecosystem.
- Custom memory and robust intent detection services.

---

## 🚀 Getting Started Locally

### 1. Requirements
Ensure you have [Node.js](https://nodejs.org/) installed along with a valid **Google Gemini API Key**.

### 2. Configure Environment
Create a `.env` file inside the `backend/` directory:
```env
PORT=5000
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

### 3. Start the Backend Server
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
node server.js
```

### 4. Start the Frontend Application
Open a second terminal window for the React frontend:
```bash
cd frontend-app
npm install
npm run dev
```

Visit `http://localhost:5173` to start chatting with your mentor!

---

## ☁️ Deployment (Vercel)

This application is ready out-of-the-box to be deployed as a single unified project on Vercel.

1. **Push your code to GitHub.**
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and "Import Project".
3. **Important Configuration:**
   - Leave the root directory as `/` (do not select frontend or backend).
   - In your Environment Variables, add `GEMINI_API_KEY`.
4. Vercel will automatically read the `vercel.json` file, build the React App, and run the Express backend as Serverless Functions (`/api/*`).

---

*Powered by AI* ✨
