import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { hashPassword } from "@/lib/password"

export async function POST(request: Request) {
  try {
    const sql = getDb()
    const { name, email, password } = await request.json()

    const existingUsers = await sql`SELECT id FROM usuarios WHERE email = ${email}`

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    const result = await sql`
      INSERT INTO usuarios (nome, email, senha) 
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id, nome, email, data_criacao
    `

    const user = result[0]

    await sql`
      INSERT INTO pet (usuario_id, nome, nivel, experiencia, energia, felicidade, estagio) 
      VALUES (${user.id}, 'Foguinho', 1, 0, 100, 100, 'bebe')
    `

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error("[v0] Register error:", error)
    return NextResponse.json({ error: "Erro ao criar conta" }, { status: 500 })
  }
}
