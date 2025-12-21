import Cookies from "js-cookie"

export interface CurrentUser {
  email: string
  token: string
}

export function getCurrentUser(): CurrentUser | null {
  const token = Cookies.get("token")
  if (!token) return null

  return {
    email: "rashadul@admin.com",
    token,
  }
}
