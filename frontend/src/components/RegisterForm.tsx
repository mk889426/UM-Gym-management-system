"use client"
import { useState, type FormEvent } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { useAppDispatch } from "../hooks"
import { register } from "../features/auth/authSlice"
import { useNavigate } from "react-router"

interface Props {
  goBack: () => void
}

export default function RegisterForm({ goBack }: Props) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<"idle" | "loading">("idle")

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    try {
      const result = await dispatch(register({ username, password, role: "user" })).unwrap()
      toast.success("Registration successful 🎉")
      navigate(`/user/${result.user.id}`)
    } catch (err: any) {
      toast.error(err || "Registration failed")
    } finally {
      setStatus("idle")
    }
  }

  return (
    <Card className="w-full min-w-[320px] max-w-md bg-white/80 backdrop-blur-sm border-rose-200 shadow-xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold text-rose-800">Register</CardTitle>
        <CardDescription className="text-rose-600">Create a new user account</CardDescription>
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
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-rose-200 focus:border-rose-400 focus:ring-rose-400/20"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-medium py-2.5 transition-all duration-200 transform hover:scale-[1.02]"
          >
            {status === "loading" ? "Loading..." : "Register"}
          </Button>

          <Button variant="ghost" type="button" onClick={goBack} className="w-full text-rose-600 flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
