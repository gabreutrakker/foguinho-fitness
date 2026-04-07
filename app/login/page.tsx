"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "@/lib/auth"
import { Flame } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await login(email, password)

    if (result.success) {
      router.push("/home")
    } else {
      setError(result.error || "Erro ao fazer login")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-2 border-orange-200">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-full">
              <Flame className="w-12 h-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-orange-600">Foguinho Fitness</CardTitle>
          <CardDescription className="text-base">
            Entre para cuidar do seu Foguinho e conquistar seus objetivos!
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-orange-600 hover:text-orange-700 font-semibold">
                Cadastre-se
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
