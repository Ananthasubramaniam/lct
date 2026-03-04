import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'

import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Leaderboard from './pages/Leaderboard'
import Problems from './pages/Problems'
import Sync from './pages/Sync'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans">
        <Navbar session={session} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/login" element={<Login session={session} />} />

            <Route path="/leaderboard" element={
              <ProtectedRoute session={session}>
                <Leaderboard />
              </ProtectedRoute>
            } />

            <Route path="/problems" element={
              <ProtectedRoute session={session}>
                <Problems />
              </ProtectedRoute>
            } />

            <Route path="/sync" element={
              <ProtectedRoute session={session}>
                <Sync />
              </ProtectedRoute>
            } />

            <Route path="/" element={<Navigate to="/leaderboard" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
