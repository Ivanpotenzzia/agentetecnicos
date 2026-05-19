import { Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Llamadas from './pages/Llamadas'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-brand-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Panel de Llamadas</h1>
            <p className="text-brand-100 text-xs">Captación de técnicos — Juanfran</p>
          </div>
          <nav className="flex gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-white text-brand-700' : 'text-white hover:bg-brand-700'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/llamadas"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-white text-brand-700' : 'text-white hover:bg-brand-700'
                }`
              }
            >
              Llamadas
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/llamadas" element={<Llamadas />} />
        </Routes>
      </main>
    </div>
  )
}
