"use client"

import type { FC } from "react"
import { Button } from "../components/ui/button"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAppDispatch, useAppSelector } from "../hooks"
import { logout } from "../features/auth/authSlice"
import { toast, Toaster } from "sonner"

const Navbar: FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null)
  const role = useAppSelector((state) => state.auth.user?.role)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [status, setStatus] = useState<"idle" | "loggingOut">("idle")
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    setUserRole(role || null)
  }, [role])

  const handleLogout = () => {
    setConfirmOpen(false)
    setStatus("loggingOut")
    toast.success("Logging out…", {
      description: "Redirecting to login page...",
    })

    setTimeout(() => {
      dispatch(logout())
      localStorage.clear();
      navigate("/login")
    }, 1000)
  }

  const getDashboardLink = () => {
    switch (role) {
      case "admin":
        return "/"
      case "member":
        return "/dashboard/member"
      case "user":
        return "/dashboard/user"
      default:
        return "/"
    }
  }

  const getDashboardLabel = () => {
    switch (userRole) {
      case "admin":
        return "Admin Dashboard"
      case "member":
        return "Member Portal"
      case "user":
        return "User Portal"
      default:
        return "Dashboard"
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-rose-50 border-b border-rose-100 text-rose-900 p-4 flex justify-between items-center shadow-sm relative z-10"
      >
        <motion.div whileHover={{ scale: 1.05 }} className="text-xl font-bold text-rose-700">
          Gym Portal
        </motion.div>
        <div className="flex items-center space-x-4">
          <Link
            to={getDashboardLink()}
            className="text-rose-600 hover:text-rose-800 transition-colors duration-200 font-medium"
          >
            {getDashboardLabel()}
          </Link>
          <Button
            onClick={() => setConfirmOpen(true)}
            variant="outline"
            disabled={status === "loggingOut"}
            className="border-rose-200 text-rose-700 hover:bg-rose-100 hover:text-rose-800 transition-all duration-200 bg-transparent"
          >
            {status === "loggingOut" ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </motion.nav>

      {/* Blur overlay during logout */}
      {status === "loggingOut" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
            <span className="text-rose-700 font-medium text-lg">Logging out...</span>
          </div>
        </motion.div>
      )}

      {/* Confirmation Dialog */}
      {confirmOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6 w-80 flex flex-col items-center gap-4"
          >
            <h2 className="text-lg font-bold text-rose-800">Confirm Logout</h2>
            <p className="text-gray-600 text-center">Are you sure you want to logout?</p>
            <div className="flex gap-4 mt-2">
              <Button
                variant="ghost"
                onClick={() => setConfirmOpen(false)}
                className="text-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-rose-500 hover:bg-rose-600 text-white"
              >
                Logout
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Toaster richColors />
    </>
  )
}

export default Navbar
