import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import AIReasoning from './pages/AIReasoning'
import ROIExperiments from './pages/ROIExperiments'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import { initializeDarkMode, toggleDarkMode as toggleTheme } from './utils/theme'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDark = initializeDarkMode()
    setDarkMode(isDark)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = toggleTheme()
    setDarkMode(newDarkMode)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-reasoning" element={<AIReasoning />} />
          <Route path="/roi-experiments" element={<ROIExperiments />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App