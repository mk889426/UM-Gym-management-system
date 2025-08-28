// src/App.tsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppSelector } from './hooks';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MembersPage from './pages/MembersPage';
import RegisterPage from './pages/RegisterPage';
// import MemberDetailPage from './pages/MemberDetailPage';

const variants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit:  { opacity: 0, y: -20 }
};

export default function App() {
  const { token } = useAppSelector((s) => s.auth);
  const loc = useLocation();

  return (
    <>
      {token && <Navbar />}
      <AnimatePresence >
        <Routes location={loc} key={loc.pathname}>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={token ? <DashboardPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/members"
            element={token ? <MembersPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/members/:id"
            // element={token ? <MemberDetailPage /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
          <Route path="/register" element={<RegisterPage />} />

        </Routes>
      </AnimatePresence>
    </>
  );
}