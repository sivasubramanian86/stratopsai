# StratOpsAI GUI Prototype

A modern, responsive web application showcasing the StratOpsAI platform vision - an AI-powered strategic operations platform for SLA breach prediction, churn analysis, and uplift modeling.

## 🚀 Features

- **AI Reasoning Engine**: Interactive form to analyze customer data with simulated AI predictions
- **ROI Experiments**: Showcase autonomous experimentation framework with mock experiment cards
- **Strategic Dashboard**: Real-time KPIs, alerts, and customer health metrics (simulated)
- **Responsive Design**: Mobile-first approach with dark mode support
- **Modern UI/UX**: Built with React, Vite, and Tailwind CSS
- **Animated Transitions**: Smooth page transitions and micro-interactions

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with PostCSS
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Build Tool**: Vite with HMR
- **Linting**: ESLint with React rules

## 📦 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd StratOpsAI/gui-prototype

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Development Server
The app will be available at `http://localhost:3000` with hot module replacement enabled.

## 📱 Pages Overview

### 🏠 Home
- Hero section with value proposition
- Feature highlights with animated cards
- Call-to-action sections

### 🧠 AI Reasoning
- Interactive customer analysis form
- Simulated AI predictions for:
  - SLA Breach Risk
  - Churn Propensity  
  - Uplift Potential
- Strategic narrative generation

### 🧪 ROI Experiments
- Autonomous experimentation showcase
- Mock experiment cards with metrics
- WOW factor section highlighting AI capabilities

### 📊 Dashboard
- Real-time KPIs and metrics
- Alert notifications panel
- Recent predictions table
- Customer health overview

### ℹ️ About
- Team information and bios
- System architecture diagram
- Hackathon story and mission
- Key achievements showcase

## 🎨 Design System

### Colors
- **Primary**: Blue variants (blue-50 to blue-900)
- **Success**: Green variants (green-500, green-600)
- **Warning**: Yellow variants (yellow-500, yellow-600)
- **Danger**: Red variants (red-500, red-600)

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Primary and secondary variants
- **Forms**: Clean input fields with focus states
- **Navigation**: Responsive navbar with mobile menu

### Dark Mode
Toggle between light and dark themes with persistent localStorage and system preference detection.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation with dark mode toggle
│   └── Footer.jsx      # Site footer with links
├── pages/              # Route components
│   ├── Home.jsx        # Landing page
│   ├── AIReasoning.jsx # AI analysis interface
│   ├── ROIExperiments.jsx # Experiments showcase
│   ├── Dashboard.jsx   # Metrics dashboard
│   └── About.jsx       # Team and info page
├── data/               # Mock data and utilities
│   └── mockData.js     # Simulated API responses
├── utils/              # Helper functions
├── App.jsx             # Main app component
├── main.jsx            # React entry point
└── index.css           # Global styles and Tailwind
```

## 🔧 Configuration Files

- **vite.config.js**: Vite build configuration
- **tailwind.config.js**: Tailwind CSS customization
- **postcss.config.js**: PostCSS configuration for Tailwind
- **package.json**: Dependencies and scripts
- **.env.example**: Environment variables template
- **.eslintrc.cjs**: ESLint configuration
- **.gitignore**: Git exclusion patterns

## 🚀 Deployment

### Netlify
```bash
# Build the project
npm run build

# Deploy dist/ folder to Netlify
# Or connect GitHub repo for automatic deployments
```

### AWS Amplify
```bash
# Use amplify.yml for build configuration
# Connect GitHub repository
# Automatic deployments on push
```

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🎯 Mock Data

The application uses simulated data for demonstration:

- **AI Predictions**: Realistic probability calculations based on input parameters
- **Dashboard Metrics**: Static KPIs with realistic values
- **Experiments**: Mock ROI experiment data with status tracking
- **Alerts**: Simulated real-time notifications

## 🌟 Key Features Showcase

### Intelligent Form Processing
The AI Reasoning page transforms business-friendly inputs into technical metrics:
- Priority + Severity → SLA Score calculation
- Customer Tier → Usage trends and contract values
- Issue Category → Support ticket predictions

### Responsive Design
- Mobile-first approach with Tailwind breakpoints
- Collapsible navigation with smooth animations
- Adaptive grid layouts using CSS Grid
- Touch-friendly interactions and hover states

### Performance Optimized
- Vite for fast development and builds
- Code splitting with React Router
- Optimized bundle size with tree shaking
- PostCSS for efficient CSS processing
- ESLint for code quality assurance

### Enhanced Dark Mode
- System preference detection
- Smooth theme transitions
- Persistent user preference
- Comprehensive dark mode coverage

## 🔮 Future Enhancements

- Real API integration with AWS backend
- User authentication and authorization
- Advanced data visualization with charts
- Real-time WebSocket connections
- Progressive Web App (PWA) features
- Internationalization (i18n) support
- TypeScript migration for better type safety
- Unit and integration testing with Vitest

## 📄 License

This project is built for hackathon demonstration purposes. See the main StratOpsAI repository for licensing information.

## 🤝 Contributing

This is a prototype application. For contributions to the main StratOpsAI platform, please refer to the root repository guidelines.

---

**Built with ❤️ for the StratOpsAI Hackathon**