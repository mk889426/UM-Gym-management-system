"use client"

import type { FC } from "react"
import { Button } from "../components/ui/button"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import { useAppDispatch, useAppSelector } from "../hooks"
import { logout } from "../features/auth/authSlice"

const Navbar: FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null)
  const role = useAppSelector((state) => state.auth.user?.role);
  const dispatch = useAppDispatch();


  useEffect(() => {
    console.log("role in navbar : ", role)
    // setUserRole(role)
  }, [])

  const onLogout = () => {
    dispatch(logout());
    window.location.href = "/login"
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
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-rose-50 border-b border-rose-100 text-rose-900 p-4 flex justify-between items-center shadow-sm"
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
          onClick={onLogout}
          variant="outline"
          className="border-rose-200 text-rose-700 hover:bg-rose-100 hover:text-rose-800 transition-all duration-200 bg-transparent"
        >
          Logout
        </Button>
      </div>
    </motion.nav>
  )
}

export default Navbar
