import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { verifyPassword } from "@/lib/password"

export async function POST(request: Request) {
  try {
    const sql = getDb()
    const { email, password } = await request.json()

    const users = await sql`SELECT id, nome, email, senha, data_criacao FROM usuarios WHERE email = ${email}`

    if (users.length === 0) {
      return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 })
    }

    const user = users[0]

    const isValidPassword = await verifyPassword(password, user.senha)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 })
    }

    const { senha, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 })
  }
}
