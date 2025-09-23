// src/App.tsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAppSelector } from './hooks'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import UserHomepage from './pages/UserHomepage'
import MemberHomepage from './pages/MembersPage'

export default function App() {
  const { token, user } = useAppSelector((s) => s.auth)
  const loc = useLocation()

  return (
    <>
      {token && <Navbar />}
      <AnimatePresence>
        <Routes location={loc} key={loc.pathname}>
          <Route path="/login" element={<LoginPage />} />

          {/* Main route - redirect based on role */}
          <Route
            path="/"
            element={
              token ? (
                user?.role === 'admin' ? (
                  <DashboardPage />
                ) : user?.role === 'member' ? (
                  <MemberHomepage />
                ) : (
                  <UserHomepage />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Fallback route */}
          <Route
            path="*"
            element={
              <Navigate
                to={
                  token
                    ? user?.role === 'admin'
                      ? '/'
                      : user?.role === 'member'
                        ? '/'
                        : '/'
                    : '/login'
                }
              />
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  )
}
