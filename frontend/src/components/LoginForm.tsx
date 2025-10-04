"use client"
import { useState, type FormEvent, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router"
import { toast, Toaster } from "sonner"
import { useAppDispatch } from "../hooks"
import { login } from "../features/auth/authSlice"
import { redirectAfterLogin } from "../utils/roleRedirect"

interface Props {
  role: "admin" | "user"
  goBack: () => void
}

export default function LoginForm({ role, goBack }: Props) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "delaying">(
    "idle"
  )
  const [shake, setShake] = useState(false)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // cleanup timers if component unmounts mid-delay
  useEffect(() => {
    let t: number | undefined
    return () => {
      if (t) clearTimeout(t)
    }
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    try {
      const result = await dispatch(login({ username, password, role })
      ).unwrap()

      toast.success("Login successful 🎉", {
        description: "Redirecting you to your dashboard...",
      })

      setStatus("delaying")

      const timer = window.setTimeout(() => {
        redirectAfterLogin(result.user, navigate)
      }, 1200)

    } catch (err: any) {

      toast.error(err?.message || "Invalid username or password ❌", {
        description: "Please check your credentials and try again.",
      })

      setShake(true)

      setTimeout(() => setShake(false), 700)

      setStatus("idle")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      <motion.div
        animate={
          shake
            ? { x: [0, -8, 8, -6, 6, -4, 4, 0] }
            : { x: 0 }
        }
        transition={{ duration: 0.65, ease: "easeInOut" }}
      >
        <Card className="w-full max-w-md min-w-[320px] bg-white/80 backdrop-blur-sm border-rose-200 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-rose-800">
              Login as {role === "admin" ? "Admin" : "User"}
            </CardTitle>
            <CardDescription className="text-rose-600">
              Sign in to your {role} account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-rose-700">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-rose-200 focus:border-rose-400 focus:ring-rose-400/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-rose-700">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-rose-200 focus:border-rose-400 focus:ring-rose-400/20 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400 hover:text-rose-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={status === "loading" || status === "delaying"}
                className="w-full bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-medium py-2.5 transition-all duration-200 transform hover:scale-[1.02]"
              >
                {status === "loading"
                  ? "Signing in..."
                  : status === "delaying"
                    ? "Redirecting..."
                    : "Sign In"}
              </Button>

              <Button
                variant="ghost"
                type="button"
                onClick={goBack}
                disabled={status !== "idle"}
                className="w-full text-rose-600 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {status === "delaying" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
            <span className="text-rose-700 font-medium text-lg">Redirecting...</span>
          </div>
        </motion.div>
      )}

      <Toaster richColors />
    </motion.div>
  )
}
