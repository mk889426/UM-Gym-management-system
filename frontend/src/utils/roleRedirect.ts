import { type NavigateFunction } from "react-router-dom"

export function redirectAfterLogin(
  user: { id: string; role: string },
  navigate: NavigateFunction
) {
  switch (user.role) {
    case "admin":
      navigate("/dashboard")
      break
    case "member":
      navigate(`/member/${user.id}`)
      break
    case "user":
      navigate(`/user/${user.id}`)
      break
    default:
      navigate("/") 
  }
}
