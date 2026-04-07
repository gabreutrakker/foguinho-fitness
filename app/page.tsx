"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Loader2 } from "lucide-react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      router.push("/home")
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
    </div>
  )
}
