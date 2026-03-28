"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card"
import { Dumbbell } from "lucide-react"
import { Button } from "../components/ui/button"
import LoginForm from "../components/LoginForm"
import RegisterForm from "../components/RegisterForm"

export default function StartPage() {
  const [view, setView] = useState<"start" | "login-admin" | "login-user" | "register">("start")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-white px-4">
      {/* floating background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-rose-100 rounded-full opacity-20"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-200 rounded-full opacity-20"
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        {view === "start" && (
          <Card className="w-full min-w-[320px] bg-white/80 backdrop-blur-sm border-rose-200 shadow-xl text-center">
            <CardHeader className="space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full flex items-center justify-center"
              >
                <Dumbbell className="w-8 h-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-rose-800">Gym Management Portal</CardTitle>
              <CardDescription className="text-rose-600">Choose how you want to continue</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <Button onClick={() => setView("login-admin")} className="bg-rose-500 hover:bg-rose-600 text-white">
                Login as Admin
              </Button>
              <Button onClick={() => setView("login-user")} className="bg-rose-400 hover:bg-rose-500 text-white">
                Login as User
              </Button>
              <Button onClick={() => setView("register")} variant="outline" className="border-rose-300 text-rose-600">
                Register
              </Button>
            </CardContent>
          </Card>
        )}

        {view === "login-admin" && <LoginForm role="admin" goBack={() => setView("start")} />}
        {view === "login-user" && <LoginForm role="user" goBack={() => setView("start")} />}
        {view === "register" && <RegisterForm goBack={() => setView("start")} />}
      </motion.div>
    </div>
  )
}
