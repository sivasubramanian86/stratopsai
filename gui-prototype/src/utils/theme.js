// Theme utility functions
export const toggleDarkMode = () => {
  const isDark = document.documentElement.classList.contains('dark')
  const newDarkMode = !isDark
  
  if (newDarkMode) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  
  localStorage.setItem('darkMode', newDarkMode.toString())
  return newDarkMode
}

export const initializeDarkMode = () => {
  const savedDarkMode = localStorage.getItem('darkMode')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  const shouldBeDark = savedDarkMode ? savedDarkMode === 'true' : prefersDark
  
  if (shouldBeDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  
  return shouldBeDark
}