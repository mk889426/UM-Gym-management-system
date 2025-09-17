"use client"
import { useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { useAppDispatch } from "../hooks"
import { login } from "../features/auth/authSlice"
import { redirectAfterLogin } from "../utils/roleRedirect"   // ✅ added

interface Props {
  role: "admin" | "user"
  goBack: () => void
}

export default function LoginForm({ role, goBack }: Props) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading">("idle")

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    try {
      // 🔥 changed expectedRole → role
      const result = await dispatch(login({ username, password, role })).unwrap()
      toast.success("Login successful 🎉")
      redirectAfterLogin(result.user, navigate) // ✅ centralized redirect
    } catch (err: any) {
      toast.error(err || "Invalid username or password")
    } finally {
      setStatus("idle")
    }
  }

  return (
    <Card className="w-full max-w-md min-w-[320px] bg-white/80 backdrop-blur-sm border-rose-200 shadow-xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold text-rose-800">
          Login as {role === "admin" ? "Admin" : "User"}
        </CardTitle>
        <CardDescription className="text-rose-600">Sign in to your {role} account</CardDescription>
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
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-medium py-2.5 transition-all duration-200 transform hover:scale-[1.02]"
          >
            {status === "loading" ? "Loading..." : "Sign In"}
          </Button>

          <Button
            variant="ghost"
            type="button"
            onClick={goBack}
            className="w-full text-rose-600 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
