/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const recapchaTokenVarification=async(token:string)=>{
   try {
     const res=await fetch("https://www.google.com/recaptcha/api/siteverify",{
        method:"POST",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded",
        },
        body:new URLSearchParams({
            secret:process.env.NEXT_PUBLIC_RECAPCHA_SERVER_KEY!,
            response:token
        })
    })
    return res.json()
   } catch (error:any) {
    return Error(error)
   }
}