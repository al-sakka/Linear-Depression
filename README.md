<div align="center">

# 🧠 LinearMind

### The Interactive AI-Powered Learning Platform for Linear Regression

*From zero to neural networks — master regression through hands-on visualizations, gradient descent training, and an AI tutor.*

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase)](https://firebase.google.com/)

</div>

---

## 📖 Overview

**LinearMind** is a full-stack interactive web application designed to teach Linear Regression from the ground up. It combines structured curriculum, real-time visualizations, a hands-on regression playground, AI-powered tutoring, quizzes, code examples, and a gamified progress system — all wrapped in a polished dark-mode UI with glassmorphism design.

The platform covers the entire journey: from "What is a line?" all the way to "A neuron IS linear regression" — bridging classical statistics with modern deep learning.

---

## ✨ Features at a Glance

| Category | What You Get |
|---|---|
| 📚 **Curriculum** | 12 modules, 26 lessons with rich markdown content |
| 🎮 **Playground** | Click-to-add regression canvas with polynomial fit, gradient descent training, manual line mode |
| 📊 **Visualizations** | 15+ interactive visualizations (slope-intercept, cost function, gradient descent, 3D loss landscape, residuals, etc.) |
| 🤖 **AI Tutor** | Gemini-powered chatbot with 4 explanation modes (Beginner, Engineer, Child, Math) |
| 📝 **Quizzes** | 83 questions across 4 types (conceptual, visual, scenario, prediction) and 3 difficulty levels |
| 💻 **Code Examples** | 8 real-world code examples in Python, JavaScript, and TypeScript |
| 🏆 **Achievements** | 10 unlockable achievements with streak tracking and XP system |
| 🔐 **Auth** | Google Sign-In via Firebase Authentication |
| ☁️ **Cloud Sync** | Progress persisted to Firestore, synced across devices |
| 📱 **Responsive** | Mobile-first design with touch support on all interactive elements |

---

## 🗂️ Project Structure

```
linearmind/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── page.tsx                  # Landing page (animated hero canvas)
│   │   ├── login/page.tsx            # Google Sign-In page
│   │   ├── dashboard/page.tsx        # User dashboard with circular progress rings
│   │   ├── learn/
│   │   │   ├── page.tsx              # Module grid overview
│   │   │   ├── [moduleId]/page.tsx   # Lesson list per module
│   │   │   └── [moduleId]/[lessonId]/page.tsx  # Lesson view with visualization
│   │   ├── quiz/page.tsx             # Module-based quiz system
│   │   ├── playground/page.tsx       # Interactive regression playground
│   │   ├── examples/page.tsx         # Code examples (Python/JS/TS)
│   │   ├── achievements/page.tsx     # Achievement gallery
│   │   ├── api/chat/route.ts         # Gemini AI chat API endpoint
│   │   ├── globals.css               # Design system (CSS variables, animations)
│   │   └── layout.tsx                # Root layout (fonts, providers, navbar, chatbot)
│   ├── components/
│   │   ├── ai/
│   │   │   └── ChatBot.tsx           # Floating AI chatbot with markdown + KaTeX
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx      # Firebase auth context provider
│   │   │   └── RequireAuth.tsx       # Route protection HOC
│   │   ├── layout/
│   │   │   └── Navbar.tsx            # Responsive nav with mobile hamburger menu
│   │   └── visualizations/           # All interactive visualization components
│   │       ├── RegressionCanvas.tsx   # Basic scatter + regression line
│   │       ├── SlopeInterceptViz.tsx  # Slope/intercept slider explorer
│   │       ├── CostFunctionViz.tsx    # MSE cost function visualizer
│   │       ├── GradientDescentViz.tsx # 2D gradient descent animation
│   │       ├── GradientDescent3DViz.tsx # 3D contour plot with ball descent
│   │       ├── TrainingViz.tsx        # Training loop with live loss chart
│   │       ├── ResidualsViz.tsx       # Residual analysis (scatter + distribution)
│   │       ├── FailureCasesViz.tsx    # Outliers, nonlinear, heteroscedasticity
│   │       ├── ComparisonViz.tsx      # Linear vs polynomial vs ridge comparison
│   │       ├── MultivariateViz.tsx    # Multi-feature regression explorer
│   │       ├── FeatureScalingViz.tsx  # Min-max vs Z-score normalization
│   │       ├── CorrelationViz.tsx     # Correlation vs causation demo
│   │       ├── BiasVarianceViz.tsx    # Underfitting ↔ overfitting tradeoff
│   │       ├── MetricsViz.tsx         # R², MSE, MAE, RMSE comparison
│   │       └── NeuronBridgeViz.tsx    # Linear regression → neural network bridge
│   └── lib/
│       ├── curriculum.ts             # All 12 modules, 26 lessons, content
│       ├── quiz-data.ts              # 83 quiz questions with explanations
│       ├── store.ts                  # Zustand store (progress, XP, streaks, achievements)
│       ├── firebase.ts               # Firebase app initialization
│       ├── firestore.ts              # Firestore read/write for user progress
│       └── useHydrated.ts            # SSR hydration safety hook
├── public/                           # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── .env.local                        # Firebase + Gemini API keys
```

---

## 📚 Curriculum (12 Modules, 26 Lessons)

### Module 1: 🎯 Introduction
- **What is Linear Regression?** — Foundation of predictive modeling with interactive regression canvas
- **Why Do We Need It?** — Real-world applications (real estate, finance, healthcare, climate)

### Module 2: 📐 The Mathematics
- **Equation of a Line** — y = mx + b deep dive with slope-intercept interactive sliders
- **Making Predictions** — How the model uses the equation for inference

### Module 3: 📉 Cost Function
- **Understanding Error** — What prediction error means and why it matters
- **Mean Squared Error** — MSE visualization with interactive cost function explorer
- **Residual Analysis** — Residual plots, ±1σ bands, distribution analysis

### Module 4: 🔽 Gradient Descent
- **Finding the Minimum** — Optimization intuition with animated gradient descent
- **3D Loss Landscape** — Contour plot visualization with ball descent animation
- **Learning Rate** — Effects of too-small, too-large, and just-right learning rates

### Module 5: 🏋️ Training Process
- **Training Loop** — Epochs, convergence, and live loss tracking with animated training

### Module 6: ⚠️ Failure Cases
- **When Lines Fail** — Outliers, nonlinear data, heteroscedasticity, multicollinearity

### Module 7: 🔄 Comparison
- **Method Comparison** — Linear vs polynomial vs ridge regression side-by-side
- **Polynomial Regression** — Feature engineering, Vandermonde matrix, overfitting, scikit-learn code

### Module 8: 📊 Multivariable Regression
- **Multiple Features** — Extending to multiple inputs
- **Matrix Formulation** — Normal equation (X^T X)^{-1} X^T y
- **Feature Scaling** — Min-max normalization vs Z-score standardization
- **Feature Selection & Engineering** — Choosing and creating meaningful features

### Module 9: 👁️ Data Intuition
- **Seeing Patterns in Data** — Scatter plot analysis with interactive correlation explorer
- **Correlation ≠ Causation** — Why strong correlation doesn't imply causation

### Module 10: ⚖️ Bias-Variance Tradeoff
- **Underfitting vs Overfitting** — Visual exploration of model complexity
- **Train/Test Split** — Why and how to evaluate on unseen data

### Module 11: 📏 Evaluation Metrics
- **The Metrics Zoo** — R², MSE, MAE, RMSE explained and compared visually

### Module 12: 🧬 Into Neural Networks
- **A Neuron IS Linear Regression** — Bridging y = wx + b to neural networks
- **Why We Need Layers** — From linear to non-linear with activation functions

---

## 🎮 Regression Playground

The playground is the crown jewel of LinearMind — a fully interactive regression workbench.

### Canvas Interaction
- **Click** to add data points anywhere on the canvas
- **Drag** to reposition points and watch the regression line update in real time
- **Shift+Click** to delete individual points
- **Touch support** for mobile devices
- **Coordinate tooltips** on hover

### Dataset Presets (6)
| Preset | Description |
|---|---|
| 📈 Linear | Clean linear relationship |
| 🌊 Noisy | Linear with high noise |
| ⚡ Outlier | One extreme outlier |
| 🔄 Quadratic | Curved data — linear fails here |
| 🎯 Clusters | Two separate clusters |
| 🎲 No Trend | Random scatter, no relationship |

### Visualization Toggles
- **Residual lines** — Color-coded (red/green) dashed lines from points to the regression line
- **95% Confidence band** — Shaded prediction interval
- **Grid overlay** — Coordinate grid with axis labels
- **Equation display** — Live y = mx + b label on canvas
- **Residual histogram** — Distribution of residuals centered at zero

### Manual Line Mode
- Adjust **slope** and **intercept** with sliders
- Live MSE comparison with the best-fit line
- Visual progress bar showing proximity to optimal
- "Snap to Best Fit" button

### Gradient Descent Training
- **Play/Pause/Step/Reset** controls for animated training
- Adjustable **learning rate** (0.001 – 0.5) and **steps per frame** (1 – 50)
- Live **loss bar chart** showing convergence over time
- **Convergence indicator** comparing trained parameters to optimal
- **Auto-curvature detection** — When data is curved, training automatically switches to polynomial gradient descent (degree 2 or 3), shown with a green `poly°N` badge
- Yellow training line vs faded blue best-fit reference line

### Polynomial Regression
- Toggle polynomial curve overlay (green)
- Adjustable **degree** (2–10) with named presets (Quadratic, Cubic, Quartic, Quintic)
- Live **R² comparison** between linear and polynomial fit
- **Overfitting warnings** when degree ≥ point count
- Improvement indicator (✨ or ⚠️)

### Tools
- **Noise generator** with adjustable intensity (5–100px)
- **Random point generator** (15 or 20 points)
- **CSV export** of all data points

### Statistics Dashboard
- **Slope (m)**, **Intercept (b)**, **MSE**, **MAE**, **R²**
- R² quality labels: Excellent (>0.9), Good (>0.7), Moderate (>0.4), Poor (<0.4)
- Color-coded by mode (blue = best-fit, orange = manual, yellow = training)

### Layout
- **Sticky canvas** — Left panel stays fixed while scrolling through controls
- **Scrollable control panel** — Right sidebar scrolls independently with thin custom scrollbar

### Guided Experiments (8)
1. 📏 Perfect Line — Watch MSE drop to 0
2. ⚡ Outlier Effect — See how one point pulls the line
3. 🔄 Curved Data — Linear regression can't capture curves
4. 🎛️ Manual vs Best — Try to beat the algorithm
5. 🔢 Poly Overfitting — Crank degree to 10
6. 🏋️ Watch It Learn — Gradient descent converges live
7. 🌊 Noise Stress Test — Watch R² degrade
8. 📊 Residual Check — Healthy residuals are centered at 0

---

## 📊 Interactive Visualizations (15)

Every visualization is a standalone React component with real-time interactivity:

| # | Visualization | Description |
|---|---|---|
| 1 | **RegressionCanvas** | Scatter plot with live regression line computation |
| 2 | **SlopeInterceptViz** | Dual sliders for slope and intercept with animated line |
| 3 | **CostFunctionViz** | MSE cost function parabola with draggable parameter |
| 4 | **GradientDescentViz** | 2D animated gradient descent with step visualization |
| 5 | **GradientDescent3DViz** | 3D contour plot with animated ball descent, gradient arrows, path trail |
| 6 | **TrainingViz** | Full training loop with epoch counter, loss chart (recharts), speed controls |
| 7 | **ResidualsViz** | Side-by-side scatter + residual plot with ±1σ bands, color-coded lines |
| 8 | **FailureCasesViz** | Toggleable demos: outliers, nonlinear, heteroscedasticity |
| 9 | **ComparisonViz** | Linear vs polynomial vs ridge regression comparison |
| 10 | **MultivariateViz** | Multi-feature regression with feature weight visualization |
| 11 | **FeatureScalingViz** | Before/after min-max and Z-score normalization |
| 12 | **CorrelationViz** | Interactive correlation coefficient explorer |
| 13 | **BiasVarianceViz** | Underfitting ↔ overfitting slider with visual feedback |
| 14 | **MetricsViz** | R², MSE, MAE, RMSE bars with comparative analysis |
| 15 | **NeuronBridgeViz** | Linear regression to single neuron visual bridge |

All visualizations use **HTML5 Canvas** for rendering and **Framer Motion** for UI animations. The TrainingViz also uses **Recharts** for the loss history line chart.

---

## 🤖 AI Tutor (ChatBot)

A floating chatbot powered by **Google Gemini 3 Flash** that acts as a personal AI tutor:

- **Persistent floating button** — Accessible from any page
- **4 explanation modes:**
  - 🟢 **Beginner** — Simple language, everyday analogies, no jargon
  - 🔵 **Engineer** — Technical terminology, mathematical notation
  - 🟡 **Child** — Explains like talking to a 10-year-old
  - 🔴 **Math** — Mathematical rigor, derivations, proofs
- **Markdown rendering** with `react-markdown`
- **LaTeX math support** via `remark-math` + `rehype-katex`
- **Chat history** within session
- **Clear conversation** button
- **Scoped to Linear Regression** — Redirects off-topic questions back

### API Endpoint
`POST /api/chat` — Proxies messages to Gemini API with system prompt and explanation level context.

---

## 📝 Quiz System

- **83 questions** across all 12 modules
- **4 question types:**
  - `conceptual` — Theory understanding
  - `visual` — Interpret graphs and visualizations
  - `scenario` — Real-world application problems
  - `prediction` — Calculate or predict outputs
- **3 difficulty levels:** Easy, Normal, Hard
- **Per-module quiz selection** — Choose which module to test
- **Immediate feedback** — Correct/incorrect with detailed explanations
- **Score tracking** — Best scores saved per module
- **Achievement triggers** — Perfect scores unlock module-specific achievements
- **XP rewards** — Earn XP based on quiz performance

---

## 💻 Code Examples (8)

Real-world implementation examples with syntax highlighting and one-click copy:

| # | Example | Language |
|---|---|---|
| 1 | Linear Regression with scikit-learn | Python |
| 2 | Linear Regression from Scratch | Python |
| 3 | Multivariable Regression + Feature Scaling | Python |
| 4 | Complete Model Evaluation Pipeline | Python |
| 5 | Linear Regression in JavaScript | JavaScript |
| 6 | Gradient Descent in JavaScript | JavaScript |
| 7 | Type-Safe Regression in TypeScript | TypeScript |
| 8 | Real-World Pipeline: Predict → Deploy | Python |

Each example includes:
- Full runnable code
- Language-specific icon (Python/JS/TS)
- One-click clipboard copy
- Expandable/collapsible sections

---

## 🏆 Gamification System

### XP & Leveling
- Earn **XP** for completing lessons and quizzes
- XP displayed on dashboard with animated counter

### Streaks
- Daily streak tracking (resets if a day is missed)
- Streak counter displayed on dashboard

### Achievements (10)

| Achievement | Trigger | Icon |
|---|---|---|
| First Step | Complete your first lesson | 🎉 |
| Knowledge Seeker | Complete 5 lessons | 📚 |
| Regression Master | Complete all lessons | 🏆 |
| On Fire | 3-day learning streak | 🔥 |
| Unstoppable | 7-day learning streak | ⚡ |
| Perfect Start | 100% on Introduction quiz | ⭐ |
| Math Wizard | 100% on Mathematics quiz | 🧙 |
| MSE Slayer | 100% on Cost Function quiz | ⚔️ |
| Gradient Master | 100% on Gradient Descent quiz | 🎯 |
| Failure Expert | 100% on Failure Cases quiz | 🛡️ |

### Dashboard
- **Circular progress ring** — Animated SVG ring with gradient stroke showing overall completion
- **Per-module mini progress rings** — Small circular indicators per module
- **Time-based greeting** — Good morning/afternoon/evening
- **Stat pills** — XP, streak days, badges earned
- **Quick action cards** — Jump to Quiz, Playground, or Code Examples
- **Module grid** — 2-column layout with completion status

---

## 🔐 Authentication & Data

### Firebase Authentication
- **Google Sign-In** — One-click OAuth via Firebase
- **Protected routes** — Dashboard, Learn, Quiz, Achievements require auth
- **Public routes** — Landing page, Playground, Code Examples are open
- **Auth state** managed via React context (`AuthProvider`)

### Firestore Cloud Sync
- User progress (completed lessons, quiz scores, XP, streaks, achievements) persisted to Firestore
- **Automatic sync** on login — loads cloud progress into local store
- **Automatic save** — Progress changes written to Firestore
- **Offline support** — Zustand `persist` middleware stores progress in `localStorage` as fallback

### State Management
- **Zustand** store with `persist` middleware for client-side state
- Tracks: completed lessons, quiz scores, XP, streak, last active date, achievements
- `getCompletionPercentage()` computed from curriculum total lessons
- Hydration-safe with custom `useHydrated` hook

---

## 🎨 Design System

### Theme
| Token | Value | Usage |
|---|---|---|
| `--background` | `#0a0a0f` | Page background |
| `--foreground` | `#e2e8f0` | Text color |
| `--primary` | `#6366f1` | Indigo — Primary actions, links |
| `--primary-light` | `#818cf8` | Light indigo — Hover states |
| `--secondary` | `#a855f7` | Purple — Secondary elements |
| `--accent` | `#06b6d4` | Cyan — Highlights |
| `--surface` | `#111827` | Card backgrounds |
| `--surface-light` | `#1e293b` | Elevated surfaces |
| `--success` | `#10b981` | Green — Positive indicators |
| `--warning` | `#f59e0b` | Amber — Warnings |
| `--error` | `#ef4444` | Red — Errors |

### Effects
- **Glassmorphism** — `.glass` and `.glass-strong` with backdrop blur
- **Gradient text** — `.gradient-text` (indigo → purple → cyan)
- **Gradient borders** — `.gradient-border` with transparent border trick
- **Glow effects** — `.glow` and `.glow-text` box/text shadows
- **Particle background** — `.particle-bg` dot grid pattern
- **Animations** — `float`, `pulse-glow`, `gradient-shift` keyframes

### Typography
- **Sans-serif:** Geist Sans (variable font)
- **Monospace:** Geist Mono (variable font)
- Both loaded via `next/font/local`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.2.6 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **UI Library** | React 19.2.4 |
| **Styling** | Tailwind CSS 4 (`@import "tailwindcss"`, `@theme inline`) |
| **Animations** | Framer Motion 12 |
| **Charts** | Recharts 3.8 |
| **Icons** | Lucide React |
| **State Management** | Zustand 5 (with persist middleware) |
| **Auth** | Firebase Authentication (Google provider) |
| **Database** | Cloud Firestore |
| **Analytics** | Firebase Analytics |
| **AI** | Google Gemini 3 Flash (via REST API) |
| **Math Rendering** | KaTeX (via remark-math + rehype-katex) |
| **Markdown** | react-markdown |
| **Notifications** | react-hot-toast |
| **Node.js** | ≥ 22 (required) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js ≥ 22** (use [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm))
- A **Firebase project** with Authentication (Google) and Firestore enabled
- A **Gemini API key** (optional — for the AI chatbot)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Linear-Depression.git
cd Linear-Depression/linearmind
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the `linearmind/` directory:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Gemini AI (optional — chatbot won't work without this)
GEMINI_API_KEY=your-gemini-api-key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Build for Production

```bash
npm run build
npm start
```

---

## 📄 Pages

| Route | Auth | Description |
|---|---|---|
| `/` | Public | Landing page with animated hero canvas and feature overview |
| `/login` | Public | Google Sign-In page |
| `/dashboard` | Protected | User dashboard with progress rings, stats, and quick actions |
| `/learn` | Protected | Module grid overview |
| `/learn/[moduleId]` | Protected | Lesson list for a specific module |
| `/learn/[moduleId]/[lessonId]` | Protected | Lesson content with embedded visualization |
| `/quiz` | Protected | Module-based quiz with scoring and achievements |
| `/playground` | Public | Full interactive regression playground |
| `/examples` | Public | Code examples in Python, JavaScript, TypeScript |
| `/achievements` | Protected | Achievement gallery with lock/unlock states |

---

## 🔧 Configuration

### Tailwind CSS 4
The project uses Tailwind v4's new configuration syntax:
```css
@import "tailwindcss";
@theme inline { ... }
```
Custom colors, fonts, and spacing are defined in `globals.css` using CSS custom properties mapped via `@theme inline`.

### Next.js
- App Router with file-based routing
- Dynamic routes for `[moduleId]` and `[lessonId]`
- API route at `/api/chat` for Gemini proxy
- Static generation for most pages, dynamic for lesson/module routes

---

## 📊 By the Numbers

| Metric | Count |
|---|---|
| Modules | 12 |
| Lessons | 26 |
| Quiz Questions | 83 |
| Visualizations | 15 |
| Code Examples | 8 |
| Achievements | 10 |
| Dataset Presets | 6 |
| Guided Experiments | 8 |
| AI Explanation Modes | 4 |
| Source Files | 39 |

---

## 📜 License

This project is for educational purposes.

---

<div align="center">

*Built with ❤️ for anyone who wants to truly understand Linear Regression.*

**LinearMind** — Because the best way to learn is to play.

</div>