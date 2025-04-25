import { useStore } from '../stores/useStore'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useStore()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}